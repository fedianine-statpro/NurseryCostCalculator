import { makeInitialState, activePlayer } from "./engine/state.js";
import {
  beginPlayerTurn,
  doWork,
  doMove,
  drawPerk,
  resolvePerkOffer,
  canMove,
  canDrawPerk
} from "./engine/rules.js";
import {
  aiDecideAction,
  aiDecideDrawPerk,
  aiDecidePerkPurchase,
  aiThinkingDelay
} from "./engine/ai.js";
import { initBoard, placeAllPawns, placePawn, hopPawn, highlightTile, showDice, relayoutOnResize } from "./ui/board-view.js";
import { presentCard } from "./ui/card-view.js";
import { renderHud, updateControls } from "./ui/hud-view.js";
import { renderLog } from "./ui/diary-view.js";
import { openModal, closeModal, wireDismissable, showPerkOffer, showEndGame } from "./ui/modal-view.js";
import { sfxDice, sfxCoin, sfxCardFlip, sfxWin, sfxLose, toggleSound, isSoundOn } from "./ui/sound.js";

let state;
let running = false; // input lock while a turn is animating

async function startGame() {
  state = makeInitialState();
  initBoard(state);
  relayoutOnResize(state);
  wireDismissable();
  renderHud(state);
  renderLog(state);
  updateSoundIcon();
  running = false;
  // kick off the first turn
  await runTurn();
}

// Play through the active player's turn, start to end.
async function runTurn() {
  if (running) return;
  running = true;
  try {
    // Begin-of-turn housekeeping (recurring effects, overdraft fee, possible skip)
    const events = beginPlayerTurn(state);
    await replayEvents(events);
    renderHud(state);
    renderLog(state);

    // If the turn ended during housekeeping (e.g., skip), continue to next turn
    if (state.phase === "game-over") {
      handleGameOver();
      return;
    }
    if (activePlayer(state).id !== state.activePlayerId) {
      // this shouldn't happen, just in case
    }

    const p = activePlayer(state);
    if (!p.isHuman) {
      await aiTakeTurn();
      running = false;
      if (state.phase !== "game-over") await runTurn();
    } else {
      // Waiting for human input now. Controls are active.
      running = false;
    }
  } catch (err) {
    console.error(err);
    running = false;
  }
}

async function aiTakeTurn() {
  await aiThinkingDelay();

  // Optionally draw a perk first
  if (aiDecideDrawPerk(state)) {
    const offerEvents = drawPerk(state);
    await replayEvents(offerEvents);
    const offer = state.pendingPerkOffer;
    if (offer) {
      const decision = aiDecidePerkPurchase(state, offer.card) ? "buy" : "pass";
      const resolve = resolvePerkOffer(state, decision);
      await replayEvents(resolve);
      renderHud(state);
      renderLog(state);
      await aiThinkingDelay(200, 400);
    }
  }

  // Choose main action
  const choice = aiDecideAction(state);
  const events = choice === "work" ? doWork(state) : doMove(state);
  await replayEvents(events);
  renderHud(state);
  renderLog(state);

  if (state.phase === "game-over") handleGameOver();
}

async function humanWork() {
  if (running || state.phase !== "awaiting-action") return;
  const p = activePlayer(state);
  if (!p.isHuman) return;
  running = true;
  const events = doWork(state);
  await replayEvents(events);
  renderHud(state);
  renderLog(state);
  running = false;
  if (state.phase === "game-over") handleGameOver();
  else await runTurn();
}

async function humanMove() {
  if (running || state.phase !== "awaiting-action") return;
  if (!canMove(state)) return;
  running = true;
  const events = doMove(state);
  await replayEvents(events);
  renderHud(state);
  renderLog(state);
  running = false;
  if (state.phase === "game-over") handleGameOver();
  else await runTurn();
}

async function humanPerk() {
  if (running) return;
  if (!canDrawPerk(state)) return;
  running = true;
  const events = drawPerk(state);
  await replayEvents(events);
  // Offer modal
  const offer = state.pendingPerkOffer;
  if (offer) {
    const canAfford = activePlayer(state).balance >= offer.card.cost;
    const decision = await showPerkOffer(offer.card, { canAfford });
    const resolveEvents = resolvePerkOffer(state, decision);
    await replayEvents(resolveEvents);
  }
  renderHud(state);
  renderLog(state);
  running = false;
  // Human didn't take a Work/Move yet — wait for that input
}

