import {
  activePlayer,
  otherPlayer,
  drawFrom,
  discardTo,
  logEvent,
  BANK_FEE_RATE,
  MAX_PERKS_HELD,
  MAX_PERK_DRAW_ATTEMPTS,
  STARTING_BALANCE
} from "./state.js";
import { applyEventEffect, applyWorkEffect, tickRecurringEffects, tickPerkPassives } from "./effects.js";
import { rollD6 } from "./rng.js";

// A single "beat" of the turn loop is represented as a sequence of events the UI
// can animate. Each rule function pushes events onto a list and returns it.
//
// Event shapes:
//   { type: "turn-start",   playerId }
//   { type: "recurring",    playerId, total, breakdown }
//   { type: "perk-passive", playerId, total, breakdown }
//   { type: "overdraft-fee",playerId, fee }
//   { type: "work-drawn",   playerId, card, earned }
//   { type: "dice-rolled",  playerId, roll, from, to }
//   { type: "tile-landed",  playerId, tile }
//   { type: "event-drawn",  playerId, card, summary }
//   { type: "payday",       playerId, amount }
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
  if (player.balance < 0) {
    const fee = Math.floor(Math.abs(player.balance) * BANK_FEE_RATE);
    if (fee > 0) {
      player.balance -= fee;
      events.push({ type: "overdraft-fee", playerId: player.id, fee });
      logEvent(state, {
        actor: player.id,
        text: `Bank fee: −$${fee} (10% of debt)`,
        kind: "sys",
        delta: -fee
      });
    }
  }

  state.phase = "awaiting-action";
  return events;
}

export function canMove(state) {
  const player = activePlayer(state);
  return player.balance >= 0 && player.position < state.totalDays;
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

export function doWork(state) {
  const events = [];
  const player = activePlayer(state);
  const card = drawFrom(state, "work");
  const { earned } = applyWorkEffect(state, player, card);
  discardTo(state, "work", card);
  events.push({ type: "work-drawn", playerId: player.id, card, earned });
  logEvent(state, {
    actor: player.id,
    text: `${player.name} worked as ${card.title}.`,
    kind: player.id,
    delta: earned
  });
  events.push(...endPlayerTurn(state));
  return events;
}

export function doMove(state) {
  const events = [];
  const player = activePlayer(state);
  if (!canMove(state)) return events;

  const roll = rollD6(state.rng);
  const from = player.position;
  const to = Math.min(state.totalDays, from + roll);
  player.position = to;
  events.push({ type: "dice-rolled", playerId: player.id, roll, from, to });

  const tile = state.board[to - 1];
  events.push({ type: "tile-landed", playerId: player.id, tile });

  // Handle tile effect
  if (tile.type === "event") {
    const card = drawFrom(state, "event");
    const summary = applyEventEffect(state, player, card, state.rng);
    discardTo(state, "event", card);
    events.push({ type: "event-drawn", playerId: player.id, card, summary });

    const logParts = [`${player.name} drew “${card.title}”.`];
    if (summary.appliedPerks.length) logParts.push(summary.appliedPerks.join(", "));
    logEvent(state, {
      actor: player.id,
      text: logParts.join(" "),
      kind: player.id,
      delta: summary.balanceDelta || undefined
    });
  } else if (tile.type === "payday") {
    player.balance += tile.paydayAmount;
    events.push({ type: "payday", playerId: player.id, amount: tile.paydayAmount });
    logEvent(state, {
      actor: player.id,
      text: `${player.name} hit a payday tile.`,
      kind: player.id,
      delta: tile.paydayAmount
    });
  } else if (tile.type === "finish") {
    logEvent(state, {
      actor: player.id,
      text: `${player.name} reached Day 31!`,
      kind: "sys"
    });
  } else {
    logEvent(state, {
      actor: player.id,
      text: `${player.name} rolled ${roll} and landed on Day ${to}.`,
      kind: player.id
    });
  }

  events.push(...endPlayerTurn(state));
  return events;
}

// Attempt to draw a perk. Returns an event with the perk card offered.
// The caller should then call `buyPerk(state)` or `declinePerk(state)`.
export function drawPerk(state) {
  const events = [];
  const player = activePlayer(state);
  if (!canDrawPerk(state)) return events;

  player.perkDrawAttempts += 1;
  player.hasDrawnPerkThisTurn = true;
  const card = drawFrom(state, "perk");
  const affordable = player.balance >= card.cost;
  state.phase = "perk-offer";
  state.pendingPerkOffer = { card, playerId: player.id };
  events.push({ type: "perk-offered", playerId: player.id, card, affordable });
  return events;
}

// Actually buy (or decline) the offered perk. Returns more events.
export function resolvePerkOffer(state, decision /* "buy" | "pass" */) {
  const events = [];
  const offer = state.pendingPerkOffer;
  if (!offer) return events;
  const player = state.players.find((p) => p.id === offer.playerId);
  const card = offer.card;

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

    events.push({ type: "perk-bought", playerId: player.id, card });
    logEvent(state, {
      actor: player.id,
      text: `${player.name} bought “${card.title}”${card.oneTimeBonus ? ` (+$${card.oneTimeBonus})` : ""}.`,
      kind: player.id,
      delta: (card.oneTimeBonus || 0) - card.cost
    });
  } else {
    discardTo(state, "perk", card);
    events.push({ type: "perk-skipped", playerId: player.id, reason: decision });
    logEvent(state, {
      actor: player.id,
      text: `${player.name} passed on “${card.title}”.`,
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
