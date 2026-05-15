// Entry: wires up screens, runs the state machine, and handles locale switching.

import { CASES, CASE_BY_ID } from "./data/cases.js";
import { CITIES } from "./data/cities.js";
import {
  createGameState, getCurrentCase, getTrailEntryForCity, getTrailIndexOfCity,
  getFinalCityId, isLocationDone, markLocationDone, spendHours, formatTime
} from "./engine/state.js";
import { travelHours } from "./engine/clock.js";
import {
  generateDestinationClue, generateTraitClue, generateJunkClue, generateDeadEndClue
} from "./engine/clues.js";
import { canIssueWarrant } from "./engine/warrant.js";
import { mountMap, refreshMap, relocaleMap } from "./ui/map.js";
import { renderDossier, getSelectedSuspect, clearSelection } from "./ui/dossier.js";
import { typewrite } from "./ui/narrator.js";
import {
  sfxBeep, sfxConfirm, sfxDeny, sfxPlane, sfxStamp, sfxWin, sfxLose
} from "./ui/effects.js";
import {
  getLocale, getLocaleCode, setLocale, onLocaleChange, availableLocales
} from "./i18n/i18n.js";

const $ = (sel) => document.querySelector(sel);

let state = null;
let activeScreen = "title";

// ---------- Screen routing ----------
const SCREENS = ["title", "case-select", "briefing", "map", "city", "dossier", "epilogue"];

function showScreen(name) {
  activeScreen = name;
  for (const s of SCREENS) {
    document.getElementById("screen-" + s).classList.toggle("active", s === name);
  }
  $("#confirm-modal").classList.add("hidden");
}

// ---------- Locale application ----------
// Sets all the static UI strings (button labels, panel titles) for the current locale.
// Called once on boot and again whenever the locale changes.
function applyStaticLocale() {
  const L = getLocale();
  // HUD
  $(".logo").textContent = L.ui.bureau;
  // Title screen
  $("#title1").innerHTML = L.ui.title1;
  $("#title2").innerHTML = L.ui.title2;
  $("#tagline").textContent = L.ui.tagline;
  $("#btn-start").textContent = L.ui.beginBriefing;
  $("#keyboard-hint").innerHTML = L.ui.keyboardHint;
  // Case select
  $("#case-select-title").textContent = L.ui.chooseCase;
  // Briefing
  $("#briefing-label").textContent = L.ui.chiefsBriefingLabel;
  $("#btn-briefing-go").textContent = L.ui.takeCase;
  // Map screen
  $("#map-loc-title").textContent = L.ui.currentLocation;
  $("#map-actions-title").textContent = L.ui.actions;
  $("#btn-investigate").textContent = L.ui.investigate;
  $("#btn-open-dossier").textContent = L.ui.openDossier;
  $("#map-marker-hint").textContent = L.ui.clickMarkerHint;
  // City screen
  $("#btn-back-map").textContent = L.ui.backMap;
  $("#btn-city-dossier").textContent = L.ui.dossier;
  $("#btn-result-continue").textContent = L.ui.cont;
  // Dossier
  $("#dossier-title").textContent = L.ui.suspectDossier;
  $("#traits-title").textContent = L.ui.traitsCollected;
  $("#btn-dossier-back").textContent = L.ui.returnMap;
  $("#btn-issue-warrant").textContent = L.ui.issueWarrant;
  // Epilogue
  $("#btn-epilogue-again").textContent = L.ui.newCase;
  $("#rank-label").textContent = L.ui.yourRank;
  // Stamp
  $("#stamp-overlay .stamp").textContent = L.ui.warrantIssued;
  // Language toggle buttons reflect active code
  updateLangButtons();
}

function updateLangButtons() {
  const code = getLocaleCode();
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === code);
  });
}

