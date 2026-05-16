// Crime Lab Almanac — a searchable table of every city in the game. Opening
// the panel costs in-game hours (set in main.js) so it's a real choice. The
// player filters by continent and/or by a free-text query that matches name,
// country, currency, language, flag, food, or landmark.

import { CITIES, CONTINENT_OF } from "../data/cities.js";
import { getLocale } from "../i18n/i18n.js";

const COLUMNS = ["currency","language","flagColors","landmark","food"];

let _filter = { continent: "all", q: "" };

export function renderAlmanac(host) {
  const L = getLocale();
  host.innerHTML = "";

  // Controls row.
  const controls = document.createElement("div");
  controls.className = "almanac-controls";

  const qInput = document.createElement("input");
  qInput.type = "search";
  qInput.placeholder = L.ui.almanacSearchPlaceholder;
  qInput.value = _filter.q;
  qInput.className = "almanac-search";
  qInput.addEventListener("input", () => { _filter.q = qInput.value.toLowerCase(); redrawTable(); });
  controls.appendChild(qInput);

  const continents = ["all","europe","africa","asia","oceania","namerica","samerica"];
  for (const c of continents) {
    const b = document.createElement("button");
    b.className = "btn-secondary almanac-pill";
    if (_filter.continent === c) b.classList.add("active");
    b.textContent = L.ui.continentLabel[c];
    b.addEventListener("click", () => {
      _filter.continent = c;
      redrawTable();
      // Toggle active class on all pills.
      controls.querySelectorAll(".almanac-pill").forEach(x => x.classList.remove("active"));
      b.classList.add("active");
    });
    controls.appendChild(b);
  }

  host.appendChild(controls);

  const tableWrap = document.createElement("div");
  tableWrap.className = "almanac-table-wrap";
  tableWrap.id = "almanac-table-wrap";
  host.appendChild(tableWrap);

  redrawTable();
}

function redrawTable() {
  const L = getLocale();
  const wrap = document.getElementById("almanac-table-wrap");
  if (!wrap) return;
  wrap.innerHTML = "";

  const table = document.createElement("table");
  table.className = "almanac-table";

  const head = document.createElement("thead");
  const headRow = document.createElement("tr");
  for (const h of ["city", ...COLUMNS]) {
    const th = document.createElement("th");
    th.textContent = L.ui.almanacCol[h];
    headRow.appendChild(th);
  }
  head.appendChild(headRow);
  table.appendChild(head);

  const tbody = document.createElement("tbody");
  let count = 0;
  for (const cityId of Object.keys(CITIES)) {
    if (_filter.continent !== "all" && CONTINENT_OF[cityId] !== _filter.continent) continue;
    const cd = L.cities[cityId];
    // Search the iconic-name fields AND the descriptive *Clue variants AND
    // the city's notable fact — so the player can search for either "Tokyo
    // Tower" or "Eiffel" or "yen" or "Michelin" and land on Tokyo.
    const extras = [cd.landmarkClue, cd.factClue, cd.fact].filter(Boolean);
    const haystack = [cd.name, cd.country, ...COLUMNS.map(c => cd[c]), ...extras].join(" | ").toLowerCase();
    if (_filter.q && !haystack.includes(_filter.q)) continue;

    const row = document.createElement("tr");
    const cityCell = document.createElement("td");
    cityCell.innerHTML = `<strong>${cd.name}</strong><br><span class="flavor">${cd.country}</span>`;
    row.appendChild(cityCell);
    for (const c of COLUMNS) {
      const td = document.createElement("td");
      td.textContent = cd[c];
      row.appendChild(td);
    }
    tbody.appendChild(row);
    count++;
  }
  table.appendChild(tbody);
  wrap.appendChild(table);

  const tally = document.createElement("p");
  tally.className = "hint almanac-tally";
  tally.textContent = L.ui.almanacTally(count);
  wrap.appendChild(tally);
}

export function resetAlmanacFilter() { _filter = { continent: "all", q: "" }; }
