import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { DOSSIER, UI, hasLayer, items, pick } from "./content.js?v=37";
import { background, sample, sampleCube } from "./palette.js?v=4";
import { tickTabIcon } from "./favicon.js?v=2";
import { playHover, primeSound, setUiLabels, unlockSound } from "./sound.js?v=41";

const view = document.getElementById("view");
const labelsRoot = document.getElementById("labels");
const leadEl = document.querySelector("#hint .lead");
const keyEl = document.querySelector("#hint .key");
const langButtons = [...document.querySelectorAll("#lang button[data-lang]")];

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
const CHARS_PER_FRAME = 6;
const SPIKE_GAP_MS = 340;
const HOVER_PX = 160;
const KIND_ORDER = ["dev", "art", "pm", "study", "note", "link"];

function detectLang() {
  try {
    const saved = sessionStorage.getItem("site-lang");
    if (saved === "en" || saved === "ru") return saved;
  } catch {
    // Приватный режим может запретить storage.
  }
  const list = [...(navigator.languages || []), navigator.language || ""];
  if (list.some((code) => String(code).toLowerCase().startsWith("ru"))) return "ru";
  return "en";
}

let lang = detectLang();

document.body.style.background = background;
const renderer = new THREE.WebGLRenderer({ canvas: view, antialias: true, powerPreference: "high-performance" });
renderer.setClearColor(background);
const scene = new THREE.Scene();
const CAM_Z = 14.6;
scene.fog = new THREE.Fog(background, 11, 36);
const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 48);
camera.position.set(0, 0, CAM_Z);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

