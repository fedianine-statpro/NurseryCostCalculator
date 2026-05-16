// Career progress: persisted across cases via localStorage. Tracks which
// cases the player has closed, which rank they hold, and renders the V.I.L.E.
// ladder. Also produces a "doc-check" trivia question between cases drawn
// from facts the player actually saw in the just-finished case.

import { CITIES } from "../data/cities.js";
import { getLocale } from "../i18n/i18n.js";

const STORAGE_KEY = "globe-detective.progress";

// Ranks ladder. The player's rank grows by 1 each time they CLOSE a case AND
// pass the doc-check, capped at 5. Failing the doc-check holds rank.
export const RANK_KEYS = ["rookie","detective","inspector","superSleuth","ace"];

function blank() {
  return { closed: [], wrongs: [], rank: 0 };
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return blank();
    const p = JSON.parse(raw);
    return {
      closed: Array.isArray(p.closed) ? p.closed : [],
      wrongs: Array.isArray(p.wrongs) ? p.wrongs : [],
      rank: typeof p.rank === "number" ? Math.min(Math.max(p.rank, 0), RANK_KEYS.length - 1) : 0,
    };
  } catch {
    return blank();
  }
}

export function saveProgress(p) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch {}
}

export function markCaseWon(caseId) {
  const p = loadProgress();
  if (!p.closed.includes(caseId)) p.closed.push(caseId);
  saveProgress(p);
  return p;
}

export function promoteRank() {
  const p = loadProgress();
  if (p.rank < RANK_KEYS.length - 1) p.rank++;
  saveProgress(p);
  return p;
}

export function resetProgress() {
  saveProgress(blank());
}

export function getRankKey() {
  return RANK_KEYS[loadProgress().rank];
}

export function caseUnlocked(caseDef) {
  if (!caseDef.requiresWins) return true;
  const p = loadProgress();
  return p.closed.filter(id => id !== caseDef.id).length >= caseDef.requiresWins;
}

// ── Doc-check trivia ────────────────────────────────────────────────────────
//
// Build one question drawn from the facts the player actually encountered
// during the just-finished case. We pick a (fact-category, correct city)
// pair from `state.factsHighlighted` (the puzzle hooks), fall back to
// `state.factsByCity` if needed, then sample 3 distractor cities of the same
// continent where possible so the question is fair (not "which of these 18
// cities uses the yen?").

const FACT_KEYS_FOR_TRIVIA = ["currency","language","food","landmark","flagColors"];

export function buildTriviaQuestion(state) {
  const L = getLocale();
  const pool = [];
  for (const [cityId, set] of Object.entries(state.factsHighlighted || {})) {
    for (const k of set) {
      if (FACT_KEYS_FOR_TRIVIA.includes(k)) pool.push({ cityId, factKey: k });
    }
  }
  // Fallback: any city we recorded facts for (visited).
  if (pool.length === 0) {
    for (const cityId of Object.keys(state.factsByCity || {})) {
      for (const k of FACT_KEYS_FOR_TRIVIA) pool.push({ cityId, factKey: k });
    }
  }
  if (pool.length === 0) return null;

  // Pick deterministically by case id + closed-count so the same case + same
  // session doesn't re-roll the same question on revisit.
  const seedStr = (state.caseId || "") + ":" + (loadProgress().closed.length);
  let h = 0;
  for (let i = 0; i < seedStr.length; i++) h = (h*131 + seedStr.charCodeAt(i)) >>> 0;
  const pick = pool[h % pool.length];
  const correctCity = L.cities[pick.cityId];
  const factValue = correctCity[pick.factKey];

  // Distractors: 3 other cities that have a different value for this fact.
  const allCities = Object.keys(CITIES).filter(id => id !== pick.cityId);
  const distractors = [];
  const start = (h >>> 3) % allCities.length;
  for (let step = 0; step < allCities.length * 2 && distractors.length < 3; step++) {
    const cid = allCities[(start + step) % allCities.length];
    const cd = L.cities[cid];
    if (cd[pick.factKey] !== factValue && !distractors.includes(cid)) {
      distractors.push(cid);
    }
  }

  // Shuffle the four options deterministically.
  const options = [pick.cityId, ...distractors];
  for (let j = options.length - 1; j > 0; j--) {
    const k = ((h >>> (j+2)) % (j + 1));
    [options[j], options[k]] = [options[k], options[j]];
  }

  return {
    factKey: pick.factKey,
    factValue,
    correctCityId: pick.cityId,
    options,
  };
}
