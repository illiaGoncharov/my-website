// Сакамото: редкая нота с длинным затуханием и комнатой.
// Альва Ното: сухой щелчок и короткий писк, мимо комнаты.
// У каждого цвета свой регистр и своя доля цифры.

const VOICES = {
  dev: {
    notes: [220, 261.63, 293.66, 329.63, 392],
    partials: [1, 2.003, 3.01, 4.2, 5.4],
    mix: [0.55, 0.2, 0.1, 0.05, 0.03],
    decay: 2.2,
    level: 0.16,
    click: 0.4,
    pip: 3400,
  },
  pm: {
    notes: [146.83, 174.61, 196, 220, 261.63],
    partials: [1, 2, 2.997, 4.01],
    mix: [0.6, 0.26, 0.09, 0.04],
    decay: 3.4,
    level: 0.18,
    click: 0.06,
    pip: 0,
  },
  study: {
    notes: [329.63, 392, 440, 493.88, 587.33],
    partials: [1, 2.71, 4.15, 6.05],
    mix: [0.42, 0.16, 0.07, 0.04],
    decay: 2.6,
    level: 0.13,
    click: 0.16,
    pip: 2200,
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
    click: 0.04,
    pip: 0,
    fifth: true,
  },
};

let ctx;
let dry;
let wet;
let room;
let noiseBuf;
let enabled = true;
let armed = false;
let lastAt = 0;
const button = document.getElementById("sound");

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

function build() {
  ctx = new AudioContext();
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
}

export function unlockSound() {
  if (!ctx) build();
  const pending = ctx.state === "suspended" ? ctx.resume() : Promise.resolve();
  armed = true;
  return pending;
}

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
  const freq = voice.notes[index % voice.notes.length];
  piano(now, freq, voice);
  if (voice.click) burst(now, 0.025, voice.click, 2400, "highpass");
  if (voice.grain) burst(now, 0.16, voice.grain, 900, "bandpass");
  if (voice.pip) note(now, voice.pip + (index % 3) * 180, 0.07, 0.08, dry);
}

if (button) {
  paintButton();
  button.addEventListener("click", async () => {
    const wasArmed = armed;
    await unlockSound();
    if (wasArmed || !enabled) enabled = !enabled;
    try {
      sessionStorage.setItem("site-sound", enabled ? "on" : "off");
    } catch {
      // Приватный режим может запретить storage. Звук всё равно переключается.
    }
    paintButton();
  });
}
