import { activePlayer, MAX_PERK_DRAW_ATTEMPTS, MAX_PERKS_HELD, STARTING_BALANCE } from "./state.js";
import { canMove, canDrawPerk, canRetrain, getRetrainCost, getRetrainableJobs } from "./rules.js";
import { effectiveSalary } from "./effects.js";

// The AI makes three decisions each turn:
//   1. Should I draw a perk? (optional, max 2x/game)
//   2. Should I work or move?
//   3. (If a perk offer appears) buy or pass?
//
// Heuristics are intentionally light so the AI feels human-ish, not optimal.

export function aiDecideDrawPerk(state) {
  if (!canDrawPerk(state)) return false; // includes the work-gate
  const p = activePlayer(state);
  const daysLeft = state.totalDays - p.position;
  // Never draw a perk too late — it likely won't pay itself back
  if (daysLeft < 6) return false;
  // Cheapest perk is now $800+; don't bother drawing unless we can meaningfully spend
  if (p.balance < 900) return false;
  if (p.perks.length >= MAX_PERKS_HELD) return false;
  // Around 55% likelihood when all gates pass — some variance keeps games fresh
  return state.rng() < 0.55;
}

// EV for a single perk given current game state (days left).
function perkEV(card, daysLeft) {
  let ev = card.oneTimeBonus || 0;
  if (card.passivePerTurn) ev += card.passivePerTurn * daysLeft;
  if (card.randomPerTurn) ev += ((card.randomPerTurn.min + card.randomPerTurn.max) / 2) * daysLeft;
  if (card.workIncomeBonus) ev += 150 * card.workIncomeBonus * Math.min(daysLeft, 6);
  if (card.workFlatBonus) ev += card.workFlatBonus * Math.min(daysLeft, 6);
  if (card.weekendBonus) ev += card.weekendBonus * Math.max(0, Math.floor(daysLeft / 7));
  if (card.halveBankFee) ev += 150;
  if (card.absorbBigLoss) ev += 200;
  if (card.categoryDiscounts) {
    for (const v of Object.values(card.categoryDiscounts)) ev += 80 * v * 2;
  }
  if (card.positiveCategoryMultiplier) {
    for (const m of Object.values(card.positiveCategoryMultiplier)) ev += 100 * (m - 1);
  }
  if (card.skipOnBuy) ev -= 150 * card.skipOnBuy;
  return ev;
}

// When offered 3 perks, pick the highest-EV affordable one. Return { chosenIndex, decision }.
export function aiChoosePerk(state, cards) {
  const p = activePlayer(state);
  const daysLeft = state.totalDays - p.position;
  let bestIdx = 0, bestEv = -Infinity;
  for (let i = 0; i < cards.length; i++) {
    if (p.balance < cards[i].cost) continue;
    const ev = perkEV(cards[i], daysLeft);
    if (ev > bestEv) { bestEv = ev; bestIdx = i; }
  }
  const chosen = cards[bestIdx];
  if (!chosen || p.balance < chosen.cost) return { decision: "pass", chosenIndex: 0 };
  // In a taut economy, tying up $400+ in a perk has real opportunity cost.
  // Require a clear positive return over the cost.
  return bestEv > chosen.cost * 0.75
    ? { decision: "buy", chosenIndex: bestIdx }
    : { decision: "pass", chosenIndex: 0 };
}

// Legacy single-perk signature — retained for backwards compat in sim scripts.
export function aiDecidePerkPurchase(state, card) {
  const p = activePlayer(state);
  if (p.balance < card.cost) return false;
  const daysLeft = state.totalDays - p.position;
  return perkEV(card, daysLeft) > card.cost * 0.75;
}

