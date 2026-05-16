// Renders an arrival postcard for a city. Shown the first time the player
// lands at each city per case — never again after that for the same case.
//
// Layout:
//   ARRIVED IN
//   Lisbon, Portugal
//   ┌──────────────────────────┐
//   │       [ASCII silhouette] │
//   └──────────────────────────┘
//   "Bem-vindo a Lisboa"
//   EUR · Portuguese · Belém Tower
//   [CONTINUE]
//
// Click anywhere or Continue advances; spacebar also skips.

import { POSTCARDS } from "../data/postcards.js";
import { getLocale } from "../i18n/i18n.js";

export function renderPostcard(cityId, hostEl) {
  const L = getLocale();
  const card = POSTCARDS[cityId];
  const cityLoc = L.cities[cityId];
  if (!cityLoc) return;

  // Fall back to a generic frame if no art is authored for this city.
  const art = card?.art ?? "";
  const greeting = card?.greeting ?? "";

  hostEl.innerHTML = `
    <div class="postcard-arrived">${L.ui.arrivedIn}</div>
    <h2 class="postcard-city">${cityLoc.name}, ${cityLoc.country}</h2>
    <pre class="postcard-art">${escapeHtml(art)}</pre>
    <div class="postcard-greeting">${escapeHtml(greeting)}</div>
    <div class="postcard-meta">
      ${cityLoc.language} &middot; ${cityLoc.currency} &middot; ${cityLoc.landmark}
    </div>
  `;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
