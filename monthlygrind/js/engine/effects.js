import { perkFiresForEvent } from "../data/perk-event-map.js";
import { randInt } from "./rng.js";
import { logEvent } from "./state.js";

// Apply an event card effect to the active player.
// Mutates `player` and `state`. Returns a summary object for the UI log.
export function applyEventEffect(state, player, card, rng) {
  const e = card.effect || {};
  const summary = { balanceDelta: 0, recurringAdded: 0, skipTurns: 0, grantExtraTurn: false, notes: [], appliedPerks: [] };

  // --- discounts/bonuses from held perks ---
  let immediate = e.immediate || 0;
  let recurring = e.recurring || 0;

  for (const perk of player.perks) {
    // Category discounts apply to the event's category if it matches.
    const discount = (perk.categoryDiscounts || {})[card.category];
    const perkTriggersOnTitle = perkFiresForEvent(perk.id, card.title);
    if (discount && (discount > 0) && (immediate < 0 || recurring < 0)) {
      if (immediate < 0) {
        const saved = Math.round(immediate * -discount);
        immediate = immediate + saved;
        summary.appliedPerks.push(`${perk.title} saved $${saved}`);
      }
      if (recurring < 0) {
        const savedR = Math.round(recurring * -discount);
        recurring = recurring + savedR;
      }
    } else if (perkTriggersOnTitle && perk.oneTimeBonus && !perk.hasFired) {
      // Named-event nudges: pay out the one-time bonus if not already fired.
      // (We don't actually mark it fired here — perk is considered permanent.)
    }
  }

  // --- immediate balance change ---
  if (immediate) {
    player.balance += immediate;
    summary.balanceDelta += immediate;
  }

  // --- multiplier (e.g. Market Master doubles money) ---
  if (e.multiplier && e.multiplier !== 1 && player.balance > 0) {
    const before = player.balance;
    player.balance = Math.round(player.balance * e.multiplier);
    summary.balanceDelta += player.balance - before;
    summary.notes.push(`×${e.multiplier} on your balance`);
  }

  // --- halve balance (only on positive) ---
  if (e.halveBalance && player.balance > 0) {
    const before = player.balance;
    player.balance = Math.floor(player.balance / 2);
    summary.balanceDelta += player.balance - before;
    summary.notes.push(`Lost half your money`);
  }

  // --- clear balance (spend all savings -> goes to 0 if positive) ---
  if (e.clearBalance && player.balance > 0) {
    summary.balanceDelta -= player.balance;
    player.balance = 0;
    summary.notes.push(`Savings cleared`);
  }

  // --- lose all balance (including going to 0 even if already negative) ---
  if (e.loseAllBalance) {
    summary.balanceDelta -= player.balance;
    player.balance = 0;
    summary.notes.push(`Lost everything`);
  }

  // --- recurring effect (capped by days remaining so effects can't run forever) ---
  if (recurring) {
    const remaining = Math.max(0, state.totalDays - player.position);
    if (remaining > 0) {
      player.recurringEffects.push({
        amount: recurring,
        turnsLeft: remaining,
        source: card.title
      });
      summary.recurringAdded = recurring;
    }
  }

  // --- skip turns ---
  if (e.skipTurns && e.skipTurns > 0) {
    player.skipTurnsRemaining += e.skipTurns;
    summary.skipTurns = e.skipTurns;
  }

  // --- grant extra turn ---
  if (e.grantExtraTurn) {
    player.grantExtraTurn = true;
    summary.grantExtraTurn = true;
  }

  return summary;
}

// Apply a work card: base income + perk bonuses. Mutates player, returns { earned }.
export function applyWorkEffect(state, player, card) {
  let income = card.income || 0;

  // Deferred bonus from an earlier Designer card
  if (player.deferredWorkBonus) {
    income += player.deferredWorkBonus;
    player.deferredWorkBonus = 0;
  }

  // Promotion / negotiation perks stack
  let multiplier = 1;
  for (const perk of player.perks) {
    if (perk.workIncomeBonus) multiplier += perk.workIncomeBonus;
  }
  income = Math.round(income * multiplier);

  // If this card is the Designer deferred-payment card, queue the bonus for next work turn
  if (card.deferredBonus) {
    player.deferredWorkBonus += card.deferredBonus;
  }

  player.balance += income;
  return { earned: income };
}

// Apply each of a player's recurring effects at the start of their turn (before they act).
// Decrement turnsLeft; drop expired ones.
export function tickRecurringEffects(state, player) {
  if (!player.recurringEffects.length) return { total: 0, breakdown: [] };
  const breakdown = [];
  let total = 0;
  const kept = [];
  for (const r of player.recurringEffects) {
    total += r.amount;
    breakdown.push({ amount: r.amount, source: r.source });
    r.turnsLeft -= 1;
    if (r.turnsLeft > 0) kept.push(r);
  }
  player.recurringEffects = kept;
  player.balance += total;
  return { total, breakdown };
}

// Apply per-turn effects from held perks (passive income, random returns).
// Returns aggregate { total, breakdown }.
export function tickPerkPassives(state, player, rng) {
  let total = 0;
  const breakdown = [];
  for (const perk of player.perks) {
    if (perk.passivePerTurn) {
      total += perk.passivePerTurn;
      breakdown.push({ amount: perk.passivePerTurn, source: perk.title });
    }
    if (perk.randomPerTurn) {
      const amt = randInt(rng, perk.randomPerTurn.min, perk.randomPerTurn.max);
      if (amt !== 0) {
        total += amt;
        breakdown.push({ amount: amt, source: perk.title });
      }
    }
  }
  player.balance += total;
  return { total, breakdown };
}
