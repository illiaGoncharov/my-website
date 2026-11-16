import { sample } from "./palette.js?v=4";

const KINDS = ["dev", "art", "pm", "study", "note", "link"];
const CYCLE_SEC = 18;
const calm = matchMedia("(prefers-reduced-motion: reduce)");
const t0 = performance.now();
let lastKey = "";

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

function pushSvg(rgb) {
  const r = Math.round(rgb[0] * 255);
  const g = Math.round(rgb[1] * 255);
  const b = Math.round(rgb[2] * 255);
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">` +
    `<rect width="32" height="32" rx="6" fill="#241f1a"/>` +
    `<circle cx="16" cy="16" r="11.5" fill="rgb(${r},${g},${b})"/>` +
    `</svg>`;
  const href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  let el = document.getElementById("tab-icon");
  if (!el) {
    document.querySelectorAll('link[rel="icon"]').forEach((n) => n.remove());
    el = document.createElement("link");
    el.id = "tab-icon";
    el.rel = "icon";
    el.type = "image/svg+xml";
    document.head.appendChild(el);
  }
  if (el.href === href) return;
  const next = el.cloneNode();
  next.href = href;
  el.replaceWith(next);
}

/** Вызывается из основного цикла отрисовки */
export function tickTabIcon(now = performance.now()) {
  if (document.visibilityState === "hidden") return;
  const p = calm.matches ? 0.18 : ((now - t0) * 0.001) / CYCLE_SEC % 1;
  const rgb = blendKinds(p);
  const key = Math.floor(p * 240);
  if (key === lastKey) return;
  lastKey = key;
  pushSvg(rgb);
}

tickTabIcon();