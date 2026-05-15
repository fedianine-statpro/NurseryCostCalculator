// Travel time. Computed from squared distance on the SVG grid, rounded into bands.
// Deterministic and small — keeps the clock simple.

import { CITIES } from "../data/cities.js";

export function travelHours(fromCityId, toCityId) {
  if (fromCityId === toCityId) return 0;
  const a = CITIES[fromCityId];
  const b = CITIES[toCityId];
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const d = Math.sqrt(dx*dx + dy*dy);
  // Band into 4 / 6 / 8 / 10 / 12 / 14 hour flights.
  if (d < 80)  return 4;
  if (d < 160) return 6;
  if (d < 240) return 8;
  if (d < 340) return 10;
  if (d < 450) return 12;
  return 14;
}
