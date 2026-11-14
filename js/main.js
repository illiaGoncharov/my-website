import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { DOSSIER, items } from "./content.js";
import { background, sample } from "./palette.js";

const view = document.getElementById("view");
const labelsRoot = document.getElementById("labels");

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
const LABEL_PX = 160;
const CHARS_PER_FRAME = 4;
const SPIKE_GAP_MS = 340;

document.body.style.background = background;
for (const dot of document.querySelectorAll("#hint i")) {
  const [r, g, b] = sample(dot.dataset.kind, 0.5);
  dot.style.background = `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
}
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

// Боевые (клиенты, работа, PM-кейсы) слева, пет (свои эксперименты и учёба) справа,
// заметки и ссылки живут по краям между ними.
const groupOf = (item) => {
  if (item.kind === "study" || item.pet) return "pet";
  if (item.kind === "note" || item.kind === "link") return "misc";
  return "live";
};

const CLOUDS = {
  live: { c: [-3.2, 0, -2], r: [3.9, 3.0, 5.0] },
  pet: { c: [5.2, -0.4, -1], r: [2.2, 2.0, 3.0] },
  misc: { c: [0.9, 0, 1.6], r: [1.6, 3.8, 1.4] },
};

function scatterHomes(list) {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const members = { live: [], pet: [], misc: [] };
  list.forEach((item, index) => members[groupOf(item)].push(index));
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

const homes = scatterHomes(items);
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

const labelEls = items.map((item) => {
  const el = document.createElement("div");
  el.className = "label";
  el.hidden = true;
  const title = document.createElement("b");
  title.textContent = item.title;
  const blocks = DOSSIER.filter((layer) => item[layer.key]).map((layer) => {
    const section = document.createElement("section");
    section.hidden = true;
    const who = document.createElement("span");
    who.className = "who";
    who.textContent = layer.label;
    const desc = document.createElement("p");
    const typed = document.createElement("span");
    desc.append(typed);
    section.append(who, desc);
    return { section, typed, full: item[layer.key] };
  });
  const caret = document.createElement("i");
  caret.className = "caret";
  const look = document.createElement("a");
  look.textContent = "посмотреть";
  look.target = "_blank";
  look.rel = "noopener";
  look.hidden = !item.url;
  if (item.url) look.href = item.url;
  const role = document.createElement("em");
  role.className = "role";
  role.textContent = item.role || "";
  role.hidden = !item.role;
  el.append(title, role, ...blocks.map((block) => block.section), look);
  labelsRoot.append(el);
  return { el, blocks, caret };
});

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

let pointerX = innerWidth / 2;
let pointerY = innerHeight / 2;
let pointerDown = false;
let focus = -1;
let typedCount = 0;
let fist = 0;
let spike = 0;
let lastSpikeAt = -Infinity;
let camX = 0;
let camY = 0;

function requestSpike(amount) {
  const now = performance.now();
  if (now - lastSpikeAt < SPIKE_GAP_MS) return;
  lastSpikeAt = now;
  spike = Math.max(spike, amount);
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

function onPointerMove(e) {
  pointerX = e.clientX;
  pointerY = e.clientY;
}

function onPointerDown(e) {
  if (e.button !== 0 || e.target.closest("a")) return;
  pointerDown = true;
}

function onPointerUp(e) {
  if (e.button !== 0) return;
  pointerDown = false;
}

addEventListener("pointermove", onPointerMove);
addEventListener("pointerdown", onPointerDown);
addEventListener("pointerup", onPointerUp);

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

  ndc.set((pointerX / w) * 2 - 1, -(pointerY / h) * 2 + 1);
  const drift = calm ? 0 : 1;
  camX += (Math.sin(t * 0.12) * 0.22 * drift + ndc.x * 0.28 - camX) * 0.05;
  camY += (Math.cos(t * 0.1) * 0.12 * drift + ndc.y * 0.16 - camY) * 0.05;
  camera.position.set(camX, camY, CAM_Z);
  camera.lookAt(0, 0, 0);

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
    const home = homes[i];
    target.set(
      home.x + Math.sin(t * 0.11 + phase[i]) * 1.75 * amp,
      home.y + Math.cos(t * 0.085 + phase[i] * 1.3) * 1.3 * amp,
      home.z + Math.sin(t * 0.07 + phase[i] * 0.7) * 2.2 * amp,
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
    if (i === focus) return [0.15, 1];
    if (j === focus) return [1, 0.15];
    return [1, 1];
  };
  const GAP = 108;
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      gap.copy(pos[j]).sub(pos[i]);
      const reach = gap.length() || 0.001;
      if (reach < 1.45) {
        const push = (1.45 - reach) / reach * 0.01;
        const [wi, wj] = sharePush(i, j);
        vel[i].addScaledVector(gap, -push * wi);
        vel[j].addScaledVector(gap, push * wj);
      }
      const dx = screenPts[j].x - screenPts[i].x;
      const dy = screenPts[j].y - screenPts[i].y;
      const pixels = Math.hypot(dx, dy) || 0.001;
      if (pixels >= GAP) continue;
      const push = (GAP - pixels) / GAP * 0.016;
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
    vel[i].multiplyScalar(0.9);
    const speed = vel[i].length();
    if (speed > SPEED) vel[i].multiplyScalar(SPEED / speed);
    pos[i].add(vel[i]);

    const node = containers[i];
    node.group.position.copy(pos[i]);
    node.group.rotation.set(0.5, t * 0.22 * amp + phase[i], 0.15);

    const [r, g, b] = sample(items[i].kind, t * 0.035 + i * 0.07);
    color.setRGB(r, g, b);
    node.shell.material.color.copy(color);
    node.core.material.color.copy(color);
  }

  let nearest = labelUnderPointer();
  let nearestD = LABEL_PX;
  const screens = pos.map((p) => project(p, w, h));
  if (nearest < 0) {
    for (let i = 0; i < items.length; i++) {
      if (screens[i].behind) continue;
      const d = Math.hypot(screens[i].x - pointerX, screens[i].y - pointerY);
      if (d < nearestD) { nearestD = d; nearest = i; }
    }
  }
  if (nearest !== focus) {
    focus = nearest;
    typedCount = 0;
    if (focus >= 0) requestSpike(0.45);
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
    const [r, g, b] = sample(items[i].kind, t * 0.035 + i * 0.07);
    ui.el.style.borderColor = `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, 0.7)`;
    const cardW = 340;
    const x = Math.min(Math.max(screens[i].x, cardW / 2 + 12), w - cardW / 2 - 12);
    const placeBelow = screens[i].y < 240;
    screens[i].x = x;
    ui.el.style.transform = placeBelow
      ? `translate(${screens[i].x}px, ${screens[i].y}px) translate(-50%, 18px)`
      : `translate(${screens[i].x}px, ${screens[i].y}px) translate(-50%, calc(-100% - 16px))`;
  }

  if (!calm && Math.random() < 0.0008) requestSpike(0.35);
  spike *= 0.88;
  glitch.uniforms.uTime.value = t;
  glitch.uniforms.uGlitch.value = calm ? 0 : spike;

  composer.render();
}

requestAnimationFrame(frame);
