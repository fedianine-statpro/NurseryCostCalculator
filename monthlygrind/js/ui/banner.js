// Lightweight overlay banner used for end-of-month pacing beats.
// The banner fades in, holds briefly, and fades out. Non-blocking.

let bannerEl = null;

function ensureBanner() {
  if (bannerEl) return bannerEl;
  bannerEl = document.createElement("div");
  bannerEl.className = "mg-banner";
  bannerEl.setAttribute("aria-live", "polite");
  document.body.appendChild(bannerEl);
  return bannerEl;
}

export async function showBanner(text, { duration = 900 } = {}) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const el = ensureBanner();
  el.textContent = text;
  el.classList.remove("is-visible");
  // Force reflow so re-adding triggers animation
  void el.offsetWidth;
  el.classList.add("is-visible");
  await new Promise((r) => setTimeout(r, duration));
  el.classList.remove("is-visible");
  await new Promise((r) => setTimeout(r, 300));
}

// Heuristic: only show a beat on the FIRST time a given day threshold is crossed.
const shownFor = new Set();
export async function maybeShowEndMonthBanner(state, activePlayerId, { onTick } = {}) {
  const p = state.players.find((pl) => pl.id === activePlayerId);
  if (!p) return;
  const daysLeft = state.totalDays - p.position;
  const key = `${activePlayerId}-${daysLeft}`;
  if (shownFor.has(key)) return;
  let text = null;
  if (daysLeft === 3) text = "Three days left…";
  else if (daysLeft === 2) text = "Final stretch.";
  else if (daysLeft === 1) text = "Last day.";
  if (!text) return;
  shownFor.add(key);
  if (typeof onTick === "function") onTick();
  await showBanner(text, { duration: 800 });
}

export function resetBannerState() {
  shownFor.clear();
}