// Без квантования кадра: пиксельность у самих контейнеров, здесь только короткий сбой на открытии.
const glitch = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uGlitch: { value: 0 },
    uRes: { value: new THREE.Vector2(1, 1) },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uGlitch;
    varying vec2 vUv;

    float hash(float n) { return fract(sin(n) * 43758.5453); }

    void main() {
      float q = clamp(uGlitch, 0.0, 1.0);
      float slice = floor(vUv.y * 90.0);
      float rnd = hash(slice + floor(uTime * 11.0));
      vec2 uv = vUv;
      uv.x += step(0.94, rnd) * (rnd - 0.5) * q * 0.02;
      float shift = q * 0.0035;
      float r = texture2D(tDiffuse, uv + vec2(shift, 0.0)).r;
      float g = texture2D(tDiffuse, uv).g;
      float b = texture2D(tDiffuse, uv - vec2(shift, 0.0)).b;
      gl_FragColor = vec4(r, g, b, 1.0);
    }
  `,
};
composer.addPass(new ShaderPass(glitch));

const color = new THREE.Color();
const dummy = new THREE.Object3D();

// Каждый цвет живёт в своей небольшой зоне. Петля короче зоны, поэтому куб не уходит к чужим.
const CLOUDS = {
  dev: { c: [-4.2, 1.0, -1], r: [1.7, 1.4, 1.55] },
  art: { c: [-3.7, -2.0, 0.5], r: [0.9, 0.7, 0.8] },
  pm: { c: [-0.6, -1.7, -2.5], r: [1.7, 1.4, 1.55] },
  study: { c: [4.6, 0.9, -0.6], r: [1.15, 0.95, 1.1] },
  note: { c: [1.3, 2.45, 0.6], r: [1.05, 0.75, 0.85] },
  link: { c: [3.2, -2.15, 0.9], r: [1.05, 0.75, 0.85] },
};

function scatterHomes(list) {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const members = {};
  list.forEach((item, index) => {
    (members[item.kind] ??= []).push(index);
  });
  const homes = new Array(list.length);
  for (const [name, indexes] of Object.entries(members)) {
    const { c, r } = CLOUDS[name];
    indexes.forEach((index, n) => {
      const y = 1 - ((n + 0.5) / indexes.length) * 2;
      const ring = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * n;
      homes[index] = new THREE.Vector3(
        c[0] + Math.cos(theta) * ring * r[0],
        c[1] + y * r[1],
        c[2] + Math.sin(theta) * ring * r[2],
      );
    });
  }
  return homes;
}

// Порядковый номер куба внутри kind — для уникальной ноты при hover.
const kindSlot = new Array(items.length);
{
  const seen = {};
  items.forEach((item, i) => {
    const n = seen[item.kind] ?? 0;
    kindSlot[i] = n;
    seen[item.kind] = n + 1;
  });
}

const homes = scatterHomes(items);
const guideIndex = items.findIndex((item) => item.guide);
if (guideIndex >= 0) homes[guideIndex].set(0, 0.35, 0);
const pos = homes.map((h) => h.clone());
const vel = homes.map(() => new THREE.Vector3());
const phase = homes.map((_, i) => i * 0.7);
const screenPts = homes.map(() => new THREE.Vector3());
const gap = new THREE.Vector3();

const shellGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(0.46, 0.46, 0.46));
const coreGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
const containers = items.map(() => {
  const group = new THREE.Group();
  const shell = new THREE.LineSegments(shellGeo, new THREE.LineBasicMaterial());
  const core = new THREE.Mesh(coreGeo, new THREE.MeshBasicMaterial());
  group.add(shell, core);
  scene.add(group);
  return { group, shell, core, size: 1 };
});
if (guideIndex >= 0 && !reduceMotion.matches) containers[guideIndex].size = 0.04;

const labelEls = items.map((item) => {
  const el = document.createElement("div");
  el.className = "label";
  el.hidden = true;
  const title = document.createElement("b");
  const blocks = DOSSIER.filter((layer) => hasLayer(item[layer.key])).map((layer) => {
    const section = document.createElement("section");
    section.hidden = true;
    const who = document.createElement("span");
    who.className = "who";
    const desc = document.createElement("p");
    const typed = document.createElement("span");
    desc.append(typed);
    section.append(who, desc);
    return { section, typed, who, key: layer.key, full: "" };
  });
  const caret = document.createElement("i");
  caret.className = "caret";
  const look = document.createElement("a");
  look.target = "_blank";
  look.rel = "noopener";
  look.hidden = !item.url;
  if (item.url) look.href = item.url;
  const role = document.createElement("em");
  role.className = "role";
  el.append(title, role, ...blocks.map((block) => block.section), look);
  labelsRoot.append(el);
  return { el, blocks, caret, title, role, look, item };
});

function paintLegend(ui) {
  if (!keyEl) return;
  keyEl.replaceChildren();
  KIND_ORDER.forEach((kind) => {
    const item = document.createElement("span");
    item.className = "key-item";
    const dot = document.createElement("i");
    dot.dataset.kind = kind;
    const [r, g, b] = sample(kind, 0.5);
    dot.style.background = `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
    item.append(dot, document.createTextNode(ui.kinds[kind] || kind));
    keyEl.append(item);
  });
}

function applyLang(next) {
  lang = next === "en" ? "en" : "ru";
  const ui = UI[lang];
  document.documentElement.lang = lang;
  document.title = ui.title;
  if (leadEl) leadEl.textContent = ui.lead;
  paintLegend(ui);
  setUiLabels({
    soundOn: ui.soundOn,
    soundOff: ui.soundOff,
    rhythms: ui.rhythms,
  });
  for (const btn of langButtons) {
    btn.setAttribute("aria-pressed", String(btn.dataset.lang === lang));
  }
  for (const card of labelEls) {
    const { item } = card;
    card.title.textContent = pick(item.title, lang);
    const roleText = pick(item.role, lang);
    card.role.textContent = roleText;
    card.role.hidden = !roleText;
    card.look.textContent = ui.look;
    for (const block of card.blocks) {
      const layer = DOSSIER.find((entry) => entry.key === block.key);
      block.who.textContent = pick(layer?.label, lang);
      block.full = pick(item[block.key], lang);
      block.section.hidden = !block.full;
    }
  }
  if (focus >= 0) {
    typedCount = dossierLength(labelEls[focus].blocks);
    fillDossier(labelEls[focus], typedCount);
  }
  try {
    sessionStorage.setItem("site-lang", lang);
  } catch {
    // Приватный режим может запретить storage.
  }
}

