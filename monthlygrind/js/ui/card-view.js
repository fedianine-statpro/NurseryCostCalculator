import { getCategory } from "../data/categories.js";
import { isAutoAdvance } from "./settings.js";

const cardStageEl = () => document.getElementById("card-stage");
const iconCache = new Map();

async function fetchIcon(slug) {
  if (iconCache.has(slug)) return iconCache.get(slug);
  const p = fetch(`./assets/icons/${slug}.svg`)
    .then((r) => (r.ok ? r.text() : ""))
    .catch(() => "");
  iconCache.set(slug, p);
  return p;
}

// Show a card centered on screen.
//   kind:          "event" | "work" | "perk"
//   owner:         { id: "you"|"ai", name: string } — colored badge in header
//   manualDismiss: if true, only a click/keypress dismisses (human-triggered)
//                  if false, auto-dismisses after `duration` ms (AI turns)
//   duration:      auto-dismiss delay (ignored when manualDismiss is true)
export async function presentCard({ kind, card, summary, duration = 1800, manualDismiss = false, owner = null }) {
  const stage = cardStageEl();
  stage.innerHTML = "";
  stage.classList.add("is-visible");

  // Auto-advance setting overrides the manual-dismiss request for user cards.
  // Pick a shorter duration so the player can keep clicking through.
  if (manualDismiss && isAutoAdvance()) {
    manualDismiss = false;
    duration = 1800;
  }

  const categoryKey = card.category || "luck";
  const cat = getCategory(categoryKey);
  const iconMarkup = await fetchIcon(cat.icon);

  const el = document.createElement("article");
  el.className = `card card--${kind}`;
  if (owner?.id) el.dataset.owner = owner.id;
  el.dataset.category = categoryKey;

  const kindLabel = { event: "Event card", work: "Work card", perk: "Perk card" }[kind] || "Card";

  const effectChips = buildEffectChips(kind, card, summary);
  const flavor = kind === "work" ? (card.flavor || "") : (card.desc || card.flavor || "");
  const priceTag = kind === "perk" ? `<div class="card__price">$${card.cost}</div>` : "";
  let workAmount = "";
  if (kind === "work") {
    if (card.income > 0) workAmount = `<div class="card__price card__price--gain">+$${card.income}</div>`;
    else if (card.income < 0) workAmount = `<div class="card__price card__price--loss">−$${Math.abs(card.income)}</div>`;
    else workAmount = `<div class="card__price card__price--zero">$0</div>`;
  }

  const ownerBadge = owner
    ? `<div class="card__owner" data-owner="${owner.id}">
         <span class="card__owner-dot" aria-hidden="true"></span>
         <span class="card__owner-name">${escapeHtml(owner.name)}</span>
       </div>`
    : "";

  el.innerHTML = `
    <header class="card__header">
      ${ownerBadge}
      <div class="card__kind">${kindLabel} · ${cat.label}</div>
      <div class="card__icon-wrap">
        ${iconMarkup}
        <span class="card__icon-emoji">${cat.emoji}</span>
      </div>
      <h2 class="card__title">${escapeHtml(card.title)}</h2>
    </header>
    <div class="card__body">
      <p class="card__flavor">${escapeHtml(flavor)}</p>
      <div class="card__effects">
        ${effectChips}
        ${priceTag}
        ${workAmount}
      </div>
      <button type="button" class="card__continue">Continue</button>
    </div>
  `;

  stage.appendChild(el);

  return new Promise((resolve) => {
    let done = false;
    const dismiss = () => {
      if (done) return;
      done = true;
      stage.removeEventListener("click", dismiss);
      window.removeEventListener("keydown", onKey);
      stage.classList.remove("is-visible");
      resolve();
    };
    const onKey = (e) => {
      if (["Enter", " ", "Escape"].includes(e.key)) {
        e.preventDefault();
        dismiss();
      }
    };
    stage.addEventListener("click", dismiss);
    window.addEventListener("keydown", onKey);

    // AI turns: still auto-dismiss so the game flows.
    if (!manualDismiss) {
      setTimeout(dismiss, duration);
    }
  });
}

function buildEffectChips(kind, card, summary) {
  const chips = [];
  if (kind === "event") {
    const e = card.effect || {};
    const fromSummary = summary || {};
    const delta = fromSummary.balanceDelta ?? e.immediate;
    if (delta) {
      chips.push(
        delta > 0
          ? `<span class="card__effect card__effect--gain">+$${delta}</span>`
          : `<span class="card__effect card__effect--loss">−$${Math.abs(delta)}</span>`
      );
    }
    if (e.recurring) {
      chips.push(
        e.recurring > 0
          ? `<span class="card__effect card__effect--gain">+$${e.recurring}/turn</span>`
          : `<span class="card__effect card__effect--loss">−$${Math.abs(e.recurring)}/turn</span>`
      );
    }
    if (e.multiplier && e.multiplier !== 1) {
      chips.push(`<span class="card__effect card__effect--multi">×${e.multiplier}</span>`);
    }
    if (e.halveBalance) chips.push(`<span class="card__effect card__effect--loss">Half savings</span>`);
    if (e.clearBalance || e.loseAllBalance) chips.push(`<span class="card__effect card__effect--loss">Savings cleared</span>`);
    if (e.skipTurns) chips.push(`<span class="card__effect card__effect--skip">Skip ${e.skipTurns} turn${e.skipTurns > 1 ? "s" : ""}</span>`);
    if (e.grantExtraTurn) chips.push(`<span class="card__effect card__effect--multi">Extra turn</span>`);
  } else if (kind === "work") {
    if (card.deferredBonus) chips.push(`<span class="card__effect card__effect--gain">+$${card.deferredBonus} next turn</span>`);
  } else if (kind === "perk") {
    if (card.oneTimeBonus) chips.push(`<span class="card__effect card__effect--gain">+$${card.oneTimeBonus} now</span>`);
    if (card.passivePerTurn) chips.push(`<span class="card__effect card__effect--gain">+$${card.passivePerTurn}/turn</span>`);
    if (card.randomPerTurn) {
      const { min, max } = card.randomPerTurn;
      chips.push(`<span class="card__effect card__effect--multi">${min < 0 ? "±" : "+"}$${Math.abs(min)}–${max}/turn</span>`);
    }
    if (card.workIncomeBonus) chips.push(`<span class="card__effect card__effect--gain">+${Math.round(card.workIncomeBonus * 100)}% work income</span>`);
    if (card.categoryDiscounts) {
      for (const [k, v] of Object.entries(card.categoryDiscounts)) {
        chips.push(`<span class="card__effect card__effect--multi">−${Math.round(v * 100)}% ${k}</span>`);
      }
    }
    if (card.skipOnBuy) chips.push(`<span class="card__effect card__effect--skip">Skip ${card.skipOnBuy} turn</span>`);
  }
  return chips.join("");
}

// Render a small preview for the perk offer modal
export async function renderPerkPreview(card, mountEl) {
  const cat = getCategory(card.category);
  mountEl.innerHTML = `
    <div class="perk-preview">
      <div class="perk-preview__icon" aria-hidden="true">${cat.emoji}</div>
      <div>
        <div class="perk-preview__title">${escapeHtml(card.title)}</div>
        <div class="perk-preview__desc">${escapeHtml(card.desc)}</div>
      </div>
      <div class="perk-preview__cost">$${card.cost}</div>
    </div>
  `;
}

function escapeHtml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
