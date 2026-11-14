import { sample } from "./palette.js";

const canvas = document.createElement("canvas");
canvas.width = 32;
canvas.height = 32;
const ctx = canvas.getContext("2d");
let link;
let last = "";

function iconLink() {
  if (link) return link;
  link = document.querySelector('link[rel="icon"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/png";
    document.head.appendChild(link);
  }
  return link;
}

function paint(kind, t) {
  const key = `${kind}:${t.toFixed(2)}`;
  if (key === last) return;
  last = key;
  const [r, g, b] = sample(kind, t);
  ctx.fillStyle = "#241f1a";
  ctx.fillRect(0, 0, 32, 32);
  ctx.beginPath();
  ctx.arc(16, 16, 6.5, 0, Math.PI * 2);
  ctx.fillStyle = `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
  ctx.fill();
  iconLink().href = canvas.toDataURL("image/png");
}

/** Точка во вкладке: цвет вида куба, t — фаза как на сцене */
export function setTabDot(kind, t = 0.5) {
  paint(kind || "note", kind ? t : 0.18);
}