function bindChromeTap(el) {
  el.addEventListener(
    "pointerdown",
    (e) => {
      e.stopPropagation();
      primeSound();
    },
    { passive: true },
  );
}

for (const btn of langButtons) {
  bindChromeTap(btn);
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (btn.dataset.lang === lang) return;
    applyLang(btn.dataset.lang);
  });
}

const soundBtn = document.getElementById("sound");
const rhythmBtns = [...document.querySelectorAll("#rhythm button[data-rhythm]")];
if (soundBtn) bindChromeTap(soundBtn);
for (const btn of rhythmBtns) bindChromeTap(btn);

function dossierLength(blocks) {
  return blocks.reduce((sum, block) => sum + block.full.length, 0);
}

function fillDossier(ui, count) {
  let left = count;
  let caretBlock = null;
  for (const block of ui.blocks) {
    const take = Math.max(0, Math.min(block.full.length, left));
    block.section.hidden = take === 0;
    block.typed.textContent = block.full.slice(0, take);
    if (take < block.full.length) caretBlock = caretBlock || block;
    left -= block.full.length;
  }
  const host = (caretBlock || ui.blocks[ui.blocks.length - 1])?.typed.parentElement;
  if (host && ui.caret.parentElement !== host) host.append(ui.caret);
  ui.caret.hidden = count >= dossierLength(ui.blocks);
}

// Уголки рамки. Ладонь из кубиков с камеры не читалась.
const bar = (x, y, sx, sy) => ({ x, y, sx, sy });
const OPEN = [
  bar(-0.16, 0.24, 0.18, 0.028), bar(-0.24, 0.16, 0.028, 0.18),
  bar(0.16, 0.24, 0.18, 0.028), bar(0.24, 0.16, 0.028, 0.18),
  bar(-0.16, -0.24, 0.18, 0.028), bar(-0.24, -0.16, 0.028, 0.18),
  bar(0.16, -0.24, 0.18, 0.028), bar(0.24, -0.16, 0.028, 0.18),
];
const FIST = OPEN.map((b) => ({ ...b, x: b.x * 0.58, y: b.y * 0.58 }));

const avatar = new THREE.Group();
const hand = new THREE.InstancedMesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial(),
  OPEN.length,
);
hand.frustumCulled = false;
avatar.scale.setScalar(1);
avatar.add(hand);
scene.add(avatar);

const ndc = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const handPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -1.5);
const handHit = new THREE.Vector3();
const projected = new THREE.Vector3();
const target = new THREE.Vector3();

let pointerX = -1;
let pointerY = -1;
let pointerDown = false;
let focus = -1;
let typedCount = 0;
applyLang(lang);
let fist = 0;
let spike = 0;
let lastSpikeAt = -Infinity;
let camX = 0;
let camY = 0;
let panX = 0;
let panY = 0;
let drag = null;

const guide = {
  on: false,
  born: 0,
  fromX: 0,
  fromY: 0,
  nudged: 0,
  hold: false,
  clicked: false,
};

let lastMoveX = null;
let lastMoveY = null;

function stopGuide() {
  if (!guide.on) return;
  guide.on = false;
  guide.hold = false;
  pointerDown = false;
}

function startGuide() {
  if (guideIndex < 0 || reduceMotion.matches) return;
  guide.on = true;
  guide.born = performance.now();
  guide.fromX = innerWidth * 0.38;
  guide.fromY = Math.min(innerHeight * 0.78, chromeTop() - 36);
  guide.nudged = 0;
  guide.hold = false;
  guide.clicked = false;
  pointerX = guide.fromX;
  pointerY = guide.fromY;
}

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

