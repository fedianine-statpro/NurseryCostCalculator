// Warrant logic. learnedTraits is { category: valueId }.
// A suspect matches the learned traits iff its trait value id at each
// category equals the learned value id.

import { SUSPECT_TRAITS } from "../data/suspects.js";

export function suspectMatchesTraits(suspectId, learnedTraits) {
  const traits = SUSPECT_TRAITS[suspectId];
  for (const [cat, valueId] of Object.entries(learnedTraits)) {
    if (traits[cat] !== valueId) return false;
  }
  return true;
}

export function canIssueWarrant(state) {
  return Object.keys(state.traitsLearned).length >= 3;
}
