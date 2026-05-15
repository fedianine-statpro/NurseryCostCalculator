// Tiny WebAudio sfx. Lazy AudioContext; cheap square/noise beeps. No assets.

let ctx = null;
let enabled = true;

function ac() {
  if (!ctx) {
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); }
    catch { enabled = false; }
  }
  return ctx;
}

function tone({ freq = 440, dur = 0.05, type = "square", gain = 0.04, slideTo = null }) {
  if (!enabled) return;
  const c = ac();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  if (slideTo != null) o.frequency.exponentialRampToValueAtTime(slideTo, c.currentTime + dur);
  g.gain.value = gain;
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
  o.connect(g).connect(c.destination);
  o.start();
  o.stop(c.currentTime + dur);
}

function noise(dur = 0.15, gain = 0.08) {
  if (!enabled) return;
  const c = ac();
  if (!c) return;
  const buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  const src = c.createBufferSource();
  src.buffer = buf;
  const g = c.createGain();
  g.gain.value = gain;
  src.connect(g).connect(c.destination);
  src.start();
}

export function sfxClick() {
  tone({ freq: 1800 + Math.random() * 400, dur: 0.015, type: "square", gain: 0.02 });
}

export function sfxBeep() {
  tone({ freq: 880, dur: 0.06, type: "square", gain: 0.04 });
}

export function sfxConfirm() {
  tone({ freq: 660, dur: 0.05 });
  setTimeout(() => tone({ freq: 990, dur: 0.07 }), 60);
}

export function sfxDeny() {
  tone({ freq: 200, dur: 0.18, type: "sawtooth", gain: 0.05 });
}

export function sfxPlane() {
  tone({ freq: 1200, dur: 0.9, type: "sawtooth", gain: 0.05, slideTo: 220 });
  noise(0.7, 0.03);
}

export function sfxStamp() {
  noise(0.06, 0.18);
  setTimeout(() => tone({ freq: 110, dur: 0.16, type: "sawtooth", gain: 0.1 }), 40);
}

export function sfxWin() {
  const notes = [523, 659, 784, 1047];
  notes.forEach((f, i) => setTimeout(() => tone({ freq: f, dur: 0.15 }), i * 120));
}

export function sfxLose() {
  const notes = [523, 415, 311, 220];
  notes.forEach((f, i) => setTimeout(() => tone({ freq: f, dur: 0.22, type: "triangle" }), i * 160));
}
