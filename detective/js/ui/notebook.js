// Detective's Notebook — auto-recorded facts per city the player has visited
// or heard about in a clue.
//
// Two distinct sections:
//
//   VISITED CITIES — full data for cities the player has actually been to.
//     Each card shows the city header and all the facts (language, currency,
//     flag, landmark, food, climate, the notable fact).
//
//   TRAIL OF BREADCRUMBS — destinations the player has only HEARD about in
//     a clue. To keep the destination a real puzzle, these cards DO NOT name
//     the city — they only show the raw breadcrumb facts the witness gave.
//     The player decodes the destination via the Crime Lab Almanac.
//
// Facts highlighted by a clue are tagged with a ▸ marker on visited cards.

import { CITIES } from "../data/cities.js";
import { getLocale } from "../i18n/i18n.js";

const FACT_ORDER = ["language","currency","flagColors","landmark","food","climate","fact"];

export function renderNotebook(state, host) {
  const L = getLocale();
  host.innerHTML = "";

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
    for (const cid of visited) host.appendChild(renderVisitedCard(state, cid));
  }
  if (hinted.length) {
    const h = document.createElement("div");
    h.className = "notebook-section-title";
    h.textContent = L.ui.notebookHinted;
    host.appendChild(h);
    const hint = document.createElement("p");
    hint.className = "flavor notebook-lead-hint";
    hint.textContent = L.ui.notebookLeadHint;
    host.appendChild(hint);
    for (const cid of hinted) host.appendChild(renderLeadCard(state, cid));
  }
}

function renderVisitedCard(state, cityId) {
  const L = getLocale();
  const cityLoc = L.cities[cityId];
  const set = state.factsByCity[cityId] || new Set();
  const hi = state.factsHighlighted[cityId] || new Set();

  const card = document.createElement("div");
  card.className = "notebook-card";

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

// A hinted lead — the player has heard one or more facts about a destination
// but hasn't gone there yet. We deliberately HIDE the city name so the
// destination remains a puzzle. The almanac is the player's decoder ring.
function renderLeadCard(state, cityId) {
  const L = getLocale();
  const cityLoc = L.cities[cityId];
  const hi = state.factsHighlighted[cityId] || new Set();

  const card = document.createElement("div");
  card.className = "notebook-card hinted-only";

  let rows = "";
  for (const k of FACT_ORDER) {
    if (!hi.has(k)) continue;
    const label = L.ui.factLabel[k];
    const value = cityLoc[k];
    rows += `<div class="nb-row highlighted"><span class="hi-marker">▸</span><em>${label}</em><span>${value}</span></div>`;
  }

  card.innerHTML = `
    <div class="notebook-city notebook-lead">${L.ui.notebookLeadHeader}</div>
    <div class="notebook-facts">${rows}</div>
  `;
  return card;
}
