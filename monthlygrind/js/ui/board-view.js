import { getCategory } from "../data/categories.js";

const TILE_GLYPHS = {
  start:  { glyph: "🚩", label: "START" },
  event:  { glyph: "🎲", label: "EVENT" },
  payday: { glyph: "💵", label: "PAYDAY" },
  rest:   { glyph: "🌿", label: "REST" },
  finish: { glyph: "🏁", label: "FINISH" }
};

let boardEl = null;
let pawns = {};
let tileEls = [];

export function initBoard(state) {
  boardEl = document.getElementById("board");
  boardEl.innerHTML = "";
  tileEls = [];

  state.board.forEach((tile, i) => {
    const el = document.createElement("div");
    el.className = `tile tile--${tile.type}`;
    el.setAttribute("role", "listitem");
    el.setAttribute("data-day", tile.day);
    const { glyph, label } = TILE_GLYPHS[tile.type] || { glyph: "", label: "" };
    el.innerHTML = `
      <div class="tile__day">${tile.day}</div>
      <div class="tile__glyph" aria-hidden="true">${glyph}</div>
      <div class="tile__label">${label}</div>
    `;
    if (tile.type === "payday") {
      el.title = `Payday +$${tile.paydayAmount}`;
    }
    boardEl.appendChild(el);
    tileEls.push(el);
  });

  // pawns for each player, absolutely positioned within the board container
  pawns = {};
  for (const player of state.players) {
    const pawn = document.createElement("div");
    pawn.className = `pawn pawn--${player.id}`;
    pawn.setAttribute("aria-label", `${player.name} token`);
    boardEl.appendChild(pawn);
    pawns[player.id] = pawn;
  }
  // initial placement on next frame (after layout computes)
  requestAnimationFrame(() => placeAllPawns(state));
}

export function placePawn(state, playerId) {
  const player = state.players.find((p) => p.id === playerId);
  const tile = tileEls[player.position - 1];
  if (!tile || !pawns[playerId]) return;
  const boardRect = boardEl.getBoundingClientRect();
  const tileRect  = tile.getBoundingClientRect();

  // Two players on the same tile? Offset horizontally.
  const sharesTile = state.players.some((p) => p.id !== playerId && p.position === player.position);
  const offsetX = sharesTile ? (playerId === "you" ? -10 : 10) : 0;

  const left = tileRect.left - boardRect.left + tileRect.width / 2 + offsetX;
  const top  = tileRect.top  - boardRect.top  + tileRect.height / 2;
  pawns[playerId].style.left = `${left}px`;
  pawns[playerId].style.top  = `${top}px`;
}

export function placeAllPawns(state) {
  state.players.forEach((p) => placePawn(state, p.id));
}

export function hopPawn(playerId) {
  const pawn = pawns[playerId];
  if (!pawn) return;
  pawn.classList.remove("is-hopping");
  void pawn.offsetWidth; // force reflow
  pawn.classList.add("is-hopping");
}

export function highlightTile(day, color) {
  const tile = tileEls[day - 1];
  if (!tile) return;
  tile.style.setProperty("--pawn-color", color || "var(--gold)");
  tile.classList.add("is-highlight");
  setTimeout(() => tile.classList.remove("is-highlight"), 900);
}

export async function showDice(rollValue) {
  const stage = document.getElementById("dice-stage");
  const faces = document.querySelectorAll(".dice__face");
  stage.classList.add("is-visible");

  // flicker through a few random faces
  for (let i = 0; i < 6; i++) {
    faces.forEach((f) => f.classList.remove("is-active"));
    const n = 1 + Math.floor(Math.random() * 6);
    const face = document.querySelector(`.dice__face[data-face="${n}"]`);
    if (face) face.classList.add("is-active");
    await delay(60);
  }
  // settle on the real value
  faces.forEach((f) => f.classList.remove("is-active"));
  const final = document.querySelector(`.dice__face[data-face="${rollValue}"]`);
  if (final) final.classList.add("is-active");
  await delay(520);
  stage.classList.remove("is-visible");
}

export function relayoutOnResize(state) {
  window.addEventListener("resize", () => placeAllPawns(state));
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
