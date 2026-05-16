// Detective's Notebook — auto-recorded facts per city the player has visited
// or heard about in a clue. Each city block shows its language, currency,
// flag, landmark, food, climate, and one notable fact. Facts that came up in
// a CLUE (puzzle hooks) are highlighted with a ▸ marker so the player can see
// the trail of breadcrumbs the witnesses left them.

import { CITIES } from "../data/cities.js";
import { getLocale } from "../i18n/i18n.js";

const FACT_ORDER = ["language","currency","flagColors","landmark","food","climate","fact"];

export function renderNotebook(state, host) {
  const L = getLocale();
  host.innerHTML = "";

  // We render cities the player has touched (visited OR a clue mentioned).
  // Order: most-recently-visited first; cities only hinted at (not visited)
  // go at the bottom under a "trail of breadcrumbs" header.
  const visitedSet = new Set(state.visitedCityIds);
  const cityIdsAll = Object.keys(state.factsByCity || {});
  const visited = state.visitedCityIds.slice().reverse();
  const hinted = cityIdsAll.filter(id => !visitedSet.has(id));

  if (visited.length === 0 && hinted.length === 0) {
    const p = document.createElement("p");
    p.className = "flavor";
    p.textContent = L.ui.notebookEmpty;
    host.appendChild(p);
    return;
  }

  if (visited.length) {
    const h = document.createElement("div");
    h.className = "notebook-section-title";
    h.textContent = L.ui.notebookVisited;
    host.appendChild(h);
    for (const cid of visited) host.appendChild(renderCard(state, cid, false));
  }
  if (hinted.length) {
    const h = document.createElement("div");
    h.className = "notebook-section-title";
    h.textContent = L.ui.notebookHinted;
    host.appendChild(h);
    for (const cid of hinted) host.appendChild(renderCard(state, cid, true));
  }
}

function renderCard(state, cityId, hintedOnly) {
  const L = getLocale();
  const cityLoc = L.cities[cityId];
  const set = state.factsByCity[cityId] || new Set();
  const hi = state.factsHighlighted[cityId] || new Set();

  const card = document.createElement("div");
  card.className = "notebook-card";
  if (hintedOnly) card.classList.add("hinted-only");

  let rows = "";
  for (const k of FACT_ORDER) {
    if (!set.has(k)) continue;
    const label = L.ui.factLabel[k];
    const value = cityLoc[k];
    const marker = `<span class="hi-marker">${hi.has(k) ? "▸" : ""}</span>`;
    rows += `<div class="nb-row ${hi.has(k) ? "highlighted" : ""}">${marker}<em>${label}</em><span>${value}</span></div>`;
  }

  card.innerHTML = `
    <div class="notebook-city">${cityLoc.name}, ${cityLoc.country}</div>
    <div class="notebook-facts">${rows || `<div class="flavor">${L.ui.notebookNoFacts}</div>`}</div>
  `;
  return card;
}
