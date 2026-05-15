// Entry: wires up screens and runs the game state machine.

import { CASES, CASE_BY_ID } from "./data/cases.js";
import { CITIES } from "./data/cities.js";
import { SUSPECT_BY_ID } from "./data/suspects.js";
import {
  createGameState, getCurrentCase, getTrailEntryForCity, getTrailIndexOfCity,
  getFinalCityId, isLocationDone, markLocationDone, spendHours, formatTime
} from "./engine/state.js";
import { travelHours } from "./engine/clock.js";
import {
  generateDestinationClue, generateTraitClue, generateJunkClue, generateDeadEndClue
} from "./engine/clues.js";
import { canIssueWarrant } from "./engine/warrant.js";
import { mountMap, refreshMap } from "./ui/map.js";
import { renderDossier, getSelectedSuspect, clearSelection } from "./ui/dossier.js";
import { typewrite } from "./ui/narrator.js";
import {
  sfxBeep, sfxConfirm, sfxDeny, sfxPlane, sfxStamp, sfxWin, sfxLose
} from "./ui/effects.js";

const $ = (sel) => document.querySelector(sel);

let state = null;
let pendingResult = null; // for city-result continue handling

// ---------- Screen routing ----------
const SCREENS = ["title", "case-select", "briefing", "map", "city", "dossier", "epilogue"];

function showScreen(name) {
  for (const s of SCREENS) {
    document.getElementById("screen-" + s).classList.toggle("active", s === name);
  }
  // hide modals/overlays
  $("#confirm-modal").classList.add("hidden");
}

// ---------- HUD ----------
function updateHud() {
  if (!state) {
    $("#hud-case").textContent = "";
    $("#hud-city").textContent = "";
    $("#hud-clock").textContent = "";
    return;
  }
  const c = getCurrentCase(state);
  const city = CITIES[state.currentCityId];
  $("#hud-case").textContent = `Case ${c.id} · ${c.title}`;
  $("#hud-city").textContent = `📍 ${city.name}, ${city.country}`;
  $("#hud-clock").textContent = `⏱ ${formatTime(state.hoursLeft)}`;
  // warn color near end
  if (state.hoursLeft < 24) $("#hud-clock").style.color = "var(--red)";
  else $("#hud-clock").style.color = "";
}

// ---------- Title ----------
$("#btn-start").addEventListener("click", () => {
  sfxBeep();
  renderCaseList();
  showScreen("case-select");
});

// ---------- Case select ----------
function renderCaseList() {
  const host = $("#case-list");
  host.innerHTML = "";
  for (const c of CASES) {
    const card = document.createElement("div");
    card.className = "case-card";
    card.innerHTML = `
      <div class="case-card-id">${c.id}</div>
      <div class="case-card-title">${c.title}</div>
      <div class="case-card-sub">Stolen: ${c.loot}</div>
    `;
    card.addEventListener("click", () => {
      sfxConfirm();
      startCase(c.id);
    });
    host.appendChild(card);
  }
}

// ---------- Briefing ----------
function startCase(caseId) {
  state = createGameState(caseId);
  clearSelection();
  updateHud();
  const c = getCurrentCase(state);
  $("#briefing-id").textContent = c.id;
  showScreen("briefing");
  typewrite($("#briefing-text"), c.briefing, { speed: 18 });
}

$("#btn-briefing-go").addEventListener("click", () => {
  sfxConfirm();
  enterMap();
});

// ---------- Map ----------
let mapMounted = false;
function enterMap() {
  if (!mapMounted) {
    mountMap($("#map-container"), handleCityClickFromMap);
    mapMounted = true;
  }
  refreshMap(state.currentCityId);
  const city = CITIES[state.currentCityId];
  $("#map-current-city").textContent = `${city.name}, ${city.country}`;
  $("#map-current-flavor").textContent = `A city of ${city.climate}. ${capitalize(city.fact)}.`;
  updateHud();
  showScreen("map");
}

function handleCityClickFromMap(cityId) {
  if (state.status !== "investigating") return;
  if (cityId === state.currentCityId) {
    enterCity();
    return;
  }
  const hours = travelHours(state.currentCityId, cityId);
  const targetCity = CITIES[cityId];
  askConfirm(
    `Fly to ${targetCity.name}, ${targetCity.country}?\n\nFlight time: ${hours} hours.\n\nYou have ${formatTime(state.hoursLeft)}.`,
    () => doTravel(cityId, hours),
    null
  );
}

function doTravel(cityId, hours) {
  sfxPlane();
  spendHours(state, hours);
  state.currentCityId = cityId;
  if (!state.visitedCityIds.includes(cityId)) state.visitedCityIds.push(cityId);

  if (state.status === "lost") {
    finishCase();
    return;
  }

  // If arrived at the final city, check arrest condition
  const finalId = getFinalCityId(state);
  if (cityId === finalId) {
    handleArrival();
  } else {
    enterMap();
  }
}

