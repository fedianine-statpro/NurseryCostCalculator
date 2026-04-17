// Synthesized SFX via Web Audio API. Zero binary audio files.
// Exposed toggle keeps user control; persists via localStorage.

const KEY = "mg-sound";
let enabled = localStorage.getItem(KEY) !== "off";
let ctx = null;

function ensureCtx() {
  if (!ctx) {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    ctx = new C();
  }
  return ctx;
}

export function isSoundOn() {
  return enabled;
}
export function setSoundOn(on) {
  enabled = on;
  localStorage.setItem(KEY, on ? "on" : "off");
}
export function toggleSound() {
  setSoundOn(!enabled);
  return enabled;
}

export function sfxDice() {
  if (!enabled) return;
  const c = ensureCtx();
  if (!c) return;
  const now = c.currentTime;
  // A short sequence of clicks
  for (let i = 0; i < 4; i++) {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = "square";
    osc.frequency.value = 320 + Math.random() * 220;
    g.gain.value = 0.0001;
    osc.connect(g).connect(c.destination);
    const t = now + i * 0.08;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.05, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
    osc.start(t);
    osc.stop(t + 0.08);
  }
}

export function sfxCoin(up = true) {
  if (!enabled) return;
  const c = ensureCtx();
  if (!c) return;
  const now = c.currentTime;
  const freqs = up ? [880, 1175, 1397] : [523, 392, 311];
  freqs.forEach((f, i) => {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = "triangle";
    osc.frequency.value = f;
    g.gain.value = 0.0001;
    osc.connect(g).connect(c.destination);
    const t = now + i * 0.09;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.08, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    osc.start(t);
    osc.stop(t + 0.24);
  });
}

export function sfxCardFlip() {
  if (!enabled) return;
  const c = ensureCtx();
  if (!c) return;
  const now = c.currentTime;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(600, now);
  osc.frequency.exponentialRampToValueAtTime(200, now + 0.14);
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(0.04, now + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
  osc.connect(g).connect(c.destination);
  osc.start(now);
  osc.stop(now + 0.18);
}

export function sfxWin() {
  if (!enabled) return;
  const c = ensureCtx();
  if (!c) return;
  const now = c.currentTime;
  [523, 659, 784, 1047].forEach((f, i) => {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = "triangle";
    osc.frequency.value = f;
    g.gain.value = 0.0001;
    osc.connect(g).connect(c.destination);
    const t = now + i * 0.12;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.09, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
    osc.start(t);
    osc.stop(t + 0.38);
  });
}

export function sfxLose() {
  if (!enabled) return;
  const c = ensureCtx();
  if (!c) return;
  const now = c.currentTime;
  [440, 370, 294].forEach((f, i) => {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = "sine";
    osc.frequency.value = f;
    g.gain.value = 0.0001;
    osc.connect(g).connect(c.destination);
    const t = now + i * 0.18;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.08, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
    osc.start(t);
    osc.stop(t + 0.38);
  });
}

// Ominous descending bass drop — plays when a player crosses into the red.
export function sfxOverdraft() {
  if (!enabled) return;
  const c = ensureCtx();
  if (!c) return;
  const now = c.currentTime;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(220, now);
  osc.frequency.exponentialRampToValueAtTime(55, now + 0.6);
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(0.12, now + 0.05);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
  osc.connect(g).connect(c.destination);
  osc.start(now);
  osc.stop(now + 0.75);
}

// Soft clock tick for end-of-month pacing beats.
export function sfxTick() {
  if (!enabled) return;
  const c = ensureCtx();
  if (!c) return;
  const now = c.currentTime;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = "square";
  osc.frequency.value = 2200;
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(0.02, now + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
  osc.connect(g).connect(c.destination);
  osc.start(now);
  osc.stop(now + 0.06);
}
