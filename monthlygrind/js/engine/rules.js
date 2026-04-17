import {
  activePlayer,
  otherPlayer,
  drawFrom,
  discardTo,
  logEvent,
  BANK_FEE_RATE,
  MAX_PERKS_HELD,
  MAX_PERK_DRAW_ATTEMPTS,
  STARTING_BALANCE,
  COST_OF_LIVING
} from "./state.js";
import {
  applyEventEffect,
  applyWorkEffect,
  tickRecurringEffects,
  tickPerkPassives,
  computeOverdraftFee,
  clearRecurringByCategoryHint
} from "./effects.js";

// Each turn advances the player exactly one day. The choice is:
//   - WORK: take a modest, steady paycheck (low variance)
//   - MOVE: draw an event card (high variance — could be great or catastrophic)
//
// The UI replays each rule-emitted event in order to animate the turn.
//
// Event shapes:
//   { type: "turn-start",   playerId }
//   { type: "recurring",    playerId, total, breakdown }
//   { type: "perk-passive", playerId, total, breakdown }
//   { type: "overdraft-fee",playerId, fee }
//   { type: "advance",      playerId, from, to }
//   { type: "work-drawn",   playerId, card, earned }
//   { type: "event-drawn",  playerId, card, summary }
//   { type: "finish",       playerId }
//   { type: "perk-offered", playerId, card, affordable }
//   { type: "perk-bought",  playerId, card }
//   { type: "perk-skipped", playerId, reason }
//   { type: "turn-end",     playerId }
//   { type: "game-over",    winnerId, summary }

export function beginPlayerTurn(state) {
  const events = [];
  const player = activePlayer(state);
  player.hasDrawnPerkThisTurn = false;
  events.push({ type: "turn-start", playerId: player.id });

  // If the player is skipping, burn a skip token and end the turn.
  if (player.skipTurnsRemaining > 0) {
    player.skipTurnsRemaining -= 1;
    logEvent(state, { actor: player.id, text: `${player.name} sits this turn out.`, kind: "sys" });
    events.push({ type: "skip-turn", playerId: player.id });
    events.push(...endPlayerTurn(state));
    return events;
  }

  // Flat cost of living first — rent/groceries/utilities don't care about your hustle.
  if (COST_OF_LIVING > 0) {
    player.balance -= COST_OF_LIVING;
    events.push({ type: "cost-of-living", playerId: player.id, amount: COST_OF_LIVING });
    logEvent(state, {
      actor: player.id,
      text: `Cost of living: −$${COST_OF_LIVING}`,
      kind: "sys",
      delta: -COST_OF_LIVING
    });
  }

  // Apply recurring effects then perk passives at the top of the turn.
  const recurring = tickRecurringEffects(state, player);
  if (recurring.total !== 0) {
    events.push({ type: "recurring", playerId: player.id, ...recurring });
    logEvent(state, {
      actor: player.id,
      text: `Ongoing effects: ${formatMoney(recurring.total)}`,
      kind: "sys",
      delta: recurring.total
    });
  }

  const passives = tickPerkPassives(state, player, state.rng);
  if (passives.total !== 0) {
    events.push({ type: "perk-passive", playerId: player.id, ...passives });
    logEvent(state, {
      actor: player.id,
      text: `Perks: ${formatMoney(passives.total)}`,
      kind: "sys",
      delta: passives.total
    });
  }

  // If the player is in debt, charge an overdraft fee and force work.
  // Safety Net perk halves the fee.
  if (player.balance < 0) {
    const fee = computeOverdraftFee(player, BANK_FEE_RATE);
    if (fee > 0) {
      player.balance -= fee;
      events.push({ type: "overdraft-fee", playerId: player.id, fee });
      const rateLabel = player.perks.some((p) => p.halveBankFee) ? "5%" : "10%";
      logEvent(state, {
        actor: player.id,
        text: `Bank fee: −$${fee} (${rateLabel} of debt)`,
        kind: "sys",
        delta: -fee
      });
    }
  }

  state.phase = "awaiting-action";
  return events;
}

// Move is allowed as long as the player isn't in debt and hasn't finished yet.
// In debt? You're forced to work until you're back in the black.
export function canMove(state) {
  const player = activePlayer(state);
  return player.balance >= 0 && player.position < state.totalDays;
}
export function canWork(state) {
  const player = activePlayer(state);
  return player.position < state.totalDays;
}
export function canDrawPerk(state) {
  const player = activePlayer(state);
  return (
    player.perkDrawAttempts < MAX_PERK_DRAW_ATTEMPTS &&
    !player.hasDrawnPerkThisTurn &&
    player.perks.length < MAX_PERKS_HELD &&
    state.phase === "awaiting-action"
  );
}