$("#btn-investigate").addEventListener("click", () => {
  sfxBeep();
  enterCity();
});

$("#btn-open-dossier").addEventListener("click", () => {
  sfxBeep();
  enterDossier();
});

// ---------- City ----------
function enterCity() {
  const city = CITIES[state.currentCityId];
  $("#city-name").textContent = `${city.name}, ${city.country}`;
  $("#city-sub").textContent = `Native tongue: ${city.language}. Local currency: ${city.currency}. Known for ${city.landmark}.`;

  const host = $("#city-locations");
  host.innerHTML = "";
  for (const loc of city.locations) {
    const card = document.createElement("div");
    card.className = "location-card";
    const done = isLocationDone(state, city.id, loc.id);
    if (done) card.classList.add("disabled");
    card.innerHTML = `
      <div class="location-name">${loc.name}</div>
      <div class="location-cost">${loc.cost}h · ${done ? "ALREADY SEARCHED" : "CLICK TO INVESTIGATE"}</div>
      <div class="location-flavor">${loc.flavor}</div>
    `;
    if (!done) {
      card.addEventListener("click", () => investigateLocation(loc));
    }
    host.appendChild(card);
  }
  $("#city-result").classList.add("hidden");
  updateHud();
  showScreen("city");
}

function investigateLocation(loc) {
  sfxBeep();
  const cityId = state.currentCityId;
  markLocationDone(state, cityId, loc.id);
  spendHours(state, loc.cost);

  let text;
  const trailEntry = getTrailEntryForCity(state, cityId);
  const trailIndex = getTrailIndexOfCity(state, cityId);
  const c = getCurrentCase(state);
  const isFinal = (cityId === getFinalCityId(state));

  if (!trailEntry || isFinal) {
    // Off-trail city OR at final city via investigation (already handled separately on arrival)
    text = generateDeadEndClue(cityId, loc.id);
  } else {
    const yields = trailEntry.locations?.[loc.id];
    if (!yields) {
      text = generateDeadEndClue(cityId, loc.id);
    } else if (yields.yields === "destination") {
      const nextCityId = c.trail[trailIndex + 1].cityId;
      text = generateDestinationClue(nextCityId, yields.angle, cityId, loc.id);
    } else if (yields.yields === "trait") {
      const tc = generateTraitClue(c.culpritId, yields.trait, cityId, loc.id);
      state.traitsLearned[tc.traitKey] = tc.value;
      text = tc.text;
    } else {
      text = generateJunkClue(cityId, loc.id);
    }
  }

  state.cluesSeen.push({ cityId, locationId: loc.id, text });

  // Disable the card visually
  $("#city-locations").querySelectorAll(".location-card").forEach((card, i) => {
    const locId = CITIES[cityId].locations[i].id;
    if (isLocationDone(state, cityId, locId)) card.classList.add("disabled");
  });

  // Show result
  $("#city-result").classList.remove("hidden");
  typewrite($("#city-result-text"), text);
  updateHud();

  if (state.status === "lost") {
    setTimeout(() => finishCase(), 1200);
  }
}

$("#btn-result-continue").addEventListener("click", () => {
  sfxBeep();
  $("#city-result").classList.add("hidden");
  // If all locations done, kick back to map
  const city = CITIES[state.currentCityId];
  const allDone = city.locations.every(l => isLocationDone(state, city.id, l.id));
  if (allDone) enterMap();
});

$("#btn-back-map").addEventListener("click", () => { sfxBeep(); enterMap(); });
$("#btn-city-dossier").addEventListener("click", () => { sfxBeep(); enterDossier(); });

// ---------- Dossier ----------
function enterDossier() {
  renderDossier(state, $("#suspect-grid"), $("#traits-list"), $("#traits-hint"), (id) => {
    $("#btn-issue-warrant").disabled = !canIssueWarrant(state) || !id;
  });
  $("#btn-issue-warrant").disabled = !canIssueWarrant(state) || !getSelectedSuspect();
  showScreen("dossier");
}

$("#btn-dossier-back").addEventListener("click", () => { sfxBeep(); enterMap(); });

$("#btn-issue-warrant").addEventListener("click", () => {
  const id = getSelectedSuspect();
  if (!id || !canIssueWarrant(state)) return;
  const c = getCurrentCase(state);
  if (id === c.culpritId) {
    state.warrantSuspectId = id;
    sfxStamp();
    showWarrantStamp(() => {
      // If we already arrived at the final city before getting the warrant, arrest now.
      if (state.currentCityId === getFinalCityId(state)) {
        state.status = "won";
        finishCase();
      } else {
        enterMap();
      }
    });
  } else {
    sfxDeny();
    spendHours(state, 12);
    state.wrongWarrants++;
    clearSelection();
    if (state.status === "lost") { finishCase(); return; }
    askConfirm(
      `The description on the warrant didn't match. The judge tore it up.\n\n— 12 hours penalty.`,
      () => enterDossier(),
      null,
      "OK", null
    );
  }
});

