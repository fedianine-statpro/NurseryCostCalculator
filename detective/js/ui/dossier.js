// Renders the suspect dossier grid and trait list.

import { SUSPECTS } from "../data/suspects.js";
import { suspectMatchesTraits } from "../engine/warrant.js";
import { TRAIT_CATEGORIES } from "../data/suspects.js";

let selectedSuspectId = null;

export function renderDossier(state, hostGrid, traitsListEl, traitsHintEl, onSelect) {
  // traits list
  traitsListEl.innerHTML = "";
  const learned = state.traitsLearned;
  const keys = Object.keys(learned);
  if (keys.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No traits collected yet. Investigate witnesses to learn what they look like.";
    li.style.opacity = "0.6";
    traitsListEl.appendChild(li);
  } else {
    for (const k of keys) {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${TRAIT_CATEGORIES[k]}:</strong> ${learned[k]}`;
      traitsListEl.appendChild(li);
    }
  }
  const need = Math.max(0, 3 - keys.length);
  traitsHintEl.textContent = need > 0
    ? `Need ${need} more trait${need === 1 ? "" : "s"} before you can issue a warrant.`
    : "Pick a suspect and issue a warrant.";

  // suspect grid
  hostGrid.innerHTML = "";
  for (const s of SUSPECTS) {
    const matches = suspectMatchesTraits(s.id, learned);
    const card = document.createElement("div");
    card.className = "suspect-card";
    if (!matches) card.classList.add("eliminated");
    if (s.id === selectedSuspectId) card.classList.add("selected");

    let traitsHtml = "";
    for (const [k, v] of Object.entries(s.traits)) {
      const known = learned[k];
      let cls = "";
      if (known) cls = known === v ? "trait-match" : "trait-conflict";
      traitsHtml += `<div class="${cls}"><em>${TRAIT_CATEGORIES[k]}:</em> ${v}</div>`;
    }

    card.innerHTML = `
      <div class="suspect-avatar">${s.avatar}</div>
      <div class="suspect-name">${s.name}</div>
      <div class="suspect-traits">${traitsHtml}</div>
    `;
    card.addEventListener("click", () => {
      if (!matches) return;
      selectedSuspectId = s.id;
      onSelect(s.id);
      renderDossier(state, hostGrid, traitsListEl, traitsHintEl, onSelect);
    });
    hostGrid.appendChild(card);
  }
}

export function getSelectedSuspect() { return selectedSuspectId; }
export function clearSelection() { selectedSuspectId = null; }
