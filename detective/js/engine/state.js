// Single game state object. All mutations go through reducers here.

import { CASE_BY_ID } from "../data/cases.js";
import { getLocale } from "../i18n/i18n.js";

export function createGameState(caseId) {
  const c = CASE_BY_ID[caseId];
  return {
    caseId,
    hoursLeft: c.hours,
    trailIndex: 0,
    currentCityId: c.trail[0].cityId,
    visitedCityIds: [c.trail[0].cityId],
    investigatedLocations: {},
    cluesSeen: [],
    // traitsLearned: { category: suspectId } — locale-agnostic.
    // A learned trait points at the suspect whose value matches the culprit's.
    traitsLearned: {},
    warrantSuspectId: null,
    wrongWarrants: 0,
    status: "investigating",
    losReason: null,
  };
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

export function formatTime(hours) {
  const L = getLocale();
  const days = Math.floor(hours / 24);
  const rem = hours % 24;
  if (days <= 0) return L.ui.timeHours(rem);
  return L.ui.timeDaysHours(days, rem);
}
