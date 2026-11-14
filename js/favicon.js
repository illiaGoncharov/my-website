import { sample } from "./palette.js";

const SIZE = 64;
const canvas = document.createElement("canvas");
canvas.width = SIZE;
canvas.height = SIZE;
const ctx = canvas.getContext("2d");
let link;
let last = "";

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
  const url = canvas.toDataURL("image/png");
  const el = ensureLink();
  if (el.href === url) return;
  const fresh = el.cloneNode();
  fresh.href = url;
  el.replaceWith(fresh);
  link = fresh;
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

function paint(kind, t) {
  const step = Math.round(t * 24) / 24;
  const key = `${kind}:${step}`;
  if (key === last) return;
  last = key;
  const [r, g, b] = sample(kind, step);
  ctx.clearRect(0, 0, SIZE, SIZE);
  roundBg();
  const cx = SIZE / 2;
  const radius = SIZE * 0.36;
  ctx.beginPath();
  ctx.arc(cx, cx, radius, 0, Math.PI * 2);
  ctx.fillStyle = `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
  ctx.fill();
  pushIcon();
}

/** Круг во вкладке: цвет вида куба; без kind — нейтральная «заметка» */
export function setTabDot(kind, t = 0.5) {
  if (!kind) {
    paint("note", 0.18);
    return;
  }
  paint(kind, ((t % 1) + 1) % 1);
}

setTabDot();