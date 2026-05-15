// Locale runtime. Loads locales, persists choice, exposes the active locale.

import { locale as en } from "./en.js";
import { locale as ru } from "./ru.js";

const LOCALES = { en, ru };
const STORAGE_KEY = "globe-detective.lang";

let activeCode = loadStoredLocale();
const listeners = new Set();

function loadStoredLocale() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && LOCALES[stored]) return stored;
  } catch {}
  return "en";
}

export function getLocale() {
  return LOCALES[activeCode];
}

export function getLocaleCode() {
  return activeCode;
}

export function setLocale(code) {
  if (!LOCALES[code] || code === activeCode) return;
  activeCode = code;
  try { localStorage.setItem(STORAGE_KEY, code); } catch {}
  for (const fn of listeners) fn(activeCode);
}

export function onLocaleChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function availableLocales() {
  return Object.keys(LOCALES);
}