function stepGuide() {
  if (!guide.on || guideIndex < 0) return;
  const coarse = isCoarsePointer();
  const elapsed = performance.now() - guide.born;
  const wait = 650;
  const travel = 1050;
  const press = 220;
  const hoverDwell = 500;
  if (elapsed < wait) {
    pointerX = guide.fromX;
    pointerY = guide.fromY;
    pointerDown = false;
    guide.hold = false;
    return;
  }
  const fly = Math.min(1, (elapsed - wait) / travel);
  const dest = project(pos[guideIndex], innerWidth, innerHeight);
  const k = easeOutCubic(fly);
  pointerX = guide.fromX + (dest.x - guide.fromX) * k;
  pointerY = guide.fromY + (dest.y - guide.fromY) * k;
  const after = elapsed - wait - travel;
  if (fly >= 1) {
    if (!guide.clicked) {
      guide.clicked = true;
      requestSpike(0.45);
      playHover(items[guideIndex].kind, kindSlot[guideIndex]);
    }
    guide.hold = true;
    if (coarse) {
      pointerDown = after >= 0 && after < press;
      if (after >= press) {
        guide.on = false;
        guide.hold = false;
        pointerDown = false;
        pointerX = dest.x;
        pointerY = dest.y;
      }
    } else {
      pointerDown = false;
      if (after >= hoverDwell) {
        guide.on = false;
        guide.hold = false;
        pointerX = dest.x;
        pointerY = dest.y;
      }
    }
  }
}

function requestSpike(amount) {
  const now = performance.now();
  if (now - lastSpikeAt < SPIKE_GAP_MS) return;
  lastSpikeAt = now;
  spike = Math.max(spike, amount);
}

function chromeTop() {
  let top = innerHeight - 8;
  for (const id of ["hint", "rhythm"]) {
    const node = document.getElementById(id);
    if (!node) continue;
    top = Math.min(top, node.getBoundingClientRect().top - 10);
  }
  return top;
}

function isCoarsePointer() {
  return matchMedia("(pointer: coarse)").matches
    || /iPhone|iPad|iPod/i.test(navigator.userAgent)
    || (navigator.maxTouchPoints > 0 && matchMedia("(max-width: 900px)").matches);
}

function cubeUnderPointer() {
  let nearest = -1;
  let nearestD = Infinity;
  for (let i = 0; i < items.length; i++) {
    const p = project(pos[i], innerWidth, innerHeight);
    if (p.behind) continue;
    const d = Math.hypot(p.x - pointerX, p.y - pointerY);
    if (d > cubeReach(i) || d >= nearestD) continue;
    nearestD = d;
    nearest = i;
  }
  return nearest;
}

function focusCubeAtPointer() {
  if (isCoarsePointer()) return cubeUnderPointer();
  let nearest = -1;
  let nearestD = HOVER_PX;
  for (let i = 0; i < items.length; i++) {
    const p = project(pos[i], innerWidth, innerHeight);
    if (p.behind) continue;
    const d = Math.hypot(p.x - pointerX, p.y - pointerY);
    if (d >= nearestD) continue;
    nearestD = d;
    nearest = i;
  }
  return nearest;
}

function cubeReach(i) {
  const depth = Math.max(camera.position.distanceTo(pos[i]), 1);
  const scale = containers[i].group.scale.x || 1;
  const world = 0.23 * Math.sqrt(3) * scale;
  const px = (world * innerHeight) / (2 * Math.tan((42 * Math.PI) / 360) * depth);
  return px + 12;
}

function project(v, width, height) {
  projected.copy(v).project(camera);
  return {
    x: (projected.x * 0.5 + 0.5) * width,
    y: (-projected.y * 0.5 + 0.5) * height,
    behind: projected.z > 1,
  };
}

