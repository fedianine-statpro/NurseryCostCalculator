// Case structural data — trail, culprit ID, and per-location yields.
// Titles, briefings, and loot descriptions live in the locale files.

export const CASES = [
  {
    id: "C-001",
    culpritId: "kestrel",
    hours: 168,
    trail: [
      { cityId: "lisbon",      locations: { docks: { yields: "destination", angle: "currency" }, trampark: { yields: "trait", trait: "accessory" }, fado: { yields: "junk" } } },
      { cityId: "marrakech",   locations: { souk: { yields: "junk" }, riad: { yields: "destination", angle: "landmark" }, snake: { yields: "trait", trait: "hobby" } } },
      { cityId: "istanbul",    locations: { bazaar: { yields: "trait", trait: "mark" }, ferry: { yields: "destination", angle: "food" }, cistern: { yields: "junk" } } },
      { cityId: "mumbai",      locations: { dabbawalas: { yields: "junk" }, studio: { yields: "trait", trait: "build" }, promenade: { yields: "destination", angle: "flagColors" } } },
      { cityId: "sydney" }
    ]
  },
  {
    id: "C-002",
    culpritId: "duarte",
    hours: 168,
    trail: [
      { cityId: "helsinki",    locations: { market: { yields: "trait", trait: "accessory" }, sauna: { yields: "junk" }, ferry: { yields: "destination", angle: "language" } } },
      { cityId: "edinburgh",   locations: { royal: { yields: "destination", angle: "fact" }, vaults: { yields: "trait", trait: "mark" }, arthur: { yields: "junk" } } },
      { cityId: "lisbon",      locations: { docks: { yields: "junk" }, trampark: { yields: "trait", trait: "build" }, fado: { yields: "destination", angle: "climate" } } },
      { cityId: "buenosaires", locations: { milonga: { yields: "trait", trait: "hobby" }, boca: { yields: "destination", angle: "food" }, recoleta: { yields: "junk" } } },
      { cityId: "havana" }
    ]
  },
  {
    id: "C-003",
    culpritId: "selene",
    hours: 168,
    trail: [
      { cityId: "capetown",    locations: { waterfront: { yields: "destination", angle: "fact" }, cableway: { yields: "junk" }, bookshop: { yields: "trait", trait: "hair" } } },
      { cityId: "cairo",       locations: { souq: { yields: "trait", trait: "accessory" }, museum: { yields: "junk" }, felucca: { yields: "destination", angle: "currency" } } },
      { cityId: "istanbul",    locations: { bazaar: { yields: "destination", angle: "landmark" }, ferry: { yields: "junk" }, cistern: { yields: "trait", trait: "build" } } },
      { cityId: "bangkok",     locations: { klong: { yields: "junk" }, market: { yields: "trait", trait: "mark" }, temple: { yields: "destination", angle: "food" } } },
      { cityId: "tokyo" }
    ]
  },
  {
    id: "C-004",
    culpritId: "petra",
    hours: 168,
    trail: [
      { cityId: "lisbon",      locations: { docks: { yields: "destination", angle: "language" }, trampark: { yields: "junk" }, fado: { yields: "trait", trait: "hair" } } },
      { cityId: "havana",      locations: { malecon: { yields: "trait", trait: "build" }, cigar: { yields: "destination", angle: "climate" }, buenavista: { yields: "junk" } } },
      { cityId: "mexicocity",  locations: { zocalo: { yields: "junk" }, xochimilco: { yields: "destination", angle: "fact" }, lucha: { yields: "trait", trait: "mark" } } },
      { cityId: "vancouver",   locations: { gastown: { yields: "destination", angle: "food" }, granville: { yields: "trait", trait: "hobby" }, stanley: { yields: "junk" } } },
      { cityId: "seoul" }
    ]
  },
  {
    id: "C-005",
    culpritId: "ines",
    hours: 168,
    trail: [
      { cityId: "mumbai",      locations: { dabbawalas: { yields: "destination", angle: "currency" }, studio: { yields: "trait", trait: "hair" }, promenade: { yields: "junk" } } },
      { cityId: "marrakech",   locations: { souk: { yields: "destination", angle: "flagColors" }, riad: { yields: "trait", trait: "accessory" }, snake: { yields: "junk" } } },
      { cityId: "lisbon",      locations: { docks: { yields: "trait", trait: "build" }, trampark: { yields: "destination", angle: "fact" }, fado: { yields: "junk" } } },
      { cityId: "reykjavik",   locations: { harbor: { yields: "junk" }, spa: { yields: "trait", trait: "mark" }, embassy: { yields: "destination", angle: "language" } } },
      { cityId: "buenosaires" }
    ]
  }
];

export const CASE_BY_ID = Object.fromEntries(CASES.map(c => [c.id, c]));
