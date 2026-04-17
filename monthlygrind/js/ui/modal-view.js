import { renderPerkPreview } from "./card-view.js";
import { evaluateAchievements } from "../engine/achievements.js";

export function openModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add("is-open");
  el.setAttribute("aria-hidden", "false");
}
export function closeModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove("is-open");
  el.setAttribute("aria-hidden", "true");
}

export function wireDismissable() {
  document.querySelectorAll(".modal [data-close], .modal__backdrop").forEach((el) => {
    el.addEventListener("click", (e) => {
      if (!e.currentTarget.hasAttribute("data-close") && !e.currentTarget.classList.contains("modal__backdrop")) return;
      const modal = e.currentTarget.closest(".modal");
      if (modal) {
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
      }
    });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal.is-open").forEach((m) => {
        // Don't escape end-game or perk-offer modals — they require a decision
        if (m.id === "end-modal" || m.id === "perk-modal") return;
        m.classList.remove("is-open");
        m.setAttribute("aria-hidden", "true");
      });
    }
  });
}

// Present 3 (or fewer) perks. User picks one AND decides buy/pass, or passes
// on all three. Returns { decision: "buy"|"pass", chosenIndex }.
export async function showPerkOffer(cards, { balance }) {
  const mount = document.getElementById("perk-offer-card");
  mount.innerHTML = `
    <p class="perk-offer__intro">Pick one — you can only do this twice a game.</p>
    <div class="perk-offer__grid">
      ${cards.map((c, i) => `
        <label class="perk-choice ${balance < c.cost ? "is-unaffordable" : ""}" data-index="${i}">
          <input type="radio" name="perk-choice" value="${i}" ${i === 0 ? "checked" : ""} />
          <div class="perk-choice__card"></div>
        </label>
      `).join("")}
    </div>
  `;
  // Populate each card preview
  const nodes = mount.querySelectorAll(".perk-choice__card");
  for (let i = 0; i < cards.length; i++) {
    await renderPerkPreview(cards[i], nodes[i]);
  }

  const buyBtn = document.getElementById("perk-buy");
  const passBtn = document.getElementById("perk-decline");

  function currentIndex() {
    const el = mount.querySelector("input[name='perk-choice']:checked");
    return el ? parseInt(el.value, 10) : 0;
  }
  function updateBuyButton() {
    const i = currentIndex();
    const card = cards[i];
    const afford = balance >= card.cost;
    buyBtn.disabled = !afford;
    buyBtn.textContent = afford ? `Buy for $${card.cost}` : `Can't afford ($${card.cost})`;
  }
  updateBuyButton();

  mount.querySelectorAll("input[name='perk-choice']").forEach((r) => {
    r.addEventListener("change", updateBuyButton);
  });

  openModal("perk-modal");
  return new Promise((resolve) => {
    const onBuy = () => {
      const idx = currentIndex();
      cleanup();
      resolve({ decision: "buy", chosenIndex: idx });
    };
    const onPass = () => {
      cleanup();
      resolve({ decision: "pass", chosenIndex: 0 });
    };
    const cleanup = () => {
      buyBtn.removeEventListener("click", onBuy);
      passBtn.removeEventListener("click", onPass);
      closeModal("perk-modal");
    };
    buyBtn.addEventListener("click", onBuy);
    passBtn.addEventListener("click", onPass);
  });
}

// Present the weekend mini-choice. Returns the selected option index.
export function showWeekendChoice(options) {
  const header = document.getElementById("event-choice-header");
  const opts = document.getElementById("event-choice-options");
  header.innerHTML = `
    <div class="event-choice__kind">Weekend</div>
    <h2 class="modal__title">How will you spend it?</h2>
    <p class="event-choice__desc">You landed on a weekend day — time to breathe (or hustle).</p>
  `;
  opts.innerHTML = options.map((o, i) => `
    <button type="button" class="event-choice__option" data-index="${i}">
      <span class="event-choice__label">${escapeHtml(o.label)}</span>
      <span class="event-choice__hint">${escapeHtml(o.hint || "")}</span>
    </button>
  `).join("");

  openModal("event-choice-modal");
  return new Promise((resolve) => {
    const onClick = (e) => {
      const btn = e.target.closest(".event-choice__option");
      if (!btn) return;
      const idx = parseInt(btn.dataset.index, 10) || 0;
      opts.removeEventListener("click", onClick);
      closeModal("event-choice-modal");
      resolve(idx);
    };
    opts.addEventListener("click", onClick);
  });
}