function labelUnderPointer() {
  for (let i = 0; i < labelEls.length; i++) {
    const el = labelEls[i].el;
    if (el.hidden) continue;
    const box = el.getBoundingClientRect();
    if (pointerX >= box.left && pointerX <= box.right && pointerY >= box.top && pointerY <= box.bottom) return i;
  }
  return -1;
}

let soundLive = false;
const PAN_LIMIT_X = 7;
const PAN_LIMIT_Y = 4.5;

function worldPerPixel() {
  return (2 * Math.tan((42 * Math.PI) / 360) * CAM_Z) / Math.max(innerHeight, 1);
}

function onPointerMove(e) {
  if (guide.on) {
    if (lastMoveX !== null) {
      guide.nudged += Math.hypot(e.clientX - lastMoveX, e.clientY - lastMoveY);
    }
    lastMoveX = e.clientX;
    lastMoveY = e.clientY;
    if (guide.nudged > 80) stopGuide();
    else return;
  }
  pointerX = e.clientX;
  pointerY = e.clientY;
  if (!soundLive) unlockSound().then((ok) => { soundLive = ok; });
  if (!drag || e.pointerId !== drag.id) return;
  const dx = e.clientX - drag.x;
  const dy = e.clientY - drag.y;
  if (Math.hypot(dx, dy) > 8) drag.moved = true;
  if (!drag.moved) return;
  const k = worldPerPixel();
  panX = Math.min(PAN_LIMIT_X, Math.max(-PAN_LIMIT_X, drag.panX - dx * k));
  panY = Math.min(PAN_LIMIT_Y, Math.max(-PAN_LIMIT_Y, drag.panY + dy * k));
}

function onPointerDown(e) {
  if (guide.on) stopGuide();
  pointerX = e.clientX;
  pointerY = e.clientY;
  if (e.target.closest("#lang, #hint .lead-row, #sound, #rhythm, a, button, .label")) return;
  const hit = cubeUnderPointer();
  primeSound();
  unlockSound().then((ok) => {
    // Тап мимо куба карточку закрывает и не должен заново играть её ноту.
    if (!ok || hit < 0 || drag?.moved || focus !== hit) return;
    playHover(items[hit].kind, kindSlot[hit]);
  });
  if (e.button !== 0) return;
  drag = { id: e.pointerId, x: e.clientX, y: e.clientY, panX, panY, moved: false };
  pointerDown = true;
}

function onPointerUp(e) {
  if (e.type !== "pointercancel" && e.button !== 0) return;
  if (drag && e.pointerId === drag.id) drag = null;
  pointerDown = false;
}

addEventListener("pointermove", onPointerMove);
addEventListener("pointerdown", onPointerDown);
addEventListener("pointerup", onPointerUp);
addEventListener("pointercancel", onPointerUp);

function resize() {
  const w = innerWidth;
  const h = Math.max(innerHeight, 1);
  const dpr = Math.min(devicePixelRatio || 1, 1.5);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(dpr);
  renderer.setSize(w, h, false);
  composer.setPixelRatio(dpr);
  composer.setSize(w, h);
  glitch.uniforms.uRes.value.set(w * dpr, h * dpr);
}
addEventListener("resize", resize);
resize();