function showWarrantStamp(then) {
  const overlay = $("#stamp-overlay");
  overlay.classList.remove("hidden");
  setTimeout(() => {
    overlay.classList.add("hidden");
    then();
  }, 1400);
}

// ---------- Arrival at final city ----------
function handleArrival() {
  // Player just arrived at the final city.
  const c = getCurrentCase(state);
  const finalCity = CITIES[getFinalCityId(state)];

  if (state.warrantSuspectId === c.culpritId) {
    // ARREST
    state.status = "won";
    sfxWin();
    finishCase();
    return;
  }
  if (state.warrantSuspectId && state.warrantSuspectId !== c.culpritId) {
    // Shouldn't happen — issueWarrant only allows correct culprit. But if it did:
    state.status = "lost";
    state.losReason = "wrong-warrant";
    finishCase();
    return;
  }
  // No warrant yet
  askConfirm(
    `You arrived in ${finalCity.name} on instinct. You see them in the distance — but you have no warrant. Without one, they walk free.\n\nReturn to your dossier and identify them, then come back.`,
    () => enterMap(),
    null,
    "OK", null
  );
}

// ---------- Win / Lose ----------
function finishCase() {
  const c = getCurrentCase(state);
  const culprit = SUSPECT_BY_ID[c.culpritId];
  const isWin = state.status === "won";

  const stampEl = $("#epilogue-stamp");
  stampEl.classList.toggle("hidden", false);
  stampEl.textContent = isWin ? "CASE CLOSED" : "TRAIL LOST";
  stampEl.style.color = isWin ? "var(--red)" : "#777";
  stampEl.style.borderColor = isWin ? "var(--red)" : "#777";

  let title, body, rank;
  if (isWin) {
    title = `You caught ${culprit.name}.`;
    body = `${culprit.name} surrendered in ${CITIES[getFinalCityId(state)].name} with ${c.loot.split(",")[0]} still in their case.\n\nThe chief sends a single word over the wire: "Excellent."`;
    rank = computeRank(state.hoursLeft, state.wrongWarrants);
    sfxWin();
  } else {
    if (state.losReason === "clock") {
      title = "The trail's gone cold.";
      body = `The week ran out. ${culprit.name} is already on a private plane, and ${c.loot.split(",")[0]} is going with them.\n\nThe chief sighs, and pours another coffee.`;
    } else {
      title = "You were chasing the wrong shadow.";
      body = `Your warrant named the wrong person, and the real thief — ${culprit.name} — walked past you and out the door.`;
    }
    rank = "ROOKIE";
    sfxLose();
  }

  $("#epilogue-title").textContent = title;
  $("#rank-value").textContent = rank;
  showScreen("epilogue");
  typewrite($("#epilogue-text"), body);
}

function computeRank(hoursLeft, wrongs) {
  const adjusted = hoursLeft - wrongs * 18;
  if (adjusted >= 96) return "ACE DETECTIVE";
  if (adjusted >= 48) return "INSPECTOR";
  if (adjusted >= 16) return "DETECTIVE";
  return "ROOKIE";
}

$("#btn-epilogue-again").addEventListener("click", () => {
  sfxBeep();
  state = null;
  updateHud();
  renderCaseList();
  showScreen("case-select");
});

// ---------- Confirm modal ----------
function askConfirm(text, onYes, onNo, yesLabel = "YES", noLabel = "NO") {
  $("#confirm-text").textContent = text;
  $("#btn-confirm-yes").textContent = yesLabel;
  if (noLabel === null) {
    $("#btn-confirm-no").style.display = "none";
  } else {
    $("#btn-confirm-no").style.display = "";
    $("#btn-confirm-no").textContent = noLabel;
  }
  $("#confirm-modal").classList.remove("hidden");
  const yes = () => {
    cleanup();
    sfxConfirm();
    if (onYes) onYes();
  };
  const no = () => {
    cleanup();
    sfxBeep();
    if (onNo) onNo();
  };
  function cleanup() {
    $("#confirm-modal").classList.add("hidden");
    $("#btn-confirm-yes").removeEventListener("click", yes);
    $("#btn-confirm-no").removeEventListener("click", no);
  }
  $("#btn-confirm-yes").addEventListener("click", yes, { once: true });
  $("#btn-confirm-no").addEventListener("click", no, { once: true });
}

// ---------- Keyboard ----------
window.addEventListener("keydown", (e) => {
  if (e.code === "Escape" && state && state.status === "investigating") {
    if ($("#screen-dossier").classList.contains("active")) enterMap();
    else enterDossier();
  }
});

// ---------- Utils ----------
function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

// ---------- Boot ----------
showScreen("title");
