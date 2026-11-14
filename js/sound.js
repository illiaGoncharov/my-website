// Сакамото: редкая нота с длинным затуханием и комнатой.
// Альва Ното: сухой щелчок и короткий писк, мимо комнаты.
// У каждого цвета свой регистр и своя доля цифры.

const VOICES = {
  dev: {
    notes: [220, 261.63, 293.66, 349.23, 392],
    partials: [1, 2.003, 3.01, 4.2, 5.4],
    mix: [0.55, 0.2, 0.1, 0.05, 0.03],
    decay: 2.2,
    level: 0.16,
    click: 0.28,
    pip: true,
  },
  pm: {
    notes: [146.83, 174.61, 196, 220, 261.63],
    partials: [1, 2, 2.997, 4.01],
    mix: [0.6, 0.26, 0.09, 0.04],
    decay: 3.4,
    level: 0.18,
    click: 0,
    pip: 0,
  },
  study: {
    notes: [293.66, 349.23, 392, 440, 523.25],
    partials: [1, 2.71, 4.15, 6.05],
    mix: [0.42, 0.16, 0.07, 0.04],
    decay: 2.6,
    level: 0.13,
    click: 0.16,
    pip: true,
  },
  note: {
    notes: [110, 130.81, 146.83],
    partials: [1, 1.51, 2.01],
    mix: [0.4, 0.1, 0.04],
    decay: 3.2,
    level: 0.1,
    click: 0.2,
    pip: 0,
    grain: 0.16,
  },
  link: {
    notes: [261.63, 293.66, 349.23],
    partials: [1, 2, 3, 4.2],
    mix: [0.48, 0.18, 0.07, 0.03],
    decay: 3.3,
    level: 0.14,
    click: 0,
    pip: 0,
    fifth: true,
  },
};

let ctx;
let dry;
let wet;
let room;
let noiseBuf;
let bed;
let enabled = true;
let armed = false;
let lastAt = 0;
const active = new Set();
let nextBar = 0;
const button = document.getElementById("sound");
const rhythmButtons = [...document.querySelectorAll("#rhythm button[data-rhythm]")];

// Ре минор: и фон, и ноты кубов, и ритм сидят в одних ступенях.
const BEAT = 60 / 44;
const BAR = BEAT * 4;
const RHYTHMS = {
  pulse: [
    { at: 0, hit: "thud", gain: 0.55 },
    { at: 2, hit: "thud", gain: 0.28 },
  ],
  torn: [
    { at: 0, hit: "step", gain: 0.46 },
    { at: 0.18, hit: "step", gain: 0.24 },
    { at: 1.25, hit: "step", gain: 0.36 },
    { at: 2.85, hit: "step", gain: 0.2 },
    { at: 3.08, hit: "step", gain: 0.32 },
  ],
  drops: [
    { at: 0, hit: "drop", gain: 0.2, freq: 880 },
    { at: 1.5, hit: "drop", gain: 0.14, freq: 1174.66 },
    { at: 3, hit: "drop", gain: 0.16, freq: 1046.5 },
  ],
};
try {
  enabled = sessionStorage.getItem("site-sound") !== "off";
} catch {
  enabled = true;
}

function paintButton() {
  if (!button) return;
  button.setAttribute("aria-pressed", String(enabled));
  button.textContent = enabled ? "звук вкл" : "звук выкл";
}

const coarse = () =>
  matchMedia("(pointer: coarse)").matches
  || /iPhone|iPad|iPod/i.test(navigator.userAgent)
  || (navigator.maxTouchPoints > 0 && matchMedia("(max-width: 900px)").matches);

let bornInGesture = false;
let wasLive = false;
let iosUnlockEl;
let poked = false;

function playIosUnlock() {
  try {
    iosUnlockEl ??= new Audio(
      "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==",
    );
    iosUnlockEl.setAttribute("playsinline", "true");
    iosUnlockEl.volume = 0.2;
    const pending = iosUnlockEl.play();
    if (pending) pending.catch(() => {});
  } catch {
    // Старый WebView может не знать HTMLAudio. Ниже остаётся Web Audio.
  }
}

function poke() {
  if (!ctx || !dry || poked) return;
  poked = true;
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.07, t + 0.03);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
  osc.type = "sine";
  osc.frequency.value = 146.83;
  osc.connect(g);
  g.connect(dry);
  osc.start(t);
  osc.stop(t + 0.5);
}

function dropGraph() {
  try { void ctx?.close(); } catch { /* уже закрыт */ }
  ctx = null;
  bed = null;
  dry = null;
  bornInGesture = false;
}