// Advance the active player by one day. Returns the "advance" event entry.
function advanceOneDay(state, player) {
  const from = player.position;
  const to = Math.min(state.totalDays, from + 1);
  player.position = to;
  return { type: "advance", playerId: player.id, from, to };
}

export function doWork(state) {
  const events = [];
  const player = activePlayer(state);
  if (!canWork(state)) return events;

  // Advance first so the player moves onto the day as they work it.
  events.push(advanceOneDay(state, player));

  const card = drawFrom(state, "work");
  const { earned } = applyWorkEffect(state, player, card, state.rng);
  discardTo(state, "work", card);
  player.workCardsDrawn = (player.workCardsDrawn || 0) + 1;

  // Work streak bonus: three consecutive Work turns pays a +$100 kicker.
  player.consecutiveWorkTurns = (player.consecutiveWorkTurns || 0) + 1;
  let streakBonus = 0;
  if (player.consecutiveWorkTurns >= 3) {
    streakBonus = 100;
    player.balance += streakBonus;
    player.consecutiveWorkTurns = 0; // reset after paying out
    logEvent(state, { actor: player.id, text: `${player.name} hit a work streak! +$100`, kind: "sys", delta: streakBonus });
  }

  // Weekend Warrior perk: bonus on weekend tiles
  const tile = state.board[player.position - 1];
  if (tile?.type === "weekend") {
    for (const perk of player.perks) {
      if (perk.weekendBonus) {
        player.balance += perk.weekendBonus;
        logEvent(state, { actor: player.id, text: `${perk.title}: +$${perk.weekendBonus}`, kind: "sys", delta: perk.weekendBonus });
      }
    }
  }

  events.push({ type: "work-drawn", playerId: player.id, card, earned, streakBonus });
  logEvent(state, {
    actor: player.id,
    text: `${player.name} worked as ${card.title}.`,
    kind: player.id,
    delta: earned
  });

  if (player.position >= state.totalDays) {
    events.push({ type: "finish", playerId: player.id });
    logEvent(state, { actor: player.id, text: `${player.name} reached Day 31!`, kind: "sys" });
  }

  events.push(...endPlayerTurn(state));
  return events;
}

export function doMove(state) {
  const events = [];
  const player = activePlayer(state);
  if (!canMove(state)) return events;

  // Choosing Move breaks the work-streak counter.
  player.consecutiveWorkTurns = 0;

  events.push(advanceOneDay(state, player));

  // Weekend Warrior perk: bonus on weekend tiles (also fires on Move)
  const landedTile = state.board[player.position - 1];
  if (landedTile?.type === "weekend") {
    for (const perk of player.perks) {
      if (perk.weekendBonus) {
        player.balance += perk.weekendBonus;
        logEvent(state, { actor: player.id, text: `${perk.title}: +$${perk.weekendBonus}`, kind: "sys", delta: perk.weekendBonus });
      }
    }
  }

  // The final tile is safe — reaching day 31 shouldn't trigger one last event draw.
  if (player.position >= state.totalDays) {
    events.push({ type: "finish", playerId: player.id });
    logEvent(state, { actor: player.id, text: `${player.name} reached Day 31!`, kind: "sys" });
    events.push(...endPlayerTurn(state));
    return events;
  }

  // Weekend tile: pause for a mini-choice (chill / eat out / weekend job) before the event card.
  if (landedTile?.type === "weekend") {
    state.phase = "weekend-choice";
    state.pendingWeekendChoice = { playerId: player.id };
    events.push({ type: "weekend-choice-needed", playerId: player.id });
    return events;
  }

  // Otherwise moving is the risky action — always draw an event card.
  const card = drawFrom(state, "event");

  // A/B choice cards pause the engine; caller must call resolveEventChoice.
  if (card.choice && Array.isArray(card.choice.options) && card.choice.options.length >= 2) {
    state.phase = "event-choice";
    state.pendingEventChoice = { card, playerId: player.id };
    events.push({ type: "event-choice-needed", playerId: player.id, card });
    return events;
  }

  const summary = applyEventEffect(state, player, card, state.rng);
  discardTo(state, "event", card);
  player.eventCardsDrawn = (player.eventCardsDrawn || 0) + 1;
  if (player.balance < 0) player.wentBelowZero = true;
  events.push({ type: "event-drawn", playerId: player.id, card, summary });

  const logParts = [`${player.name} drew “${card.title}”.`];
  if (summary.appliedPerks.length) logParts.push(summary.appliedPerks.join(", "));
  logEvent(state, {
    actor: player.id,
    text: logParts.join(" "),
    kind: player.id,
    delta: summary.balanceDelta || undefined
  });

  events.push(...endPlayerTurn(state));
  return events;
}

