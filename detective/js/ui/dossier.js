// Renders the suspect dossier grid and trait list, plus a live count of how
// many suspects still match the collected evidence.
//
// Two-layer display:
//   • The collected-traits list (left panel) shows the BUCKET-LEVEL description
//     of what the witness said ("a tattoo on a visible spot"), with a source
//     line ("from Bazaar, Istanbul") so the player can trace each trait back.
//   • The suspect cards (right) show the VIVID per-suspect description from
//     L.suspectTraits, so two suspects in the same trait bucket still read as
//     distinct individuals (Kestrel's falcon tattoo vs. Tomo's koi vs.
//     Mariana's flame).

import { SUSPECTS, SUSPECT_TRAITS } from "../data/suspects.js";
import { suspectMatchesTraits, matchingSuspectIds } from "../engine/warrant.js";
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
      const display = L.traitValues[k]?.[valueId] ?? valueId;
      const src = state.traitSources?.[k];
      let sourceText = "";
      if (src) {
        const srcCity = L.cities[src.cityId];
        const srcLoc = srcCity?.locations?.[src.locationId];
        if (srcCity && srcLoc) {
          sourceText = ` <span class="trait-source">— ${L.ui.traitFrom(srcLoc.name, srcCity.name)}</span>`;
        }
      }
      const li = document.createElement("li");
      li.innerHTML = `<strong>${L.traitCategories[k]}:</strong> ${display}${sourceText}`;
      traitsListEl.appendChild(li);
    }
  }

  // Live match counter.
  const matching = matchingSuspectIds(learned);
  const matchEl = document.createElement("p");
  matchEl.className = "match-counter";
  if (learnedKeys.length === 0) {
    matchEl.textContent = L.ui.matchAll(SUSPECTS.length);
  } else if (matching.length === 0) {
    matchEl.textContent = L.ui.matchZero;
    matchEl.classList.add("match-zero");
  } else if (matching.length === 1) {
    matchEl.textContent = L.ui.matchOne;
    matchEl.classList.add("match-one");
  } else {
    matchEl.textContent = L.ui.matchN(matching.length, SUSPECTS.length);
  }
  traitsListEl.appendChild(matchEl);

  const need = Math.max(0, 3 - learnedKeys.length);
  if (matching.length === 1) {
    traitsHintEl.textContent = L.ui.pickSuspect;
  } else {
    traitsHintEl.textContent = need > 0 ? L.ui.needMoreTraits(need) : L.ui.pickSuspect;
  }

  hostGrid.innerHTML = "";
  for (const s of SUSPECTS) {
    const matches = suspectMatchesTraits(s.id, learned);
    const card = document.createElement("div");
    card.className = "suspect-card";
    if (!matches) card.classList.add("eliminated");
    if (s.id === selectedSuspectId) card.classList.add("selected");

    const suspectLoc = L.suspects[s.id];
    const suspectTraits = SUSPECT_TRAITS[s.id];
    const vivid = L.suspectTraits?.[s.id] ?? {};
    let traitsHtml = "";
    for (const [cat, valueId] of Object.entries(suspectTraits)) {
      // Prefer the vivid per-suspect description; fall back to bucket text.
      const display = vivid[cat] ?? L.traitValues[cat][valueId];
      const known = learned[cat];
      let cls = "";
      if (known) cls = (known === valueId) ? "trait-match" : "trait-conflict";
      traitsHtml += `<div class="${cls}"><em>${L.traitCategories[cat]}:</em> ${display}</div>`;
    }
    const sigText = suspectLoc?.signature ?? "";
    const sigHtml = sigText ? `<div class="suspect-mo">${L.ui.moLabel} ${sigText}</div>` : "";

    card.innerHTML = `
      <div class="suspect-avatar">${s.avatar}</div>
      <div class="suspect-name">${suspectLoc.name}</div>
      ${sigHtml}
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
