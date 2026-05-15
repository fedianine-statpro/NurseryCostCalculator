// Single game state object. All mutations go through reducers here.

import { CASE_BY_ID } from "../data/cases.js";

export function createGameState(caseId) {
  const c = CASE_BY_ID[caseId];
  return {
    caseId,
    hoursLeft: c.hours,
    trailIndex: 0,                  // index into c.trail; the city the player is currently AT
    currentCityId: c.trail[0].cityId,
    visitedCityIds: [c.trail[0].cityId],
    investigatedLocations: {},      // { cityId: Set<locationId> } — to prevent farming a city
    cluesSeen: [],                  // [{cityId, locationId, text, type}]
    traitsLearned: {},              // { category: value }
    warrantSuspectId: null,
    wrongWarrants: 0,
    status: "investigating",        // 'investigating' | 'won' | 'lost'
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

// True if the player has already investigated this location at this city in this case.
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
  const days = Math.floor(hours / 24);
  const rem = hours % 24;
  if (days <= 0) return `${rem}h left`;
  return `${days}d ${rem}h left`;
}
