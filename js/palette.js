import { oklch, formatRgb } from "../vendor/culori.min.mjs";

// Диапазоны оттенка. Цвет плывёт внутри своего диапазона, не прыгает между видами.
const RANGES = {
  dev: { h0: 110, h1: 150, l: 0.82, c: 0.15 },
  pm: { h0: 160, h1: 200, l: 0.78, c: 0.11 },
  link: { h0: 75, h1: 98, l: 0.92, c: 0.028 },
  note: { h0: 55, h1: 85, l: 0.62, c: 0.02 },
  avatar: { h0: 228, h1: 268, l: 0.78, c: 0.07 },
};

const STEPS = 32;

function rgb01(spec) {
  const parts = formatRgb(oklch(spec)).match(/[\d.]+/g).map(Number);
  return [parts[0] / 255, parts[1] / 255, parts[2] / 255];
}

const tables = {};
for (const [kind, range] of Object.entries(RANGES)) {
  const rgb = new Float32Array(STEPS * 3);
  for (let i = 0; i < STEPS; i++) {
    const h = range.h0 + ((range.h1 - range.h0) * i) / (STEPS - 1);
    const c = rgb01({ l: range.l, c: range.c, h });
    rgb[i * 3] = c[0];
    rgb[i * 3 + 1] = c[1];
    rgb[i * 3 + 2] = c[2];
  }
  tables[kind] = rgb;
}

export const background = formatRgb(oklch({ l: 0.16, c: 0.014, h: 72 }));

// t — 0..1 внутри цикла. Между соседними шагами линейная склейка.
export function sample(kind, t) {
  const rgb = tables[kind];
  const x = (((t % 1) + 1) % 1) * (STEPS - 1);
  const i = Math.floor(x);
  const f = x - i;
  const j = Math.min(i + 1, STEPS - 1);
  return [
    rgb[i * 3] + (rgb[j * 3] - rgb[i * 3]) * f,
    rgb[i * 3 + 1] + (rgb[j * 3 + 1] - rgb[i * 3 + 1]) * f,
    rgb[i * 3 + 2] + (rgb[j * 3 + 2] - rgb[i * 3 + 2]) * f,
  ];
}
