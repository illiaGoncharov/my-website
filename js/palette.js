import { oklch, formatRgb } from "../vendor/culori.min.mjs";

// Диапазоны оттенка. Цвет плывёт внутри своего диапазона, не прыгает между видами.
const RANGES = {
  dev: { h0: 120, h1: 133, l: 0.82, c: 0.14 },
  pm: { h0: 160, h1: 200, l: 0.78, c: 0.11 },
  link: { h0: 88, h1: 102, l: 0.93, c: 0.045 },
  note: { h0: 248, h1: 268, l: 0.56, c: 0.038 },
  study: { h0: 300, h1: 330, l: 0.7, c: 0.06 },
  art: { h0: 345, h1: 375, l: 0.8, c: 0.11 },
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

// Доля градиента kind, в которой живут кубы одной категории (узко у dev — без жёлтого хвоста).
const KIND_SPREAD = {
  dev: 0.17,
  pm: 0.28,
  art: 0.28,
  study: 0.28,
  note: 0.2,
  link: 0.18,
};

export function sampleCube(kind, index, timeSec, phase) {
  const spread = KIND_SPREAD[kind] ?? 0.25;
  const base = 0.5 - spread / 2;
  const slot = (index * 0.041) % spread;
  const drift = Math.sin(timeSec * 0.035 + phase) * spread * 0.16;
  return sample(kind, base + slot + drift);
}
