// City structural data — IDs, map coordinates, and location definitions.
// All display text lives in the locale files (js/i18n/en.js, ru.js).

export const CITIES = {
  lisbon:      { id: "lisbon",      x: 463, y: 215, locations: [{ id: "docks", cost: 3 }, { id: "trampark", cost: 2 }, { id: "fado", cost: 4 }] },
  reykjavik:   { id: "reykjavik",   x: 488, y: 95,  locations: [{ id: "harbor", cost: 3 }, { id: "spa", cost: 4 }, { id: "embassy", cost: 2 }] },
  cairo:       { id: "cairo",       x: 596, y: 240, locations: [{ id: "souq", cost: 3 }, { id: "museum", cost: 4 }, { id: "felucca", cost: 2 }] },
  marrakech:   { id: "marrakech",   x: 472, y: 250, locations: [{ id: "souk", cost: 3 }, { id: "riad", cost: 3 }, { id: "snake", cost: 2 }] },
  capetown:    { id: "capetown",    x: 575, y: 410, locations: [{ id: "waterfront", cost: 3 }, { id: "cableway", cost: 4 }, { id: "bookshop", cost: 2 }] },
  istanbul:    { id: "istanbul",    x: 588, y: 195, locations: [{ id: "bazaar", cost: 4 }, { id: "ferry", cost: 2 }, { id: "cistern", cost: 3 }] },
  mumbai:      { id: "mumbai",      x: 720, y: 260, locations: [{ id: "dabbawalas", cost: 2 }, { id: "studio", cost: 4 }, { id: "promenade", cost: 3 }] },
  bangkok:     { id: "bangkok",     x: 820, y: 270, locations: [{ id: "klong", cost: 3 }, { id: "market", cost: 3 }, { id: "temple", cost: 4 }] },
  tokyo:       { id: "tokyo",       x: 900, y: 200, locations: [{ id: "crossing", cost: 3 }, { id: "shrine", cost: 4 }, { id: "izakaya", cost: 2 }] },
  sydney:      { id: "sydney",      x: 905, y: 405, locations: [{ id: "wharf", cost: 3 }, { id: "bondi", cost: 3 }, { id: "opera", cost: 4 }] },
  lima:        { id: "lima",        x: 290, y: 350, locations: [{ id: "plaza", cost: 3 }, { id: "mercado", cost: 2 }, { id: "barranco", cost: 4 }] },
  mexicocity:  { id: "mexicocity",  x: 215, y: 270, locations: [{ id: "zocalo", cost: 3 }, { id: "xochimilco", cost: 4 }, { id: "lucha", cost: 3 }] },
  havana:      { id: "havana",      x: 235, y: 240, locations: [{ id: "malecon", cost: 2 }, { id: "cigar", cost: 3 }, { id: "buenavista", cost: 4 }] },
  helsinki:    { id: "helsinki",    x: 565, y: 110, locations: [{ id: "market", cost: 2 }, { id: "sauna", cost: 3 }, { id: "ferry", cost: 3 }] },
  buenosaires: { id: "buenosaires", x: 320, y: 415, locations: [{ id: "milonga", cost: 4 }, { id: "boca", cost: 3 }, { id: "recoleta", cost: 3 }] },
  vancouver:   { id: "vancouver",   x: 165, y: 165, locations: [{ id: "gastown", cost: 2 }, { id: "granville", cost: 3 }, { id: "stanley", cost: 3 }] },
  edinburgh:   { id: "edinburgh",   x: 467, y: 145, locations: [{ id: "royal", cost: 3 }, { id: "vaults", cost: 4 }, { id: "arthur", cost: 3 }] },
  seoul:       { id: "seoul",       x: 870, y: 195, locations: [{ id: "myeongdong", cost: 3 }, { id: "palace", cost: 4 }, { id: "noraebang", cost: 2 }] },
};

export const CITY_LIST = Object.values(CITIES);
