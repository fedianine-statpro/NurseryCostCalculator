import { getCategory } from "../data/categories.js";
import { canMove, canDrawPerk, worksNeededForNextPerk, canRetrain, getRetrainCost, getRetrainableJobs } from "../engine/rules.js";

const $ = (id) => document.getElementById(id);

let lastBalances = {};

export function renderHud(state) {
  $("turn-counter").textContent = state.turn;

  for (const player of state.players) {
    const balEl = $(`balance-${player.id}`);
    const prev = lastBalances[player.id] ?? player.balance;
    animateBalance(balEl, prev, player.balance);
    lastBalances[player.id] = player.balance;

    $(`position-${player.id}`).textContent = `Day ${player.position}`;
    const drawsLeft = Math.max(0, 2 - player.perkDrawAttempts);
    const gateLabel = perksGateLabel(player, drawsLeft);
    $(`perks-remaining-${player.id}`).textContent = gateLabel;

    // Current-job line (only shown once assigned)
    let jobEl = $(`job-${player.id}`);
    if (!jobEl) {
      const metaEl = $(`position-${player.id}`).parentElement;
      jobEl = document.createElement("div");
      jobEl.id = `job-${player.id}`;
      jobEl.className = "score__job";
      metaEl.parentElement.insertBefore(jobEl, metaEl.nextSibling);
    }
    if (player.currentJob) {
      jobEl.innerHTML = `<span class="score__job-icon">👷</span> <strong>${player.currentJob.title}</strong> <span class="score__job-salary">$${player.currentJob.income}/work</span>`;
      jobEl.hidden = false;
    } else {
      jobEl.innerHTML = `<span class="score__job-icon">❔</span> <em>No job yet</em>`;
      jobEl.hidden = false;
    }

    // perks list
    const list = $(`perks-${player.id}`);
    list.innerHTML = "";
    for (const perk of player.perks) {
      const li = document.createElement("li");
      li.className = "perk-chip";
      const cat = getCategory(perk.category);
      li.style.setProperty("--chip-color", cat.color);
      li.title = perk.desc;
      li.innerHTML = `<span class="perk-chip__dot"></span><span class="perk-chip__label">${perk.title}</span>`;
      list.appendChild(li);
    }

    // active turn highlight
    const card = document.getElementById(`score-${player.id}`);
    card.classList.toggle("is-active", player.id === state.activePlayerId);
  }

  // mood gradient (shifts with turn count)
  const moodHue = Math.min(180, state.turn * 6) + "deg";
  document.documentElement.style.setProperty("--mood-hue", moodHue);
  document.querySelector(".mood-backdrop")?.style.setProperty("--mood-hue", moodHue);

  updateControls(state);
}

export function updateControls(state) {
  const controls = document.querySelector(".controls");
  const hint = $("controls-hint");
  const activeIsHuman = state.players.find((p) => p.id === state.activePlayerId)?.isHuman;
  const inDebt = state.players.find((p) => p.id === state.activePlayerId)?.balance < 0;

  if (state.phase === "game-over") {
    controls.classList.add("is-waiting");
    hint.textContent = "Month complete.";
    return;
  }

  if (!activeIsHuman) {
    controls.classList.add("is-waiting");
    hint.textContent = "Rival is deciding…";
    return;
  }

  controls.classList.remove("is-waiting");
  if (inDebt) {
    hint.textContent = "You're in the red — you must work this turn.";
  } else {
    hint.textContent = "Your turn — play it safe or live it up?";
  }

  $("btn-work").disabled = state.phase !== "awaiting-action";
  $("btn-move").disabled = state.phase !== "awaiting-action" || !canMove(state);
  $("btn-perk").disabled = !canDrawPerk(state);

  // Dynamic Work-button hint shows the current job + salary when set
  const activePlayer = state.players.find((p) => p.id === state.activePlayerId);
  const workHint = $("btn-work-hint");
  if (workHint) {
    if (activePlayer?.currentJob) {
      workHint.textContent = `${activePlayer.currentJob.title} · $${activePlayer.currentJob.income}`;
    } else {
      workHint.textContent = "+1 day · first paycheck picks your job";
    }
  }

  // Retrain button: enabled only when a viable switch is available
  const retrainBtn = $("btn-retrain");
  const retrainHint = $("btn-retrain-hint");
  if (retrainBtn && retrainHint) {
    if (!activePlayer?.currentJob) {
      retrainBtn.disabled = true;
      retrainHint.textContent = "Work first";
    } else {
      const options = getRetrainableJobs(activePlayer);
      const cost = getRetrainCost(activePlayer);
      if (options.length === 0) {
        retrainBtn.disabled = true;
        retrainHint.textContent = "Top salary reached";
      } else if (activePlayer.balance < cost) {
        retrainBtn.disabled = true;
        retrainHint.textContent = `Need $${cost}`;
      } else if (!canRetrain(state)) {
        retrainBtn.disabled = true;
        retrainHint.textContent = "Not now";
      } else {
        retrainBtn.disabled = false;
        retrainHint.textContent = `−$${cost} for a new role`;
      }
    }
  }

  // Perk button hint: show draws-left when unlocked, else a lock gate.
  const drawsLeft = Math.max(0, 2 - (activePlayer?.perkDrawAttempts || 0));
  const label = $("perk-draws-left");
  if (drawsLeft === 0) {
    label.textContent = "0 left";
  } else {
    const needed = worksNeededForNextPerk(state);
    if (needed > 0 && activePlayer?.isHuman) {
      label.textContent = `🔒 work ${needed}×`;
    } else {
      label.textContent = `${drawsLeft} left`;
    }
  }
}

// Label for the "perks remaining" slot on each player card.
// Shows the work-gate hint when relevant.
function perksGateLabel(player, drawsLeft) {
  if (drawsLeft === 0) return "Perks maxed";
  const GATES = [5, 10];
  const required = GATES[player.perkDrawAttempts] || 0;
  const done = player.workCardsDrawn || 0;
  const needed = Math.max(0, required - done);
  if (needed > 0) return `🔒 ${done}/${required} workdays`;
  return drawsLeft === 1 ? "1 perk unlocked" : `${drawsLeft} perks unlocked`;
}

function animateBalance(el, from, to) {
  if (!el) return;
  if (from === to) {
    el.textContent = formatAmount(to);
    el.classList.remove("is-up", "is-down");
    return;
  }
  const direction = to > from ? "is-up" : "is-down";
  el.classList.remove("is-up", "is-down");
  // re-trigger CSS transition
  void el.offsetWidth;
  el.classList.add(direction);

  const steps = 18;
  const delta = (to - from) / steps;
  let i = 0;
  const start = from;
  const tick = () => {
    i += 1;
    const v = i >= steps ? to : Math.round(start + delta * i);
    el.textContent = formatAmount(v);
    if (i < steps) requestAnimationFrame(tick);
    else setTimeout(() => el.classList.remove("is-up", "is-down"), 600);
  };
  requestAnimationFrame(tick);
}

function formatAmount(n) {
  const s = Math.abs(n).toLocaleString("en-US");
  return n < 0 ? `−${s}` : s;
}
