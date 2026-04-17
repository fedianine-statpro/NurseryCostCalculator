// Small persisted settings layer. Currently: auto-advance for card popups.
// When auto-advance is on, your own Work/Event/Perk reveal cards time out on
// their own (shorter duration) instead of waiting for a Continue click.
// Perk offers and A/B event choices are ALWAYS interactive — they require
// a decision and can't be auto-skipped.

const KEY = "mg-auto-advance";
let enabled = localStorage.getItem(KEY) === "on";

export function isAutoAdvance() {
  return enabled;
}
export function setAutoAdvance(on) {
  enabled = !!on;
  localStorage.setItem(KEY, enabled ? "on" : "off");
}
export function toggleAutoAdvance() {
  setAutoAdvance(!enabled);
  return enabled;
}