// Both actions advance 1 day now, so the decision is pure risk/reward:
//   WORK → safe, predictable income
//   MOVE → draw an event card (could be big gain or big loss)
// The AI reads: balance, lead over opponent, days remaining, perks held.
export function aiDecideAction(state) {
  const p = activePlayer(state);
  const other = state.players.find((x) => x.id !== p.id);
  if (p.balance < 0) return "work"; // rules force this
  if (!canMove(state)) return "work";

  const daysLeft = state.totalDays - p.position;
  const balance = p.balance;
  const lead = balance - (other?.balance ?? 0);

  // Amount we need at the end to win comfortably. Budget in per-turn cost of living.
  // Use $115 as an internal estimate to avoid hard-coding.
  const projectedExpenses = daysLeft * 115;
  const safetyBuffer = STARTING_BALANCE + 300;
  const needed = projectedExpenses + safetyBuffer;

  // Behind and running out of days → take measured swings
  if (daysLeft <= 5 && lead < -200) {
    return state.rng() < 0.5 ? "move" : "work";
  }

  // Ahead and running out of days → lock it in
  if (daysLeft <= 5 && lead > 300 && balance > needed) {
    return "work";
  }

  // In a comfortable position → mostly work, some exploration
  if (balance > needed + 300 && daysLeft > 5) {
    return state.rng() < 0.3 ? "move" : "work";
  }

  // Behind → take more risks but not reckless
  if (lead < -300 && daysLeft > 3) {
    return state.rng() < 0.45 ? "move" : "work";
  }

  // Default: weigh balance vs expected needs. Narrower variance.
  if (balance < needed - 200) return state.rng() < 0.25 ? "move" : "work";
  return state.rng() < 0.38 ? "move" : "work";
}

// Pick a weekend option. In-debt players work; comfortable players rest; otherwise eat out.
export function aiChooseWeekend(state) {
  const p = activePlayer(state);
  if (p.balance < 500) return 2; // weekend job
  if (p.balance > 3500) return 0; // chill
  return 1; // eat out
}

// Pick the higher-EV option on an A/B event. Returns the option's index.
export function aiChooseEventOption(state, card) {
  const p = activePlayer(state);
  const daysLeft = Math.max(0, state.totalDays - p.position);
  const options = card.choice?.options || [];
  let bestIdx = 0, bestEv = -Infinity;
  for (let i = 0; i < options.length; i++) {
    const e = options[i].effect || {};
    let ev = (e.immediate || 0);
    if (e.recurring) {
      const turns = Math.min(e.recurringTurns ?? 5, daysLeft);
      ev += e.recurring * turns;
    }
    if (Array.isArray(e.recurringPhases)) {
      for (const ph of e.recurringPhases) ev += ph.amount * Math.min(ph.turns, daysLeft);
    }
    if (e.skipTurns) ev -= 140 * e.skipTurns;        // a skipped turn is ~a missed Work
    if (e.grantExtraTurn) ev += 140;
    if (e.halveBalance) ev -= Math.max(100, p.balance / 2);
    if (e.clearBalance) ev -= p.balance;
    if (e.loseAllBalance) ev -= p.balance;
    if (ev > bestEv) { bestEv = ev; bestIdx = i; }
  }
  return bestIdx;
}

// Decide whether to retrain this turn. Retraining costs 4× current salary so
// only makes sense early when there's time to earn the investment back, and
// when the *expected* salary bump actually covers the cost.
export function aiDecideRetrain(state) {
  if (!canRetrain(state)) return false;
  const p = activePlayer(state);
  const daysLeft = state.totalDays - p.position;
  if (daysLeft < 14) return false; // retraining resets to Junior now, so need more runway
  const cost = getRetrainCost(p);
  const options = getRetrainableJobs(p);
  if (!options.length) return false;
  // Compare: current effective salary vs the new career's Junior salary (0.7× base).
  // The candidate list uses base income, so scale by 0.7 for the post-retrain reality.
  const avgNewJunior = 0.7 * options.reduce((s, c) => s + (c.income || 0), 0) / options.length;
  const curEffective = effectiveSalary(p);
  const expectedBump = avgNewJunior - curEffective;
  // Assume ~0.7 × daysLeft future Work turns; require net +$200
  const expectedGain = expectedBump * daysLeft * 0.7 - cost;
  return expectedGain > 200;
}

// Latency helpers so the AI feels like it's thinking.
export function aiThinkingDelay(min = 350, max = 700) {
  return new Promise((r) => setTimeout(r, min + Math.random() * (max - min)));
}