// Present an A/B event-choice modal. Returns the selected option index.
export function showEventChoice(card) {
  const header = document.getElementById("event-choice-header");
  const opts = document.getElementById("event-choice-options");
  header.innerHTML = `
    <div class="event-choice__kind">Life choice · ${escapeHtml(card.category || "")}</div>
    <h2 class="modal__title">${escapeHtml(card.title)}</h2>
    <p class="event-choice__desc">${escapeHtml(card.desc || "")}</p>
  `;
  opts.innerHTML = card.choice.options.map((o, i) => `
    <button type="button" class="event-choice__option" data-index="${i}">
      <span class="event-choice__label">${escapeHtml(o.label)}</span>
      <span class="event-choice__hint">${summarizeEffect(o.effect)}</span>
    </button>
  `).join("");

  openModal("event-choice-modal");
  return new Promise((resolve) => {
    const onClick = (e) => {
      const btn = e.target.closest(".event-choice__option");
      if (!btn) return;
      const idx = parseInt(btn.dataset.index, 10) || 0;
      opts.removeEventListener("click", onClick);
      closeModal("event-choice-modal");
      resolve(idx);
    };
    opts.addEventListener("click", onClick);
  });
}

function summarizeEffect(e = {}) {
  const parts = [];
  if (e.immediate > 0) parts.push(`+$${e.immediate} now`);
  else if (e.immediate < 0) parts.push(`−$${Math.abs(e.immediate)} now`);
  if (e.recurring > 0) parts.push(`+$${e.recurring}/turn`);
  else if (e.recurring < 0) parts.push(`−$${Math.abs(e.recurring)}/turn`);
  if (Array.isArray(e.recurringPhases)) parts.push("multi-phase payoff");
  if (e.skipTurns) parts.push(`skip ${e.skipTurns}`);
  if (e.grantExtraTurn) parts.push(`extra turn`);
  if (!parts.length) parts.push("no change");
  return parts.join(" · ");
}

function escapeHtml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function showEndGame({ winnerId, summary, players }) {
  const title = document.getElementById("end-title");
  const subtitle = document.getElementById("end-subtitle");
  const finalEl = document.getElementById("end-final");
  const badgesEl = document.getElementById("end-badges");

  const you = summary.find((s) => s.id === "you");
  const ai  = summary.find((s) => s.id === "ai");

  const winnerName = winnerId === "you" ? "You win the month!" : winnerId === "ai" ? "Rival wins the month." : "You ran out of month.";
  title.textContent = winnerName;

  if (winnerId === "you") {
    subtitle.textContent = "You closed out the month in the black. Nicely done.";
  } else if (winnerId === "ai") {
    subtitle.textContent = "Rival finished ahead of you this time.";
  } else {
    subtitle.textContent = "Neither of you held a qualifying balance at the finish line.";
  }

  finalEl.innerHTML = `
    ${playerFinalMarkup(you, winnerId === "you")}
    ${playerFinalMarkup(ai,  winnerId === "ai")}
  `;

  // Compute player's ("you") earned badges
  if (badgesEl && players) {
    const youPlayer = players.find((p) => p.id === "you");
    if (youPlayer) {
      const isWinner = winnerId === "you";
      const earned = evaluateAchievements(youPlayer, { isWinner });
      if (earned.length) {
        badgesEl.innerHTML = `
          <h3 class="end__badges-title">Badges earned</h3>
          <ul class="end__badges-list">
            ${earned.map((b) => `
              <li class="end__badge">
                <span class="end__badge-icon" aria-hidden="true">${b.icon}</span>
                <span class="end__badge-body">
                  <span class="end__badge-title">${b.title}</span>
                  <span class="end__badge-desc">${b.desc}</span>
                </span>
              </li>
            `).join("")}
          </ul>
        `;
      } else {
        badgesEl.innerHTML = "";
      }
    }
  }

  openModal("end-modal");
  if (winnerId === "you") launchConfetti();
}

function playerFinalMarkup(p, isWinner) {
  const note = p.qualified ? "Reached Day 31 in the black" : p.position >= 31 ? "Finished under $1,000" : `Stopped at Day ${p.position}`;
  const amount = p.balance < 0 ? `−$${Math.abs(p.balance).toLocaleString()}` : `$${p.balance.toLocaleString()}`;
  return `
    <div class="end__final-player ${isWinner ? "is-winner" : ""}">
      <div class="end__final-name">${p.name}${isWinner ? " 🏆" : ""}</div>
      <div class="end__final-amount">${amount}</div>
      <div class="end__final-note">${note}</div>
    </div>
  `;
}

function launchConfetti() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const wrap = document.getElementById("end-confetti");
  wrap.innerHTML = "";
  const palette = ["#f3d774", "#e66a4a", "#4f79e0", "#1f8a58", "#caa7f0", "#f1a0d9"];
  for (let i = 0; i < 80; i++) {
    const p = document.createElement("span");
    p.className = "confetti-piece";
    p.style.setProperty("--c", palette[i % palette.length]);
    p.style.setProperty("--r", `${Math.random() * 360}deg`);
    p.style.setProperty("--tx", `${(Math.random() - 0.5) * 400}px`);
    p.style.setProperty("--d", `${1200 + Math.random() * 1600}ms`);
    p.style.setProperty("--delay", `${Math.random() * 300}ms`);
    p.style.left = `${Math.random() * 100}%`;
    wrap.appendChild(p);
  }
}