function frame(now) {
  requestAnimationFrame(frame);
  const t = now * 0.001;
  const w = innerWidth;
  const h = innerHeight;
  const calm = reduceMotion.matches;

  stepGuide();
  ndc.set((pointerX / w) * 2 - 1, -(pointerY / h) * 2 + 1);
  const drift = calm ? 0 : 1;
  const sliding = drag?.moved;
  const followPointer = !sliding && !guide.on;
  camX += (Math.sin(t * 0.12) * 0.22 * drift + (followPointer ? ndc.x * 0.28 : 0) - camX) * 0.05;
  camY += (Math.cos(t * 0.1) * 0.12 * drift + (followPointer ? ndc.y * 0.16 : 0) - camY) * 0.05;
  camera.position.set(camX + panX, camY + panY, CAM_Z);
  camera.lookAt(panX, panY, 0);

  raycaster.setFromCamera(ndc, camera);
  if (!raycaster.ray.intersectPlane(handPlane, handHit)) handHit.set(ndc.x * 2, ndc.y * 1.4, 1.5);
  avatar.position.copy(handHit);
  avatar.quaternion.copy(camera.quaternion);

  fist += ((pointerDown ? 1 : 0) - fist) * 0.22;
  const [ar, ag, ab] = sample("avatar", t * 0.04);
  hand.material.color.setRGB(ar, ag, ab);
  for (let i = 0; i < OPEN.length; i++) {
    const o = OPEN[i];
    const f = FIST[i];
    dummy.position.set(
      o.x + (f.x - o.x) * fist,
      o.y + (f.y - o.y) * fist,
      0,
    );
    dummy.scale.set(o.sx, o.sy, 0.02);
    dummy.rotation.set(0, 0, 0);
    dummy.updateMatrix();
    hand.setMatrixAt(i, dummy.matrix);
  }
  hand.instanceMatrix.needsUpdate = true;

  const amp = calm ? 0.25 : 1;
  for (let i = 0; i < items.length; i++) {
    if (i === focus) continue;
    const home = homes[i];
    const pinned = i === guideIndex;
    const sway = pinned ? 0.2 : 1;
    target.set(
      home.x + (pinned ? 0 : Math.sin(t * 0.16 + phase[i]) * 0.95 * amp),
      home.y + Math.cos(t * 0.13 + phase[i] * 1.3) * 0.7 * sway * amp,
      home.z + Math.sin(t * 0.1 + phase[i] * 0.7) * 1.05 * sway * amp,
    );
    vel[i].add(target.sub(pos[i]).multiplyScalar(0.018));
  }

  for (let i = 0; i < items.length; i++) {
    projected.copy(pos[i]).project(camera);
    screenPts[i].set(
      (projected.x * 0.5 + 0.5) * w,
      (-projected.y * 0.5 + 0.5) * h,
      projected.z,
    );
  }

  // Близко на экране или в объёме — мягко разъезжаются, пружина к дому возвращает обратно.
  // Куб, который сейчас читают, почти не толкаем: иначе карточка уезжает из-под взгляда.
  const sharePush = (i, j) => {
    if (i === focus) return [0, 1];
    if (j === focus) return [1, 0];
    return [1, 1];
  };
  const GAP = 108;
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      gap.copy(pos[j]).sub(pos[i]);
      const reach = gap.length() || 0.001;
      const kin = items[i].kind === items[j].kind ? 0.45 : 1;
      if (reach < 1.45) {
        const push = (1.45 - reach) / reach * 0.01 * kin;
        const [wi, wj] = sharePush(i, j);
        vel[i].addScaledVector(gap, -push * wi);
        vel[j].addScaledVector(gap, push * wj);
      }
      const dx = screenPts[j].x - screenPts[i].x;
      const dy = screenPts[j].y - screenPts[i].y;
      const pixels = Math.hypot(dx, dy) || 0.001;
      if (pixels >= GAP) continue;
      const push = (GAP - pixels) / GAP * 0.016 * kin;
      const nx = dx / pixels;
      const ny = dy / pixels;
      const [wi, wj] = sharePush(i, j);
      vel[i].x -= nx * push * wi;
      vel[i].y += ny * push * wi;
      vel[j].x += nx * push * wj;
      vel[j].y -= ny * push * wj;
    }
  }

  const SPEED = 0.032;
  for (let i = 0; i < items.length; i++) {
    vel[i].multiplyScalar(i === focus ? 0.45 : 0.9);
    if (i === guideIndex) vel[i].x += (homes[i].x - pos[i].x) * 0.14;
    if (i !== focus && pos[i].distanceTo(homes[i]) > 1.9) {
      gap.copy(homes[i]).sub(pos[i]).multiplyScalar(0.05);
      vel[i].add(gap);
    }
    const speed = vel[i].length();
    if (speed > SPEED) vel[i].multiplyScalar(SPEED / speed);
    pos[i].add(vel[i]);

    const node = containers[i];
    node.group.position.copy(pos[i]);
    if (i !== focus) node.group.rotation.set(0.5, t * 0.22 * amp + phase[i], 0.15);

    const [r, g, b] = sampleCube(items[i].kind, i, t, phase[i]);
    color.setRGB(r, g, b);
    node.shell.material.color.copy(color);
    node.core.material.color.copy(color);
  }

  let nearest = drag?.moved ? -1 : labelUnderPointer();
  const screens = pos.map((p) => project(p, w, h));
  if (guide.on) nearest = guide.hold ? guideIndex : -1;
  else if (drag?.moved) nearest = -1;
  else if (nearest < 0) nearest = focusCubeAtPointer();
  if (nearest !== focus) {
    focus = nearest;
    typedCount = 0;
    if (focus >= 0) {
      requestSpike(0.45);
      playHover(items[focus].kind, kindSlot[focus]);
    }
  }
  if (focus >= 0) {
    const full = dossierLength(labelEls[focus].blocks);
    const step = calm ? full : CHARS_PER_FRAME;
    if (typedCount < full) typedCount = Math.min(full, typedCount + step);
  }

  for (let i = 0; i < items.length; i++) {
    const node = containers[i];
    const active = i === focus;
    // Размер плавно дышит у каждого куба в своём ритме, активный чуть крупнее.
    const breath = calm ? 1 : 1 + Math.sin(t * (0.35 + (i % 5) * 0.06) + phase[i] * 2.1) * 0.32;
    node.size += ((active ? 1.2 : 1) - node.size) * 0.12;
    node.group.scale.setScalar(node.size * breath);
    const dim = focus >= 0 && !active ? 0.35 : 1;
    node.shell.material.transparent = true;
    node.core.material.transparent = true;
    node.shell.material.opacity = dim;
    node.core.material.opacity = dim;

    const ui = labelEls[i];
    const show = active && !screens[i].behind;
    ui.el.hidden = !show;
    if (!show) continue;
    fillDossier(ui, typedCount);
    const [r, g, b] = sampleCube(items[i].kind, i, t, phase[i]);
    ui.el.style.borderColor = `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, 0.7)`;
    const floor = chromeTop();
    ui.el.style.maxHeight = Math.max(140, floor - 16) + "px";
    const cardW = Math.min(340, w - 24);
    ui.el.style.width = cardW + "px";
    const cardH = ui.el.offsetHeight || 180;
    const x = Math.min(Math.max(screens[i].x, cardW / 2 + 12), w - cardW / 2 - 12);
    const placeBelow = screens[i].y < h * 0.45 || screens[i].y < cardH + 28;
    let y = screens[i].y;
    if (placeBelow) {
      const bottom = y + 18 + cardH;
      if (bottom > floor) y -= bottom - floor;
    } else if (y - 16 > floor) {
      y -= y - 16 - floor;
    }
    if (y - cardH - 16 < 12 && !placeBelow) y += 12 - (y - cardH - 16);
    screens[i].x = x;
    screens[i].y = y;
    ui.el.style.transform = placeBelow
      ? `translate(${screens[i].x}px, ${screens[i].y}px) translate(-50%, 18px)`
      : `translate(${screens[i].x}px, ${screens[i].y}px) translate(-50%, calc(-100% - 16px))`;
  }

  if (!calm && Math.random() < 0.0008) requestSpike(0.35);
  spike *= 0.88;
  glitch.uniforms.uTime.value = t;
  glitch.uniforms.uGlitch.value = calm ? 0 : spike;

  tickTabIcon(now);
  composer.render();
}

startGuide();
requestAnimationFrame(frame);
