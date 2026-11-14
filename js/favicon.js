import { sample } from "./palette.js";

const KINDS = ["dev", "pm", "study", "note", "link"];
const CYCLE_SEC = 44;
const SIZE = 64;
const STEP_MS = 110;
const calm = matchMedia("(prefers-reduced-motion: reduce)");

const canvas = document.createElement("canvas");
canvas.width = SIZE;
canvas.height = SIZE;
const ctx = canvas.getContext("2d");
let link;
let blobUrl;
let t0 = performance.now();

function ensureLink() {
  if (link?.isConnected) return link;
  document.querySelectorAll('link[rel="icon"]').forEach((n) => n.remove());
  link = document.createElement("link");
  link.id = "tab-icon";
  link.rel = "icon";
  link.type = "image/png";
  link.sizes = "32x32";
  document.head.appendChild(link);
  return link;
}

function pushIcon() {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const el = ensureLink();
    const fresh = el.cloneNode();
    fresh.href = url;
    el.replaceWith(fresh);
    link = fresh;
    if (blobUrl) URL.revokeObjectURL(blobUrl);
    blobUrl = url;
  }, "image/png");
}

function roundBg() {
  const r = SIZE * 0.19;
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(SIZE - r, 0);
  ctx.quadraticCurveTo(SIZE, 0, SIZE, r);
  ctx.lineTo(SIZE, SIZE - r);
  ctx.quadraticCurveTo(SIZE, SIZE, SIZE - r, SIZE);
  ctx.lineTo(r, SIZE);
  ctx.quadraticCurveTo(0, SIZE, 0, SIZE - r);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.closePath();
  ctx.fillStyle = "#241f1a";
  ctx.fill();
}

function smoothstep(f) {
  return f * f * (3 - 2 * f);
}

function blendKinds(p) {
  const n = KINDS.length;
  const x = (((p % 1) + 1) % 1) * n;
  const i = Math.floor(x) % n;
  const f = smoothstep(x - Math.floor(x));
  const drift = 0.38 + 0.14 * Math.sin(p * Math.PI * 2);
  const a = sample(KINDS[i], drift);
  const b = sample(KINDS[(i + 1) % n], drift);
  return [
    a[0] + (b[0] - a[0]) * f,
    a[1] + (b[1] - a[1]) * f,
    a[2] + (b[2] - a[2]) * f,
  ];
}

function draw(rgb) {
  ctx.clearRect(0, 0, SIZE, SIZE);
  roundBg();
  const cx = SIZE / 2;
  const radius = SIZE * 0.36;
  ctx.beginPath();
  ctx.arc(cx, cx, radius, 0, Math.PI * 2);
  ctx.fillStyle = `rgb(${Math.round(rgb[0] * 255)}, ${Math.round(rgb[1] * 255)}, ${Math.round(rgb[2] * 255)})`;
  ctx.fill();
  pushIcon();
}

function tick() {
  if (document.visibilityState === "hidden") return;
  const p = calm.matches ? 0.18 : ((performance.now() - t0) * 0.001) / CYCLE_SEC % 1;
  draw(blendKinds(p));
}

draw(blendKinds(0));
setInterval(tick, STEP_MS);