function build() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  ctx = new AC();
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -16;
  comp.knee.value = 16;
  comp.ratio.value = 3;
  comp.attack.value = 0.004;
  comp.release.value = 0.28;
  comp.connect(ctx.destination);

  dry = ctx.createGain();
  dry.gain.value = 1;
  dry.connect(comp);

  // Короткая комната: пианино в ней, щелчки мимо.
  room = ctx.createDelay();
  room.delayTime.value = 0.21;
  const damp = ctx.createBiquadFilter();
  damp.type = "lowpass";
  damp.frequency.value = 2200;
  const fb = ctx.createGain();
  fb.gain.value = 0.32;
  wet = ctx.createGain();
  wet.gain.value = 0.28;
  room.connect(damp);
  damp.connect(fb);
  fb.connect(room);
  room.connect(wet);
  wet.connect(comp);

  const seconds = 0.4;
  noiseBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * seconds), ctx.sampleRate);
  const data = noiseBuf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  startBed();
}

// Низкая квинта и тихий вдох. Гул почти не двигается, как в «Выжившем».
function startBed() {
  bed = ctx.createGain();
  bed.gain.value = 0;
  bed.connect(dry);

  const air = ctx.createBiquadFilter();
  air.type = "lowpass";
  air.frequency.value = 320;
  air.connect(bed);

  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.04;
  lfoGain.gain.value = 90;
  lfo.connect(lfoGain);
  lfoGain.connect(air.frequency);
  lfo.start();

  const tone = (freq, gain) => {
    const osc = ctx.createOscillator();
    const twin = ctx.createOscillator();
    const g = ctx.createGain();
    osc.frequency.value = freq;
    twin.frequency.value = freq * 1.003;
    g.gain.value = gain;
    osc.connect(g);
    twin.connect(g);
    g.connect(air);
    osc.start();
    twin.start();
  };
  tone(73.42, 0.55);
  tone(110, 0.22);
  tone(87.31, 0.1);

  const wind = ctx.createBufferSource();
  wind.buffer = noiseBuf;
  wind.loop = true;
  const band = ctx.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 480;
  band.Q.value = 0.7;
  const breath = ctx.createGain();
  breath.gain.value = 0.015;
  const breathLfo = ctx.createOscillator();
  const breathDepth = ctx.createGain();
  breathLfo.frequency.value = 0.07;
  breathDepth.gain.value = 0.012;
  breathLfo.connect(breathDepth);
  breathDepth.connect(breath.gain);
  breathLfo.start();
  wind.connect(band);
  band.connect(breath);
  breath.connect(bed);
  wind.start();
}

function setBed(on) {
  if (!bed || !ctx) return;
  const now = ctx.currentTime;
  bed.gain.cancelScheduledValues(now);
  bed.gain.setTargetAtTime(on ? 0.16 : 0, now, 1.1);
}

function running() {
  return ctx?.state === "running";
}

// На iOS граф, собранный до жеста, молчит даже в состоянии running.
// Собираем его синхронно в touchstart, как в sfumato, и только потом ждём resume.
export function primeSound() {
  if (!enabled) return false;
  const fresh = coarse() && !bornInGesture;
  if (fresh || ctx?.state === "closed") {
    if (coarse()) playIosUnlock();
    if (ctx) dropGraph();
  }
  if (!ctx) build();
  if (!ctx) return false;
  if (fresh) {
    bornInGesture = true;
    poke();
  }
  if (ctx.state === "suspended" || ctx.state === "interrupted") void ctx.resume();
  if (!running()) return false;
  armed = true;
  setBed(true);
  return true;
}

export function unlockSound() {
  if (!enabled) return Promise.resolve(false);
  if (primeSound()) return Promise.resolve(true);
  if (!ctx) return Promise.resolve(false);
  const pending = ctx.state === "suspended" || ctx.state === "interrupted"
    ? ctx.resume()
    : Promise.resolve();
  return pending.then(() => {
    if (!running()) return false;
    armed = true;
    setBed(true);
    return true;
  }).catch(() => false);
}

// На компьютере браузер часто пускает звук сам. На телефоне ждём касание.
if (enabled && !coarse()) unlockSound();

function noteGesture() {
  wasLive = Boolean(armed && running());
  primeSound();
}

addEventListener("touchstart", noteGesture, { capture: true, passive: true });
addEventListener("pointerdown", (e) => {
  if (e.pointerType === "touch") return;
  noteGesture();
}, { capture: true });

function burst(time, dur, gainVal, freq, type) {
  const src = ctx.createBufferSource();
  src.buffer = noiseBuf;
  const filter = ctx.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = freq;
  filter.Q.value = type === "bandpass" ? 1.4 : 0.6;
  const g = ctx.createGain();
  g.gain.setValueAtTime(gainVal, time);
  g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
  src.connect(filter);
  filter.connect(g);
  g.connect(dry);
  src.start(time);
  src.stop(time + dur + 0.02);
}