// ---------- HUD ----------
function updateHud() {
  const L = getLocale();
  if (!state) {
    $("#hud-case").textContent = "";
    $("#hud-city").textContent = "";
    $("#hud-clock").textContent = "";
    return;
  }
  const c = getCurrentCase(state);
  const cityLoc = L.cities[state.currentCityId];
  const caseLoc = L.cases[c.id];
  $("#hud-case").textContent = L.ui.caseLine(c.id, caseLoc.title);
  $("#hud-city").textContent = L.ui.locationLine(cityLoc.name, cityLoc.country);
  $("#hud-clock").textContent = L.ui.clockLine(formatTime(state.hoursLeft));
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
  const L = getLocale();
  const host = $("#case-list");
  host.innerHTML = "";
  for (const c of CASES) {
    const caseLoc = L.cases[c.id];
    const card = document.createElement("div");
    card.className = "case-card";
    card.innerHTML = `
      <div class="case-card-id">${c.id}</div>
      <div class="case-card-title">${caseLoc.title}</div>
      <div class="case-card-sub">${L.ui.stolen(caseLoc.lootLong)}</div>
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
  const L = getLocale();
  $("#briefing-id").textContent = caseId;
  showScreen("briefing");
  typewrite($("#briefing-text"), L.cases[caseId].briefing, { speed: 18 });
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
  const L = getLocale();
  const cityLoc = L.cities[state.currentCityId];
  $("#map-current-city").textContent = `${cityLoc.name}, ${cityLoc.country}`;
  $("#map-current-flavor").textContent = L.ui.cityFlavor(cityLoc.climate, cityLoc.fact);
  updateHud();
  showScreen("map");
}

function handleCityClickFromMap(cityId) {
  if (state.status !== "investigating") return;
  if (cityId === state.currentCityId) {
    enterCity();
    return;
  }
  const L = getLocale();
  const hours = travelHours(state.currentCityId, cityId);
  const targetCity = L.cities[cityId];
  askConfirm(
    L.ui.flyTo(targetCity.name, targetCity.country, hours, formatTime(state.hoursLeft)),
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
  const L = getLocale();
  const cityData = CITIES[state.currentCityId];
  const cityLoc = L.cities[cityData.id];
  $("#city-name").textContent = L.ui.cityHeader(cityLoc.name, cityLoc.country);
  $("#city-sub").textContent = L.ui.citySub(cityLoc.language, cityLoc.currency, cityLoc.landmark);

  const host = $("#city-locations");
  host.innerHTML = "";
  for (const loc of cityData.locations) {
    const locLoc = cityLoc.locations[loc.id];
    const card = document.createElement("div");
    card.className = "location-card";
    const done = isLocationDone(state, cityData.id, loc.id);
    if (done) card.classList.add("disabled");
    card.innerHTML = `
      <div class="location-name">${locLoc.name}</div>
      <div class="location-cost">${L.ui.locationCost(loc.cost, done)}</div>
      <div class="location-flavor">${locLoc.flavor}</div>
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
      // Store the language-neutral value id so language switches are safe.
      state.traitsLearned[tc.traitKey] = tc.valueId;
      text = tc.text;
    } else {
      text = generateJunkClue(cityId, loc.id);
    }
  }

  state.cluesSeen.push({ cityId, locationId: loc.id, text });

  $("#city-locations").querySelectorAll(".location-card").forEach((card, i) => {
    const locId = CITIES[cityId].locations[i].id;
    if (isLocationDone(state, cityId, locId)) card.classList.add("disabled");
  });

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
  const L = getLocale();
  const id = getSelectedSuspect();
  if (!id || !canIssueWarrant(state)) return;
  const c = getCurrentCase(state);
  if (id === c.culpritId) {
    state.warrantSuspectId = id;
    sfxStamp();
    showWarrantStamp(() => {
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
    askConfirm(L.ui.wrongWarrant, () => enterDossier(), null, L.ui.ok, null);
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
  const L = getLocale();
  const c = getCurrentCase(state);
  const finalCity = L.cities[getFinalCityId(state)];

  if (state.warrantSuspectId === c.culpritId) {
    state.status = "won";
    sfxWin();
    finishCase();
    return;
  }
  if (state.warrantSuspectId && state.warrantSuspectId !== c.culpritId) {
    state.status = "lost";
    state.losReason = "wrong-warrant";
    finishCase();
    return;
  }
  askConfirm(L.ui.noWarrantArrival(finalCity.name), () => enterMap(), null, L.ui.ok, null);
}

// ---------- Win / Lose ----------
function finishCase() {
  const L = getLocale();
  const c = getCurrentCase(state);
  const culpritLoc = L.suspects[c.culpritId];
  const caseLoc = L.cases[c.id];
  const isWin = state.status === "won";

  const stampEl = $("#epilogue-stamp");
  stampEl.classList.remove("hidden");
  stampEl.textContent = isWin ? L.ui.caseClosed : L.ui.trailLost;
  stampEl.style.color = isWin ? "var(--red)" : "#777";
  stampEl.style.borderColor = isWin ? "var(--red)" : "#777";

  let title, body, rank;
  if (isWin) {
    title = L.ui.winTitle(culpritLoc.name);
    body = L.ui.winBody(culpritLoc.name, L.cities[getFinalCityId(state)].name, caseLoc.loot);
    rank = computeRank(state.hoursLeft, state.wrongWarrants);
    sfxWin();
  } else {
    if (state.losReason === "clock") {
      title = L.ui.loseClockTitle;
      body = L.ui.loseClockBody(culpritLoc.name, caseLoc.loot);
    } else {
      title = L.ui.loseWrongTitle;
      body = L.ui.loseWrongBody(culpritLoc.name);
    }
    rank = L.ranks.rookie;
    sfxLose();
  }

  $("#epilogue-title").textContent = title;
  $("#rank-value").textContent = rank;
  showScreen("epilogue");
  typewrite($("#epilogue-text"), body);
}

function computeRank(hoursLeft, wrongs) {
  const L = getLocale();
  const adjusted = hoursLeft - wrongs * 18;
  if (adjusted >= 96) return L.ranks.ace;
  if (adjusted >= 48) return L.ranks.inspector;
  if (adjusted >= 16) return L.ranks.detective;
  return L.ranks.rookie;
}

$("#btn-epilogue-again").addEventListener("click", () => {
  sfxBeep();
  state = null;
  updateHud();
  renderCaseList();
  showScreen("case-select");
});

// ---------- Confirm modal ----------
function askConfirm(text, onYes, onNo, yesLabel, noLabel) {
  const L = getLocale();
  yesLabel = yesLabel ?? L.ui.yes;
  $("#confirm-text").textContent = text;
  $("#btn-confirm-yes").textContent = yesLabel;
  if (noLabel === null) {
    $("#btn-confirm-no").style.display = "none";
  } else {
    $("#btn-confirm-no").style.display = "";
    $("#btn-confirm-no").textContent = noLabel ?? L.ui.no;
  }
  $("#confirm-modal").classList.remove("hidden");
  const yes = () => { cleanup(); sfxConfirm(); if (onYes) onYes(); };
  const no = () => { cleanup(); sfxBeep(); if (onNo) onNo(); };
  function cleanup() {
    $("#confirm-modal").classList.add("hidden");
    $("#btn-confirm-yes").removeEventListener("click", yes);
    $("#btn-confirm-no").removeEventListener("click", no);
  }
  $("#btn-confirm-yes").addEventListener("click", yes, { once: true });
  $("#btn-confirm-no").addEventListener("click", no, { once: true });
}

// ---------- Language switcher ----------
function setupLangButtons() {
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      sfxBeep();
      setLocale(btn.dataset.lang);
    });
  });
}

// When the locale changes, re-render everything currently visible.
onLocaleChange(() => {
  applyStaticLocale();
  relocaleMap();
  updateHud();
  // Re-render whichever dynamic screen is active.
  if (activeScreen === "case-select") {
    renderCaseList();
  } else if (activeScreen === "briefing" && state) {
    const L = getLocale();
    typewrite($("#briefing-text"), L.cases[state.caseId].briefing, { speed: 6 });
  } else if (activeScreen === "map" && state) {
    enterMap();
  } else if (activeScreen === "city" && state) {
    enterCity();
  } else if (activeScreen === "dossier" && state) {
    enterDossier();
  } else if (activeScreen === "epilogue" && state) {
    finishCase();
  }
});

// ---------- Keyboard ----------
window.addEventListener("keydown", (e) => {
  if (e.code === "Escape" && state && state.status === "investigating") {
    if ($("#screen-dossier").classList.contains("active")) enterMap();
    else enterDossier();
  }
});

// ---------- Boot ----------
setupLangButtons();
applyStaticLocale();
showScreen("title");
