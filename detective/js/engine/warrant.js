// Warrant logic. learnedTraits is { category: valueId }.
// A suspect matches the learned traits iff its trait value id at each
// category equals the learned value id.

import { SUSPECTS, SUSPECT_TRAITS } from "../data/suspects.js";

export function suspectMatchesTraits(suspectId, learnedTraits) {
  const traits = SUSPECT_TRAITS[suspectId];
  for (const [cat, valueId] of Object.entries(learnedTraits)) {
    if (traits[cat] !== valueId) return false;
  }
  return true;
}

export function matchingSuspectIds(learnedTraits) {
  return SUSPECTS.filter(s => suspectMatchesTraits(s.id, learnedTraits)).map(s => s.id);
}

// You can issue a warrant once either:
//   (a) you've collected 3+ traits (classic rule), OR
//   (b) your evidence already uniquely identifies one suspect.
// (b) is the soft-deduction path: a single rare trait that only one suspect
// has should be enough to act on — Carmen Sandiego rewards this.
export function canIssueWarrant(state) {
  const traitCount = Object.keys(state.traitsLearned).length;
  if (traitCount >= 3) return true;
  if (traitCount >= 1 && matchingSuspectIds(state.traitsLearned).length === 1) return true;
  return false;
}