// The 3 weekend-choice options offered on weekend tiles.
export const WEEKEND_OPTIONS = [
  { id: "chill",   label: "Chill",         hint: "Nothing happens.",            effect: {} },
  { id: "eatout",  label: "Eat out",       hint: "−$40 now, +$25/turn × 3.",    effect: { immediate: -40, recurring: 25, recurringTurns: 3 } },
  { id: "weekend", label: "Weekend job",   hint: "+$150 now, skip next turn.",  effect: { immediate: 150, skipTurns: 1 } }
];

// Apply a weekend-choice (0-2), then continue with drawing an event card
// and ending the turn.
export function resolveWeekendChoice(state, optionIndex = 0) {
  const events = [];
  const pending = state.pendingWeekendChoice;
  if (!pending) return events;
  const player = state.players.find((p) => p.id === pending.playerId);
  const option = WEEKEND_OPTIONS[optionIndex] || WEEKEND_OPTIONS[0];

  const chosenCard = {
    title: `Weekend — ${option.label}`,
    category: "entertainment",
    effect: option.effect
  };
  const summary = applyEventEffect(state, player, chosenCard, state.rng);
  logEvent(state, {
    actor: player.id,
    text: `${player.name}'s weekend: ${option.label}.`,
    kind: player.id,
    delta: summary.balanceDelta || undefined
  });
  events.push({ type: "weekend-chosen", playerId: player.id, option });

  state.pendingWeekendChoice = null;
  state.phase = "awaiting-action";

  // Now continue with an event-card draw as the Move normally would
  const card = drawFrom(state, "event");
  if (card.choice && Array.isArray(card.choice.options) && card.choice.options.length >= 2) {
    state.phase = "event-choice";
    state.pendingEventChoice = { card, playerId: player.id };
    events.push({ type: "event-choice-needed", playerId: player.id, card });
    return events;
  }
  const eventSummary = applyEventEffect(state, player, card, state.rng);
  discardTo(state, "event", card);
  player.eventCardsDrawn = (player.eventCardsDrawn || 0) + 1;
  if (player.balance < 0) player.wentBelowZero = true;
  events.push({ type: "event-drawn", playerId: player.id, card, summary: eventSummary });
  const logParts = [`${player.name} drew “${card.title}”.`];
  if (eventSummary.appliedPerks.length) logParts.push(eventSummary.appliedPerks.join(", "));
  logEvent(state, {
    actor: player.id,
    text: logParts.join(" "),
    kind: player.id,
    delta: eventSummary.balanceDelta || undefined
  });
  events.push(...endPlayerTurn(state));
  return events;
}

// Resolve an event-choice card (A/B). optionIndex picks which option's effect
// to apply. Discards the card, then ends the turn as normal.
export function resolveEventChoice(state, optionIndex = 0) {
  const events = [];
  const pending = state.pendingEventChoice;
  if (!pending) return events;
  const player = state.players.find((p) => p.id === pending.playerId);
  const card = pending.card;
  const option = card.choice.options[optionIndex] || card.choice.options[0];

  // Synthesize a card-like object with the chosen option's effect
  const chosenCard = {
    title: `${card.title} — ${option.label}`,
    category: card.category,
    effect: option.effect
  };
  const summary = applyEventEffect(state, player, chosenCard, state.rng);

  discardTo(state, "event", card);
  player.eventCardsDrawn = (player.eventCardsDrawn || 0) + 1;
  if (player.balance < 0) player.wentBelowZero = true;

  events.push({ type: "event-drawn", playerId: player.id, card: chosenCard, summary });
  const logParts = [`${player.name} chose: ${option.label}`];
  if (summary.appliedPerks.length) logParts.push(summary.appliedPerks.join(", "));
  logEvent(state, {
    actor: player.id,
    text: logParts.join(" "),
    kind: player.id,
    delta: summary.balanceDelta || undefined
  });

  state.pendingEventChoice = null;
  state.phase = "awaiting-action";
  events.push(...endPlayerTurn(state));
  return events;
}

// Attempt to draw perks — shows 3 options so the choice is strategic, not RNG.
// The caller then calls resolvePerkOffer with { decision, chosenIndex }.
export function drawPerk(state) {
  const events = [];
  const player = activePlayer(state);
  if (!canDrawPerk(state)) return events;

  player.perkDrawAttempts += 1;
  player.hasDrawnPerkThisTurn = true;
  const cards = [];
  const drawCount = Math.min(3, state.decks.perk.length + state.discards.perk.length);
  for (let i = 0; i < drawCount; i++) {
    const c = drawFrom(state, "perk");
    if (c) cards.push(c);
  }
  state.phase = "perk-offer";
  state.pendingPerkOffer = { cards, playerId: player.id };
  events.push({ type: "perk-offered", playerId: player.id, cards });
  return events;
}

