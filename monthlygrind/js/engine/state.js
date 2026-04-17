import { WORK_CARDS } from "../data/work-cards.js";
import { EVENT_CARDS } from "../data/event-cards.js";
import { PERK_CARDS } from "../data/perk-cards.js";
import { BOARD_LAYOUT, TOTAL_DAYS } from "../data/board-layout.js";
import { makeRng, shuffle, pickSeed } from "./rng.js";

export const STARTING_BALANCE = 1000;
export const MAX_PERKS_HELD = 2;
export const MAX_PERK_DRAW_ATTEMPTS = 2;
export const BANK_FEE_RATE = 0.1;
// Flat living expenses paid at the start of each of the player's turns
// (rent, groceries, utilities). Creates the base pressure that makes budgeting matter.
export const COST_OF_LIVING = 115;
// Perks are *earned*: the player must have chosen Work this many times before
// their first and second perk draws unlock. Rewards work-heavy strategies.
export const PERK_WORK_GATES = [5, 10];

export function makeInitialState({ seed = pickSeed() } = {}) {
  const rng = makeRng(seed);
  const state = {
    seed,
    rng,
    turn: 1,
    activePlayerId: "you",
    phase: "awaiting-action", // awaiting-action | resolving | game-over
    winnerId: null,
    log: [],
    players: [
      makePlayer("you",  "You",     true),
      makePlayer("ai",   "Rival",   false)
    ],
    decks: {
      work:  shuffle(WORK_CARDS, rng),
      event: shuffle(EVENT_CARDS, rng),
      perk:  shuffle(PERK_CARDS, rng)
    },
    discards: { work: [], event: [], perk: [] },
    board: BOARD_LAYOUT,
    totalDays: TOTAL_DAYS
  };
  return state;
}

function makePlayer(id, name, isHuman) {
  return {
    id,
    name,
    isHuman,
    position: 1,
    balance: STARTING_BALANCE,
    perks: [],                  // [PerkCard]
    perkDrawAttempts: 0,
    skipTurnsRemaining: 0,
    grantExtraTurn: false,
    recurringEffects: [],       // [{ amount, turnsLeft, source } | { phases, phaseIndex, ... }]
    deferredWorkBonus: 0,       // Designer card payout on the next work turn
    hasDrawnPerkThisTurn: false,
    consecutiveWorkTurns: 0,    // Work-in-a-row streak counter
    wentBelowZero: false,       // achievement tracker
    eventCardsDrawn: 0,
    workCardsDrawn: 0,
    biggestHitAbsorbed: 0
  };
}

export function activePlayer(state) {
  return state.players.find((p) => p.id === state.activePlayerId);
}
export function otherPlayer(state) {
  return state.players.find((p) => p.id !== state.activePlayerId);
}

// Draw from a deck, reshuffling discards in when the deck is empty.
export function drawFrom(state, deckKey) {
  if (state.decks[deckKey].length === 0) {
    state.decks[deckKey] = shuffle(state.discards[deckKey], state.rng);
    state.discards[deckKey] = [];
  }
  return state.decks[deckKey].pop();
}

export function discardTo(state, deckKey, card) {
  if (card) state.discards[deckKey].push(card);
}

// Append a log entry. Newest log entries go to the end; the UI reverses them.
export function logEvent(state, entry) {
  state.log.push({
    turn: state.turn,
    ...entry
  });
}