function note(time, freq, decay, gainVal, bus) {
  const osc = ctx.createOscillator();
  const twin = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = "sine";
  twin.type = "sine";
  osc.frequency.value = freq;
  twin.frequency.value = freq * 1.004;
  g.gain.setValueAtTime(0.0001, time);
  g.gain.exponentialRampToValueAtTime(gainVal * 0.55, time + 0.018);
  g.gain.exponentialRampToValueAtTime(0.0001, time + decay);
  osc.connect(g);
  twin.connect(g);
  g.connect(bus);
  osc.start(time);
  twin.start(time);
  const stop = time + decay + 0.05;
  osc.stop(stop);
  twin.stop(stop);
}

function piano(time, freq, voice) {
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.Q.value = 0.6;
  filter.frequency.setValueAtTime(640, time);
  filter.frequency.exponentialRampToValueAtTime(2600, time + 0.045);
  filter.frequency.exponentialRampToValueAtTime(520, time + voice.decay);
  const body = ctx.createGain();
  body.gain.value = voice.level;
  filter.connect(body);
  body.connect(room);
  body.connect(dry);
  setTimeout(() => {
    filter.disconnect();
    body.disconnect();
  }, (voice.decay + 0.3) * 1000);
  voice.partials.forEach((ratio, i) => {
    note(time, freq * ratio, voice.decay * (1 - i * 0.08), voice.mix[i], filter);
  });
  if (voice.fifth) note(time, freq * 1.5, voice.decay * 0.85, 0.28, filter);
}

export function playHover(kind, index) {
  const voice = VOICES[kind];
  if (!enabled || !armed || !voice || !ctx || ctx.state !== "running") return;
  const now = ctx.currentTime;
  if (now - lastAt < 0.14) return;
  lastAt = now;
  piano(now, voice.notes[index % voice.notes.length], voice);
}

function thud(time, gain) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(96, time);
  osc.frequency.exponentialRampToValueAtTime(36, time + 0.16);
  g.gain.setValueAtTime(gain, time);
  g.gain.exponentialRampToValueAtTime(0.0001, time + 0.32);
  osc.connect(g);
  g.connect(dry);
  osc.start(time);
  osc.stop(time + 0.36);
  burst(time, 0.05, gain * 0.45, 140, "lowpass");
}

function playHit(time, ev) {
  if (ev.hit === "thud") thud(time, ev.gain);
  else if (ev.hit === "step") burst(time, 0.012, ev.gain, 3200, "highpass");
  else if (ev.hit === "drop") note(time, ev.freq, 1.1, ev.gain, dry);
}

function chosen() {
  return ["pulse", "torn", "drops"].filter((name) => active.has(name));
}

function clock() {
  if (!enabled || !ctx || ctx.state !== "running") return;
  const names = chosen();
  if (!names.length) return;
  const now = ctx.currentTime;
  if (!nextBar) nextBar = now + 0.15;
  while (nextBar < now + 0.3) {
    for (const name of names) {
      for (const ev of RHYTHMS[name]) {
        const slip = name === "torn" && ev.at > 0 ? (Math.random() - 0.5) * 0.22 : 0;
        playHit(nextBar + Math.max(0, ev.at + slip) * BEAT, ev);
      }
    }
    nextBar += BAR;
  }
}

setInterval(clock, 100);

function paintRhythm() {
  for (const el of rhythmButtons) {
    el.setAttribute("aria-pressed", String(active.has(el.dataset.rhythm)));
  }
}

function remember(on) {
  try {
    sessionStorage.setItem("site-sound", on ? "on" : "off");
  } catch {
    // Приватный режим может запретить storage. Звук всё равно переключается.
  }
}

if (button) {
  paintButton();
  button.addEventListener("click", async () => {
    if (wasLive && enabled) {
      enabled = false;
      nextBar = 0;
      setBed(false);
    } else {
      enabled = true;
      primeSound();
      await unlockSound();
    }
    remember(enabled);
    paintButton();
  });
}

paintRhythm();
for (const el of rhythmButtons) {
  el.addEventListener("click", async () => {
    const name = el.dataset.rhythm;
    if (active.has(name)) active.delete(name);
    else active.add(name);
    paintRhythm();
    if (!enabled) {
      enabled = true;
      remember(true);
      paintButton();
    }
    await unlockSound();
    const first = active.has(name) ? RHYTHMS[name][0] : null;
    if (first && ctx) playHit(ctx.currentTime + 0.06, first);
  });
}
