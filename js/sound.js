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
let lastClick = 0;
let rhythm = "none";
let nextBar = 0;
const button = document.getElementById("sound");
const rhythmButtons = [...document.querySelectorAll("#rhythm button")];

// Ре минор: и фон, и ноты кубов, и ритм сидят в одних ступенях.
const PIPS = [1174.66, 1567.98, 1760];
const BEAT = 60 / 44;
const BAR = BEAT * 4;
const RHYTHMS = {
  none: [],
  pulse: [
    { at: 0, hit: "thud", gain: 0.55 },
    { at: 2, hit: "thud", gain: 0.28 },
  ],
  steps: [
    { at: 0, hit: "step", gain: 0.42 },
    { at: 0.7, hit: "step", gain: 0.3 },
    { at: 1.55, hit: "step", gain: 0.22 },
  ],
  drops: [
    { at: 0, hit: "drop", gain: 0.2, freq: 880 },
    { at: 1.5, hit: "drop", gain: 0.14, freq: 1174.66 },
    { at: 3, hit: "drop", gain: 0.16, freq: 1046.5 },
  ],
};
const RHYTHM_CAPTION = {
  none: "только гул, без ритма",
  pulse: "редкий низкий удар",
  steps: "три сухих щелчка",
  drops: "высокие ноты поверх",
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

export function unlockSound() {
  if (!ctx) build();
  const pending = ctx.state === "suspended" ? ctx.resume() : Promise.resolve();
  armed = true;
  return pending.then(() => setBed(enabled));
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
  if (voice.pip) note(now + 0.07, PIPS[index % PIPS.length], 0.09, 0.05, dry);
  if (voice.grain) burst(now + 0.11, 0.16, voice.grain, 700 + (index % 3) * 220, "bandpass");
  // Щелчок позже ноты и не чаще, чем раз в треть секунды, иначе серия сливается в треск.
  if (voice.click && now - lastClick > 0.34) {
    lastClick = now;
    const gap = 0.12 + (index % 4) * 0.04;
    burst(now + gap, 0.016, voice.click, 1500 + (index % 5) * 520, "highpass");
  }
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

function clock() {
  if (!enabled || !ctx || ctx.state !== "running") return;
  const now = ctx.currentTime;
  const events = RHYTHMS[rhythm] || [];
  if (!events.length) return;
  if (!nextBar) nextBar = now + 0.15;
  while (nextBar < now + 0.3) {
    for (const ev of events) playHit(nextBar + ev.at * BEAT, ev);
    nextBar += BAR;
  }
}

setInterval(clock, 100);

function paintRhythm() {
  for (const el of rhythmButtons) {
    el.setAttribute("aria-pressed", String(el.dataset.rhythm === rhythm));
  }
  const caption = document.getElementById("rhythm-now");
  if (caption) caption.textContent = RHYTHM_CAPTION[rhythm] || "";
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
    const wasArmed = armed;
    await unlockSound();
    if (wasArmed || !enabled) enabled = !enabled;
    if (!enabled) nextBar = 0;
    remember(enabled);
    setBed(enabled);
    paintButton();
  });
}

paintRhythm();
for (const el of rhythmButtons) {
  el.addEventListener("click", async () => {
    rhythm = el.dataset.rhythm;
    nextBar = 0;
    paintRhythm();
    if (!enabled) {
      enabled = true;
      remember(true);
      paintButton();
    }
    await unlockSound();
    const first = (RHYTHMS[rhythm] || [])[0];
    if (first && ctx) playHit(ctx.currentTime + 0.06, first);
  });
}