// Resolve the choice. `decision` is "buy" or "pass". `chosenIndex` selects
// which of the 3 offered perks to act on (only meaningful on "buy").
// Unchosen cards return to the bottom of the perk deck for later draws.
export function resolvePerkOffer(state, arg /* "buy"|"pass" | { decision, chosenIndex } */) {
  const events = [];
  const offer = state.pendingPerkOffer;
  if (!offer) return events;

  const decision = typeof arg === "string" ? arg : arg.decision;
  const chosenIndex = typeof arg === "string" ? 0 : (arg.chosenIndex ?? 0);
  const player = state.players.find((p) => p.id === offer.playerId);
  const offered = offer.cards || [];
  const card = offered[chosenIndex] || offered[0];

  if (decision === "buy" && player.balance >= card.cost) {
    player.balance -= card.cost;
    const perkInstance = { ...card, hasFired: false };
    player.perks.push(perkInstance);

    // One-time immediate bonus (e.g., inheritance-style perks)
    if (card.oneTimeBonus) {
      player.balance += card.oneTimeBonus;
    }
    // Skip-on-buy perks (cultural, retreat, vacation, conference)
    if (card.skipOnBuy) {
      player.skipTurnsRemaining += card.skipOnBuy;
    }
    // Clear matching negative recurring on buy (Student Loan Angel Investor)
    if (card.clearNegativeRecurringCategory) {
      const removed = clearRecurringByCategoryHint(player, card.clearNegativeRecurringCategory);
      if (removed > 0) {
        logEvent(state, {
          actor: player.id,
          text: `${card.title} cleared ${removed} lingering ${card.clearNegativeRecurringCategory} debt${removed > 1 ? "s" : ""}.`,
          kind: "sys"
        });
      }
    }

    events.push({ type: "perk-bought", playerId: player.id, card });
    logEvent(state, {
      actor: player.id,
      text: `${player.name} bought “${card.title}”${card.oneTimeBonus ? ` (+$${card.oneTimeBonus})` : ""}.`,
      kind: player.id,
      delta: (card.oneTimeBonus || 0) - card.cost
    });
    // Return the other two unchosen perks to the bottom of the deck
    for (let i = 0; i < offered.length; i++) {
      if (i !== chosenIndex) state.decks.perk.unshift(offered[i]);
    }
  } else {
    // Pass — discard all three
    for (const c of offered) discardTo(state, "perk", c);
    events.push({ type: "perk-skipped", playerId: player.id, reason: decision });
    logEvent(state, {
      actor: player.id,
      text: `${player.name} passed on the perk offers.`,
      kind: player.id
    });
  }

  state.pendingPerkOffer = null;
  state.phase = "awaiting-action";
  return events;
}

export function endPlayerTurn(state) {
  const events = [];
  const player = activePlayer(state);
  events.push({ type: "turn-end", playerId: player.id });

  // Check game end
  if (isGameOver(state)) {
    state.phase = "game-over";
    state.winnerId = determineWinner(state);
    events.push({ type: "game-over", winnerId: state.winnerId, summary: endSummary(state) });
    return events;
  }

  // Extra turn?
  if (player.grantExtraTurn) {
    player.grantExtraTurn = false;
    player.hasDrawnPerkThisTurn = false;
    logEvent(state, {
      actor: player.id,
      text: `${player.name} gets another turn!`,
      kind: "sys"
    });
    return events; // active player unchanged
  }

  // Hand over to the other player
  state.activePlayerId = otherPlayer(state).id;
  if (state.activePlayerId === "you") {
    state.turn += 1;
  }
  return events;
}

export function isGameOver(state) {
  // Ends when any player reaches the final day.
  return state.players.some((p) => p.position >= state.totalDays);
}

export function determineWinner(state) {
  const qualified = state.players.filter(
    (p) => p.position >= state.totalDays && p.balance >= STARTING_BALANCE
  );
  if (qualified.length > 0) {
    return qualified.reduce((a, b) => (a.balance >= b.balance ? a : b)).id;
  }
  // If no one qualifies but someone reached the end:
  const finished = state.players.filter((p) => p.position >= state.totalDays);
  if (finished.length > 0) {
    return null; // it's a loss for both
  }
  return null;
}

export function endSummary(state) {
  return state.players.map((p) => ({
    id: p.id,
    name: p.name,
    balance: p.balance,
    position: p.position,
    qualified: p.position >= state.totalDays && p.balance >= STARTING_BALANCE
  }));
}

function formatMoney(n) {
  if (n > 0) return `+$${n}`;
  if (n < 0) return `−$${Math.abs(n)}`;
  return "$0";
}
