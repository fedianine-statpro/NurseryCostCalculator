import { renderPerkPreview } from "./card-view.js";

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

export async function showPerkOffer(card, { canAfford }) {
  const mount = document.getElementById("perk-offer-card");
  await renderPerkPreview(card, mount);
  const buy = document.getElementById("perk-buy");
  buy.disabled = !canAfford;
  buy.textContent = canAfford ? `Buy for $${card.cost}` : `Can't afford ($${card.cost})`;
  openModal("perk-modal");
  return new Promise((resolve) => {
    const onBuy = () => {
      cleanup();
      resolve("buy");
    };
    const onPass = () => {
      cleanup();
      resolve("pass");
    };
    const cleanup = () => {
      buy.removeEventListener("click", onBuy);
      document.getElementById("perk-decline").removeEventListener("click", onPass);
      closeModal("perk-modal");
    };
    buy.addEventListener("click", onBuy);
    document.getElementById("perk-decline").addEventListener("click", onPass);
  });
}

export function showEndGame({ winnerId, summary }) {
  const title = document.getElementById("end-title");
  const subtitle = document.getElementById("end-subtitle");
  const finalEl = document.getElementById("end-final");

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
