// City structural data — IDs, map coordinates, and location definitions.
// All display text lives in the locale files (js/i18n/en.js, ru.js).
//
// Each location has a `specialty` — a hint at the *kind* of clue the witness
// tends to give. The case author still controls the actual yield per case, but
// when authoring new cases we try to keep yields aligned with specialty so
// players can learn the meta-pattern: "If I need a currency clue, find a bank
// or a dock. For history and landmarks, try a museum. For hobby/personal
// quirks, try a club or arena."
//
// Specialty values:
//   "money"     — currency / flag colors  (banks, docks, market exchanges)
//   "language"  — language / flag colors  (embassies, consulates, foreign desks)
//   "food"      — food / language         (markets, souks, bazaars, restaurants)
//   "history"   — landmark / fact         (museums, monuments, temples, ruins)
//   "climate"   — climate / weather       (spas, saunas, harbors, parks)
//   "culture"   — hobby / accessory       (clubs, arenas, theaters, studios)
//   "people"    — trait / mark            (witnesses with a clear view)
//   "transit"   — destination angle       (ports, piers, ferries, stations)

export const CITIES = {
  lisbon: { id: "lisbon", x: 463, y: 215, locations: [
    { id: "docks",    cost: 3, specialty: "transit" },
    { id: "trampark", cost: 2, specialty: "people"  },
    { id: "fado",     cost: 4, specialty: "culture" },
  ]},
  reykjavik: { id: "reykjavik", x: 488, y: 95, locations: [
    { id: "harbor",  cost: 3, specialty: "transit" },
    { id: "spa",     cost: 4, specialty: "climate" },
    { id: "embassy", cost: 2, specialty: "language" },
  ]},
  cairo: { id: "cairo", x: 596, y: 240, locations: [
    { id: "souq",    cost: 3, specialty: "food"    },
    { id: "museum",  cost: 4, specialty: "history" },
    { id: "felucca", cost: 2, specialty: "transit" },
  ]},
  marrakech: { id: "marrakech", x: 472, y: 250, locations: [
    { id: "souk",  cost: 3, specialty: "food"    },
    { id: "riad",  cost: 3, specialty: "people"  },
    { id: "snake", cost: 2, specialty: "culture" },
  ]},
  capetown: { id: "capetown", x: 575, y: 410, locations: [
    { id: "waterfront", cost: 3, specialty: "transit" },
    { id: "cableway",   cost: 4, specialty: "climate" },
    { id: "bookshop",   cost: 2, specialty: "history" },
  ]},
  istanbul: { id: "istanbul", x: 588, y: 195, locations: [
    { id: "bazaar",  cost: 4, specialty: "food"    },
    { id: "ferry",   cost: 2, specialty: "transit" },
    { id: "cistern", cost: 3, specialty: "history" },
  ]},
  mumbai: { id: "mumbai", x: 720, y: 260, locations: [
    { id: "dabbawalas", cost: 2, specialty: "people"  },
    { id: "studio",     cost: 4, specialty: "culture" },
    { id: "promenade",  cost: 3, specialty: "climate" },
  ]},
  bangkok: { id: "bangkok", x: 820, y: 270, locations: [
    { id: "klong",  cost: 3, specialty: "transit" },
    { id: "market", cost: 3, specialty: "food"    },
    { id: "temple", cost: 4, specialty: "history" },
  ]},
  tokyo: { id: "tokyo", x: 900, y: 200, locations: [
    { id: "crossing", cost: 3, specialty: "people"  },
    { id: "shrine",   cost: 4, specialty: "history" },
    { id: "izakaya",  cost: 2, specialty: "culture" },
  ]},
  sydney: { id: "sydney", x: 905, y: 405, locations: [
    { id: "wharf", cost: 3, specialty: "transit" },
    { id: "bondi", cost: 3, specialty: "climate" },
    { id: "opera", cost: 4, specialty: "culture" },
  ]},
  lima: { id: "lima", x: 290, y: 350, locations: [
    { id: "plaza",    cost: 3, specialty: "history" },
    { id: "mercado",  cost: 2, specialty: "food"    },
    { id: "barranco", cost: 4, specialty: "culture" },
  ]},
  mexicocity: { id: "mexicocity", x: 205, y: 265, locations: [
    { id: "zocalo",     cost: 3, specialty: "history" },
    { id: "xochimilco", cost: 4, specialty: "transit" },
    { id: "lucha",      cost: 3, specialty: "culture" },
  ]},
  havana: { id: "havana", x: 235, y: 270, locations: [
    { id: "malecon",    cost: 2, specialty: "climate" },
    { id: "cigar",      cost: 3, specialty: "money"   },
    { id: "buenavista", cost: 4, specialty: "culture" },
  ]},
  helsinki: { id: "helsinki", x: 565, y: 110, locations: [
    { id: "market", cost: 2, specialty: "food"    },
    { id: "sauna",  cost: 3, specialty: "climate" },
    { id: "ferry",  cost: 3, specialty: "transit" },
  ]},
  buenosaires: { id: "buenosaires", x: 320, y: 415, locations: [
    { id: "milonga",  cost: 4, specialty: "culture" },
    { id: "boca",     cost: 3, specialty: "food"    },
    { id: "recoleta", cost: 3, specialty: "history" },
  ]},
  vancouver: { id: "vancouver", x: 165, y: 165, locations: [
    { id: "gastown",   cost: 2, specialty: "history" },
    { id: "granville", cost: 3, specialty: "food"    },
    { id: "stanley",   cost: 3, specialty: "climate" },
  ]},
  edinburgh: { id: "edinburgh", x: 467, y: 145, locations: [
    { id: "royal",  cost: 3, specialty: "history" },
    { id: "vaults", cost: 4, specialty: "people"  },
    { id: "arthur", cost: 3, specialty: "climate" },
  ]},
  seoul: { id: "seoul", x: 870, y: 195, locations: [
    { id: "myeongdong", cost: 3, specialty: "food"    },
    { id: "palace",     cost: 4, specialty: "history" },
    { id: "noraebang",  cost: 2, specialty: "culture" },
  ]},

  // ── Five additions ─────────────────────────────────────────────────────
  rio: { id: "rio", x: 370, y: 380, locations: [
    { id: "copacabana", cost: 3, specialty: "climate" },
    { id: "escadaria",  cost: 3, specialty: "history" },
    { id: "samba",      cost: 4, specialty: "culture" },
  ]},
  athens: { id: "athens", x: 568, y: 218, locations: [
    { id: "acropolis", cost: 4, specialty: "history" },
    { id: "plaka",     cost: 2, specialty: "food"    },
    { id: "piraeus",   cost: 3, specialty: "transit" },
  ]},
  nairobi: { id: "nairobi", x: 608, y: 332, locations: [
    { id: "market", cost: 2, specialty: "food"    },
    { id: "park",   cost: 4, specialty: "climate" },
    { id: "karen",  cost: 3, specialty: "history" },
  ]},
  hanoi: { id: "hanoi", x: 842, y: 250, locations: [
    { id: "quarter", cost: 3, specialty: "food"    },
    { id: "lake",    cost: 3, specialty: "history" },
    { id: "bridge",  cost: 2, specialty: "transit" },
  ]},
  auckland: { id: "auckland", x: 970, y: 418, locations: [
    { id: "viaduct", cost: 2, specialty: "transit" },
    { id: "mteden",  cost: 4, specialty: "climate" },
    { id: "kroad",   cost: 3, specialty: "culture" },
  ]},
};

export const CITY_LIST = Object.values(CITIES);

// Continent grouping for the Crime Lab almanac filter.
export const CONTINENT_OF = {
  lisbon: "europe", reykjavik: "europe", helsinki: "europe", edinburgh: "europe", athens: "europe",
  cairo: "africa", marrakech: "africa", capetown: "africa", nairobi: "africa",
  istanbul: "asia", mumbai: "asia", bangkok: "asia", tokyo: "asia", seoul: "asia", hanoi: "asia",
  sydney: "oceania", auckland: "oceania",
  lima: "samerica", buenosaires: "samerica", rio: "samerica",
  mexicocity: "namerica", havana: "namerica", vancouver: "namerica",
};
