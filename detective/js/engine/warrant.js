// Warrant logic: a suspect matches if NONE of the learned traits conflict with them.
// Player needs 3+ learned traits before the warrant button enables.

import { SUSPECTS, SUSPECT_BY_ID } from "../data/suspects.js";

export function suspectMatchesTraits(suspectId, learnedTraits) {
  const s = SUSPECT_BY_ID[suspectId];
  for (const [k, v] of Object.entries(learnedTraits)) {
    if (s.traits[k] !== v) return false;
  }
  return true;
}

export function eliminatedSuspects(learnedTraits) {
  return SUSPECTS.filter(s => !suspectMatchesTraits(s.id, learnedTraits)).map(s => s.id);
}

export function matchingSuspects(learnedTraits) {
  return SUSPECTS.filter(s => suspectMatchesTraits(s.id, learnedTraits)).map(s => s.id);
}

export function canIssueWarrant(state) {
  return Object.keys(state.traitsLearned).length >= 3;
}
