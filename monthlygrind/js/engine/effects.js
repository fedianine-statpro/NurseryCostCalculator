import { randInt } from "./rng.js";

const DEFAULT_RECURRING_TURNS = 3;
const MAX_RECURRING_STACK = 2;

// Apply an event card effect to the active player.
// Mutates `player` and `state`. Returns a summary object for the UI log.
export function applyEventEffect(state, player, card, rng) {
  const e = card.effect || {};
  const summary = {
    balanceDelta: 0,
    recurringAdded: 0,
    skipTurns: 0,
    grantExtraTurn: false,
    notes: [],
    appliedPerks: [],
    displacedRecurring: null
  };

  // --- discounts/bonuses from held perks ---
  let immediate = e.immediate || 0;
  let recurring = e.recurring || 0;

  // Positive-category multiplier perks (e.g. Savvy Financial Advisor Access)
  if (immediate > 0) {
    for (const perk of player.perks) {
      const mult = (perk.positiveCategoryMultiplier || {})[card.category];
      if (mult && mult !== 1) {
        const bonus = Math.round(immediate * (mult - 1));
        immediate += bonus;
        summary.appliedPerks.push(`${perk.title} boosted +$${bonus}`);
      }
    }
  }

  // Category-discount perks
  for (const perk of player.perks) {
    const discount = (perk.categoryDiscounts || {})[card.category];
    if (!discount) continue;
    if (immediate < 0) {
      const saved = Math.round(immediate * -discount);
      immediate += saved;
      summary.appliedPerks.push(`${perk.title} saved $${saved}`);
    }
    if (recurring < 0) {
      const savedR = Math.round(recurring * -discount);
      recurring += savedR;
    }
  }

  // Rainy Day Fund — once, absorbs a $300+ immediate loss
  if (immediate <= -300) {
    const rainyIdx = player.perks.findIndex((p) => p.absorbBigLoss && !p.consumed);
    if (rainyIdx >= 0) {
      summary.appliedPerks.push(`Rainy Day Fund absorbed $${Math.abs(immediate)}`);
      immediate = 0;
      player.perks[rainyIdx].consumed = true;
      player.perks[rainyIdx].spent = true;
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

  // --- clear balance (spend all savings) ---
  if (e.clearBalance && player.balance > 0) {
    summary.balanceDelta -= player.balance;
    player.balance = 0;
    summary.notes.push(`Savings cleared`);
  }

  // --- lose all balance (including negatives going to 0) ---
  if (e.loseAllBalance) {
    summary.balanceDelta -= player.balance;
    player.balance = 0;
    summary.notes.push(`Lost everything`);
  }

  // --- recurring effect(s) — plain `recurring` or multi-phase ---
  const toPush = [];
  if (e.recurringPhases && Array.isArray(e.recurringPhases) && e.recurringPhases.length) {
    // Store all phases as a single compound effect with a phase index.
    toPush.push({
      source: card.title,
      phases: e.recurringPhases.map((p) => ({ amount: p.amount, turns: p.turns })),
      phaseIndex: 0,
      turnsLeftInPhase: e.recurringPhases[0].turns,
      amount: e.recurringPhases[0].amount // initial active amount
    });
  } else if (recurring) {
    const remaining = Math.max(0, state.totalDays - player.position);
    const configured = e.recurringTurns ?? DEFAULT_RECURRING_TURNS;
    const turnsLeft = Math.min(configured, remaining);
    // Global positive-recurring damper — keeps the economy tight without
    // needing to rewrite every card. Negatives pass through at full strength.
    const dampened = recurring > 0 ? Math.round(recurring * 0.7) : recurring;
    if (turnsLeft > 0 && dampened !== 0) {
      toPush.push({ amount: dampened, turnsLeft, source: card.title });
      summary.recurringAdded = dampened;
    }
  }

  // --- cap stacking: max 3 active recurring effects ---
  for (const r of toPush) {
    if (player.recurringEffects.length >= MAX_RECURRING_STACK) {
      const removed = player.recurringEffects.shift();
      summary.displacedRecurring = removed?.source || null;
    }
    player.recurringEffects.push(r);
  }

  // --- skip turns ---
  if (e.skipTurns && e.skipTurns > 0) {
    player.skipTurnsRemaining += e.skipTurns;
    summary.skipTurns = e.skipTurns;
  }

  // --- grant extra turn (from the card OR from a perk matched to this category) ---
  let grantExtra = !!e.grantExtraTurn;
  for (const perk of player.perks) {
    if (perk.extraTurnOnCategory && perk.extraTurnOnCategory === card.category) {
      grantExtra = true;
      summary.appliedPerks.push(`${perk.title} grants an extra turn`);
    }
  }
  if (grantExtra) {
    player.grantExtraTurn = true;
    summary.grantExtraTurn = true;
  }

  return summary;
}

// Apply a work card: base income + perk bonuses + small random variance.
// Mutates player, returns { earned, baseIncome, variance }.
export function applyWorkEffect(state, player, card, rng) {
  const baseIncome = card.income || 0;
  let income = baseIncome;

  // ±10% random variance on non-zero income
  let variance = 0;
  if (income > 0 && rng) {
    // integer in [-10, +10]
    const pct = randInt(rng, -10, 10) / 100;
    variance = Math.round(income * pct);
    income += variance;
  }

  // Deferred bonus from an earlier Designer card
  if (player.deferredWorkBonus) {
    income += player.deferredWorkBonus;
    player.deferredWorkBonus = 0;
  }

  // Perk multipliers (promotion, negotiation, networking)
  let multiplier = 1;
  let flatBonus = 0;
  for (const perk of player.perks) {
    if (perk.workIncomeBonus) multiplier += perk.workIncomeBonus;
    if (perk.workFlatBonus) flatBonus += perk.workFlatBonus;
  }
  income = Math.round(income * multiplier) + flatBonus;

  // If this card is the Designer deferred-payment card, queue the bonus
  if (card.deferredBonus) {
    player.deferredWorkBonus += card.deferredBonus;
  }

  player.balance += income;
  return { earned: income, baseIncome, variance };
}

// Tick recurring effects at the start of a player's turn.
// Handles multi-phase effects too.
export function tickRecurringEffects(state, player) {
  if (!player.recurringEffects.length) return { total: 0, breakdown: [] };
  const breakdown = [];
  let total = 0;
  const kept = [];
  for (const r of player.recurringEffects) {
    // Multi-phase: pay the current phase's amount, tick its counter.
    if (r.phases) {
      total += r.amount;
      breakdown.push({ amount: r.amount, source: r.source });
      r.turnsLeftInPhase -= 1;
      if (r.turnsLeftInPhase <= 0) {
        r.phaseIndex += 1;
        if (r.phaseIndex < r.phases.length) {
          r.turnsLeftInPhase = r.phases[r.phaseIndex].turns;
          r.amount = r.phases[r.phaseIndex].amount;
          kept.push(r);
        }
        // else: expired
      } else {
        kept.push(r);
      }
    } else {
      total += r.amount;
      breakdown.push({ amount: r.amount, source: r.source });
      r.turnsLeft -= 1;
      if (r.turnsLeft > 0) kept.push(r);
    }
  }
  player.recurringEffects = kept;
  player.balance += total;
  return { total, breakdown };
}

// Apply per-turn effects from held perks (passive income, random returns).
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

// Called at start of a turn to apply overdraft fee. Respects Safety Net perk.
export function computeOverdraftFee(player, baseRate = 0.1) {
  if (player.balance >= 0) return 0;
  let rate = baseRate;
  if (player.perks.some((p) => p.halveBankFee)) rate = rate / 2;
  return Math.floor(Math.abs(player.balance) * rate);
}

// Called when a perk with `clearNegativeRecurringCategory` is bought to wipe
// matching active debts. Returns number of effects removed.
export function clearRecurringByCategoryHint(player, categoryHint) {
  if (!categoryHint) return 0;
  const before = player.recurringEffects.length;
  // We match by source title containing category-indicative keywords. Simple and good enough.
  const keywords = {
    education: ["School", "Degree", "Course", "Study", "Training", "Abroad"],
    home: ["Home", "House", "DIY"],
    car: ["Car"]
  };
  const needles = keywords[categoryHint] || [];
  player.recurringEffects = player.recurringEffects.filter((r) => {
    if (r.amount >= 0) return true; // only clear negatives
    const hit = needles.some((n) => r.source.includes(n));
    return !hit;
  });
  return before - player.recurringEffects.length;
}