function handleGameOver() {
  const summary = state.players.map((p) => ({
    id: p.id,
    name: p.name,
    balance: p.balance,
    position: p.position,
    qualified: p.position >= state.totalDays && p.balance >= 1000
  }));
  const you = summary.find((s) => s.id === "you");
  const ai  = summary.find((s) => s.id === "ai");
  const qualified = summary.filter((s) => s.qualified);
  let winnerId = null;
  if (qualified.length) {
    winnerId = qualified.reduce((a, b) => (a.balance >= b.balance ? a : b)).id;
  }
  if (winnerId === "you") sfxWin();
  else sfxLose();
  showEndGame({ winnerId, summary });
  updateControls(state);
}

// Replay a list of engine events, animating each appropriately.
async function replayEvents(events) {
  for (const ev of events) {
    switch (ev.type) {
      case "turn-start": {
        renderHud(state);
        break;
      }
      case "skip-turn": {
        await delay(350);
        break;
      }
      case "recurring":
      case "perk-passive": {
        if (ev.total > 0) sfxCoin(true);
        else if (ev.total < 0) sfxCoin(false);
        renderHud(state);
        await delay(400);
        break;
      }
      case "overdraft-fee": {
        sfxCoin(false);
        renderHud(state);
        await delay(500);
        break;
      }
      case "work-drawn": {
        sfxCardFlip();
        await presentCard({ kind: "work", card: ev.card, duration: 1500 });
        if (ev.earned > 0) sfxCoin(true);
        renderHud(state);
        break;
      }
      case "dice-rolled": {
        sfxDice();
        await showDice(ev.roll);
        // animate pawn along the path
        const player = state.players.find((p) => p.id === ev.playerId);
        for (let d = ev.from + 1; d <= ev.to; d++) {
          player.position = d;
          placePawn(state, ev.playerId);
          hopPawn(ev.playerId);
          await delay(180);
        }
        break;
      }
      case "tile-landed": {
        highlightTile(ev.tile.day, ev.playerId === "you" ? "var(--you-color)" : "var(--ai-color)");
        await delay(150);
        break;
      }
      case "event-drawn": {
        sfxCardFlip();
        await presentCard({ kind: "event", card: ev.card, summary: ev.summary, duration: 2100 });
        if (ev.summary.balanceDelta > 0) sfxCoin(true);
        else if (ev.summary.balanceDelta < 0) sfxCoin(false);
        renderHud(state);
        break;
      }
      case "payday": {
        sfxCoin(true);
        renderHud(state);
        await delay(300);
        break;
      }
      case "perk-offered": {
        // Human: main.js shows the modal separately
        // AI: we just render, main.js decides without modal
        renderHud(state);
        break;
      }
      case "perk-bought": {
        sfxCoin(true);
        await presentCard({ kind: "perk", card: ev.card, duration: 1500 });
        renderHud(state);
        break;
      }
      case "perk-skipped": {
        renderHud(state);
        await delay(200);
        break;
      }
      case "turn-end": {
        placeAllPawns(state);
        renderHud(state);
        await delay(150);
        break;
      }
      case "game-over": {
        // handled by handleGameOver elsewhere
        break;
      }
    }
  }
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function updateSoundIcon() {
  document.getElementById("sound-icon").textContent = isSoundOn() ? "🔊" : "🔇";
}

function wireControls() {
  document.getElementById("btn-work").addEventListener("click", humanWork);
  document.getElementById("btn-move").addEventListener("click", humanMove);
  document.getElementById("btn-perk").addEventListener("click", humanPerk);

  document.getElementById("new-game-btn").addEventListener("click", () => {
    closeModal("end-modal");
    closeModal("rules-modal");
    closeModal("perk-modal");
    startGame();
  });

  document.getElementById("end-again").addEventListener("click", () => {
    closeModal("end-modal");
    startGame();
  });

  document.getElementById("rules-btn").addEventListener("click", () => openModal("rules-modal"));
  document.getElementById("sound-toggle").addEventListener("click", () => {
    toggleSound();
    updateSoundIcon();
  });

  window.addEventListener("keydown", (e) => {
    if (e.target.matches("input, textarea, select")) return;
    if (state?.phase !== "awaiting-action" || running) return;
    const p = activePlayer(state);
    if (!p?.isHuman) return;
    const k = e.key.toLowerCase();
    if (k === "w") humanWork();
    else if (k === "m" || k === " ") { e.preventDefault(); humanMove(); }
    else if (k === "p") humanPerk();
  });
}

wireControls();
startGame();
