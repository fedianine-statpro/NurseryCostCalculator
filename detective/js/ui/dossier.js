// Renders the suspect dossier grid and trait list.

import { SUSPECTS, SUSPECT_TRAITS } from "../data/suspects.js";
import { suspectMatchesTraits } from "../engine/warrant.js";
import { getLocale } from "../i18n/i18n.js";

let selectedSuspectId = null;

export function renderDossier(state, hostGrid, traitsListEl, traitsHintEl, onSelect) {
  const L = getLocale();
  const learned = state.traitsLearned;
  const learnedKeys = Object.keys(learned);

  traitsListEl.innerHTML = "";
  if (learnedKeys.length === 0) {
    const li = document.createElement("li");
    li.textContent = L.ui.noTraitsYet;
    li.style.opacity = "0.6";
    traitsListEl.appendChild(li);
  } else {
    for (const k of learnedKeys) {
      const valueId = learned[k];
      const display = L.traitValues[k][valueId];
      const li = document.createElement("li");
      li.innerHTML = `<strong>${L.traitCategories[k]}:</strong> ${display}`;
      traitsListEl.appendChild(li);
    }
  }
  const need = Math.max(0, 3 - learnedKeys.length);
  traitsHintEl.textContent = need > 0 ? L.ui.needMoreTraits(need) : L.ui.pickSuspect;

  hostGrid.innerHTML = "";
  for (const s of SUSPECTS) {
    const matches = suspectMatchesTraits(s.id, learned);
    const card = document.createElement("div");
    card.className = "suspect-card";
    if (!matches) card.classList.add("eliminated");
    if (s.id === selectedSuspectId) card.classList.add("selected");

    const suspectLoc = L.suspects[s.id];
    const suspectTraits = SUSPECT_TRAITS[s.id];
    let traitsHtml = "";
    for (const [cat, valueId] of Object.entries(suspectTraits)) {
      const display = L.traitValues[cat][valueId];
      const known = learned[cat];
      let cls = "";
      if (known) cls = (known === valueId) ? "trait-match" : "trait-conflict";
      traitsHtml += `<div class="${cls}"><em>${L.traitCategories[cat]}:</em> ${display}</div>`;
    }

    card.innerHTML = `
      <div class="suspect-avatar">${s.avatar}</div>
      <div class="suspect-name">${suspectLoc.name}</div>
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
