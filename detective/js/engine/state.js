// Single game state object. All mutations go through reducers here.

import { CASE_BY_ID } from "../data/cases.js";
import { CITIES } from "../data/cities.js";
import { getLocale } from "../i18n/i18n.js";

export function createGameState(caseId) {
  const c = CASE_BY_ID[caseId];
  const startCityId = c.trail[0].cityId;
  const state = {
    caseId,
    hoursLeft: c.hours,
    trailIndex: 0,
    currentCityId: startCityId,
    visitedCityIds: [startCityId],
    investigatedLocations: {},
    cluesSeen: [],
    // traitsLearned: { category: valueId } — locale-neutral.
    traitsLearned: {},
    // factsByCity: { cityId: Set<factKey> } — every fact category the player
    // has been *exposed* to. Filled by (a) arriving in a city (city facts
    // become known by being there), and (b) seeing a destination clue whose
    // angle reveals a fact about the *next* city. Used by the Notebook and
    // by the trivia gate to draw fair questions.
    factsByCity: {},
    // factsHighlighted: same shape, but only facts that appeared in a CLUE
    // (not just by being-there). These are the "puzzle hooks" the player
    // actively decoded — rendered with a marker in the Notebook.
    factsHighlighted: {},
    warrantSuspectId: null,
    wrongWarrants: 0,
    almanacQueries: 0,    // how many times the Crime Lab almanac was opened
    status: "investigating",
    losReason: null,
  };
  // Arrival at the starting city reveals its facts.
  recordCityFacts(state, startCityId);
  return state;
}

export function getCurrentCase(state) {
  return CASE_BY_ID[state.caseId];
}

export function getTrailEntryForCity(state, cityId) {
  const c = getCurrentCase(state);
  return c.trail.find(t => t.cityId === cityId);
}

export function getTrailIndexOfCity(state, cityId) {
  const c = getCurrentCase(state);
  return c.trail.findIndex(t => t.cityId === cityId);
}

export function getFinalCityId(state) {
  const c = getCurrentCase(state);
  return c.trail[c.trail.length - 1].cityId;
}

export function isLocationDone(state, cityId, locationId) {
  return state.investigatedLocations[cityId]?.has(locationId);
}

export function markLocationDone(state, cityId, locationId) {
  if (!state.investigatedLocations[cityId]) {
    state.investigatedLocations[cityId] = new Set();
  }
  state.investigatedLocations[cityId].add(locationId);
}

export function spendHours(state, hours) {
  state.hoursLeft -= hours;
  if (state.hoursLeft <= 0) {
    state.hoursLeft = 0;
    state.status = "lost";
    state.losReason = "clock";
  }
}

// Called on arrival in a city. The local facts — language, currency, flag,
// landmark, food, climate, fact — all become known automatically. (Walking
// around a city, you absorb its currency and signs without needing a witness
// to spell it out.)
export function recordCityFacts(state, cityId) {
  if (!CITIES[cityId]) return;
  if (!state.factsByCity[cityId]) state.factsByCity[cityId] = new Set();
  for (const k of ["language","currency","landmark","food","flagColors","climate","fact"]) {
    state.factsByCity[cityId].add(k);
  }
}

// Called when a destination clue exposes a specific fact about the NEXT city
// (which the player hasn't visited yet). This is the "puzzle hook" — recording
// it lets the Notebook show the player what fact they have to decode.
export function highlightFact(state, cityId, factKey) {
  if (!state.factsByCity[cityId]) state.factsByCity[cityId] = new Set();
  state.factsByCity[cityId].add(factKey);
  if (!state.factsHighlighted[cityId]) state.factsHighlighted[cityId] = new Set();
  state.factsHighlighted[cityId].add(factKey);
}

export function formatTime(hours) {
  const L = getLocale();
  const days = Math.floor(hours / 24);
  const rem = hours % 24;
  if (days <= 0) return L.ui.timeHours(rem);
  return L.ui.timeDaysHours(days, rem);
}
