// Clue text generation — uses the active locale's templates and city/suspect data.

import { getLocale } from "../i18n/i18n.js";
import { SUSPECT_TRAITS } from "../data/suspects.js";

function pickTemplate(arr, seed) {
  return arr[seed % arr.length];
}

function seedFor(cityId, locationId) {
  let h = 0;
  const s = cityId + ":" + locationId;
  for (let i = 0; i < s.length; i++) h = (h*31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function generateDestinationClue(nextCityId, angle, fromCityId, locationId) {
  const L = getLocale();
  const city = L.cities[nextCityId];
  const arr = L.clues.dest[angle] || L.clues.dest.landmark;
  const tpl = pickTemplate(arr, seedFor(fromCityId, locationId));
  return tpl(city);
}

export function generateTraitClue(culpritId, traitKey, fromCityId, locationId) {
  const L = getLocale();
  const valueId = SUSPECT_TRAITS[culpritId][traitKey];
  const value = L.traitValues[traitKey][valueId];
  const arr = L.clues.trait[traitKey];
  const tpl = pickTemplate(arr, seedFor(fromCityId, locationId));
  return { text: tpl(value), traitKey, valueId };
}

export function generateJunkClue(fromCityId, locationId) {
  const L = getLocale();
  return pickTemplate(L.clues.junk, seedFor(fromCityId, locationId));
}

export function generateDeadEndClue(fromCityId, locationId) {
  const L = getLocale();
  return pickTemplate(L.clues.deadEnd, seedFor(fromCityId, locationId));
}
