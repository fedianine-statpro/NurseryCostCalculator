import { activePlayer, MAX_PERK_DRAW_ATTEMPTS, MAX_PERKS_HELD, STARTING_BALANCE } from "./state.js";
import { canMove, canDrawPerk } from "./rules.js";

// The AI makes three decisions each turn:
//   1. Should I draw a perk? (optional, max 2x/game)
//   2. Should I work or move?
//   3. (If a perk offer appears) buy or pass?
//
// Heuristics are intentionally light so the AI feels human-ish, not optimal.

export function aiDecideDrawPerk(state) {
  if (!canDrawPerk(state)) return false;
  const p = activePlayer(state);
  const daysLeft = state.totalDays - p.position;
  // Never draw a perk too late — it likely won't pay itself back
  if (daysLeft < 8) return false;
  // Only draw if we have budget to seriously consider buying (cheapest perk is $300)
  if (p.balance < 650) return false;
  // Don't draw if we're still holding 2 perks
  if (p.perks.length >= MAX_PERKS_HELD) return false;
  // Around 55% likelihood when all gates pass — some variance keeps games fresh
  return state.rng() < 0.55;
}

export function aiDecidePerkPurchase(state, card) {
  const p = activePlayer(state);
  if (p.balance < card.cost) return false;
  const daysLeft = state.totalDays - p.position;
  // Rough expected value heuristic
  let ev = card.oneTimeBonus || 0;
  if (card.passivePerTurn) ev += card.passivePerTurn * daysLeft;
  if (card.randomPerTurn) ev += ((card.randomPerTurn.min + card.randomPerTurn.max) / 2) * daysLeft;
  if (card.workIncomeBonus) ev += 150 * card.workIncomeBonus * Math.min(daysLeft, 5);
  if (card.categoryDiscounts) ev += 120 * Object.values(card.categoryDiscounts).reduce((a, b) => a + b, 0);

  // Buy if EV is comfortably above cost
  return ev > card.cost * 1.1;
}

export function aiDecideAction(state) {
  const p = activePlayer(state);
  if (p.balance < 0) return "work"; // forced by rules anyway
  if (!canMove(state)) return "work";

  const daysLeft = state.totalDays - p.position;
  const balance = p.balance;

  // Late game: race to finish
  if (daysLeft <= 5) {
    if (balance < STARTING_BALANCE && daysLeft >= 2) return "work";
    return "move";
  }

  // Mid game: mostly move, work if cash low
  if (daysLeft <= 12) {
    if (balance < 900) return "work";
    return "move";
  }

  // Early game: build buffer
  if (balance < 1400) return state.rng() < 0.65 ? "work" : "move";
  return "move";
}

// Latency helpers so the AI feels like it's thinking.
export function aiThinkingDelay(min = 350, max = 700) {
  return new Promise((r) => setTimeout(r, min + Math.random() * (max - min)));
}
