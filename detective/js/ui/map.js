// Renders the world map with clickable city markers.

import { WORLD_MAP_SVG } from "../world-map.svg.js";
import { CITIES } from "../data/cities.js";
import { getLocale } from "../i18n/i18n.js";

let mapHost = null;
let onCityClick = null;

export function mountMap(hostEl, clickHandler) {
  mapHost = hostEl;
  onCityClick = clickHandler;
  hostEl.innerHTML = WORLD_MAP_SVG;
  const svg = hostEl.querySelector("svg");
  const layer = svg.querySelector("#city-layer");
  rebuildLayer(layer);
}

function rebuildLayer(layer) {
  layer.innerHTML = "";
  const L = getLocale();
  for (const c of Object.values(CITIES)) {
    const localeCity = L.cities[c.id];
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.dataset.city = c.id;

    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("cx", c.x);
    dot.setAttribute("cy", c.y);
    dot.setAttribute("r", 3.5);
    dot.setAttribute("class", "city-dot");
    g.appendChild(dot);

    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", c.x + 6);
    label.setAttribute("y", c.y + 2);
    label.setAttribute("class", "city-label");
    label.textContent = localeCity.name;
    g.appendChild(label);

    g.style.cursor = "pointer";
    g.addEventListener("click", (e) => {
      e.stopPropagation();
      if (onCityClick) onCityClick(c.id);
    });

    layer.appendChild(g);
  }
}

// Called when the locale changes — re-render city labels.
export function relocaleMap() {
  if (!mapHost) return;
  const layer = mapHost.querySelector("#city-layer");
  if (layer) rebuildLayer(layer);
}

export function refreshMap(currentCityId) {
  if (!mapHost) return;
  const svg = mapHost.querySelector("svg");
  svg.querySelectorAll("g[data-city]").forEach(g => {
    const isCurrent = g.dataset.city === currentCityId;
    const dot = g.querySelector("circle");
    const label = g.querySelector("text");
    dot.classList.toggle("current", isCurrent);
    label.classList.toggle("current", isCurrent);
  });
}
