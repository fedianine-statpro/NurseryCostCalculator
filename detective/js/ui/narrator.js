// Typewriter renderer. Click/Space skips to end.

import { sfxClick } from "./effects.js";

let active = null;

export function typewrite(el, text, opts = {}) {
  cancel();
  el.textContent = "";
  const speed = opts.speed ?? 18; // ms per char
  return new Promise((resolve) => {
    let i = 0;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      el.textContent = text;
      active = null;
      resolve();
    };
    const tick = () => {
      if (done) return;
      if (i >= text.length) {
        finish();
        return;
      }
      el.textContent = text.slice(0, i + 1);
      if (i % 2 === 0 && text[i] !== " " && text[i] !== "\n") sfxClick();
      i++;
      active = setTimeout(tick, speed);
    };
    active = { skip: finish };
    tick();
    // attach a one-shot skipper
    const skipper = () => finish();
    el._skipper = skipper;
  });
}

export function skipActive() {
  if (active && typeof active === "object" && active.skip) active.skip();
}

export function cancel() {
  if (active) {
    if (typeof active === "object" && active.skip) active.skip();
    else clearTimeout(active);
    active = null;
  }
}

// global keyboard skip
window.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "Enter") {
    skipActive();
  }
});
window.addEventListener("click", () => {
  // single click on the page skips text-in-progress
  // (does not interfere with button clicks because buttons stop propagation if needed)
  skipActive();
}, true); // capture so it runs even if a child stops propagation later
