// Case structural data — trail, culprit ID, and per-location yields.
// Titles, briefings, and loot descriptions live in the locale files.
//
// A case may set `requiresWins: N` — that case is locked until the player has
// closed at least N other cases (across all save state). Used for the final
// V.I.L.E. boss case.

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
  },

  // ── New cases ───────────────────────────────────────────────────────────
  // C-006: a south-Atlantic chase. Culprit Vex (fencer, pocket watch). Pearl
  // lifted from Lima's plaza on a feast-day; trail crosses the southern oceans
  // and ends up in cold Reykjavik.
  {
    id: "C-006",
    culpritId: "vex",
    hours: 168,
    trail: [
      { cityId: "lima",        locations: { plaza:    { yields: "destination", angle: "fact" },       mercado:  { yields: "trait", trait: "accessory" }, barranco: { yields: "junk" } } },
      { cityId: "capetown",    locations: { waterfront:{ yields: "destination", angle: "currency" },  cableway: { yields: "junk" },                       bookshop: { yields: "trait", trait: "hobby" } } },
      { cityId: "cairo",       locations: { souq:     { yields: "trait", trait: "mark" },             museum:   { yields: "destination", angle: "landmark" }, felucca: { yields: "junk" } } },
      { cityId: "edinburgh",   locations: { royal:    { yields: "destination", angle: "climate" },    vaults:   { yields: "trait", trait: "hair" },       arthur:   { yields: "junk" } } },
      { cityId: "reykjavik" }
    ]
  },

  // C-007: Ravi 'the Magpie' — the train-route caper. A brass watch is lifted
  // from a vintage Orient Express car sitting in a museum siding in Istanbul.
  // Trail wraps the planet east-to-west via the southern hemisphere.
  {
    id: "C-007",
    culpritId: "ravi",
    hours: 168,
    trail: [
      { cityId: "istanbul",    locations: { bazaar:   { yields: "destination", angle: "language" },   ferry:    { yields: "junk" },                       cistern:  { yields: "trait", trait: "accessory" } } },
      { cityId: "marrakech",   locations: { souk:     { yields: "trait", trait: "build" },            riad:     { yields: "destination", angle: "food" }, snake:    { yields: "junk" } } },
      { cityId: "buenosaires", locations: { milonga:  { yields: "destination", angle: "fact" },       boca:     { yields: "junk" },                       recoleta: { yields: "trait", trait: "hobby" } } },
      { cityId: "tokyo",       locations: { crossing: { yields: "trait", trait: "mark" },             shrine:   { yields: "junk" },                       izakaya:  { yields: "destination", angle: "currency" } } },
      { cityId: "seoul" }
    ]
  },

  // C-008: the V.I.L.E. boss case. Magnus has been pulling strings. A 5-stop
  // trail with EVERY angle in play, and it only unlocks after the player has
  // closed enough prior cases. The crown spans eight empires; the chase spans
  // five continents.
  {
    id: "C-008",
    culpritId: "magnus",
    hours: 192,           // a little more time — the trail is longer
    requiresWins: 4,
    trail: [
      { cityId: "helsinki",    locations: { market:   { yields: "destination", angle: "currency" },   sauna:    { yields: "trait", trait: "hair" },       ferry:    { yields: "junk" } } },
      { cityId: "edinburgh",   locations: { royal:    { yields: "destination", angle: "fact" },       vaults:   { yields: "trait", trait: "mark" },       arthur:   { yields: "junk" } } },
      { cityId: "mumbai",      locations: { dabbawalas:{ yields: "junk" },                            studio:   { yields: "trait", trait: "accessory" },  promenade:{ yields: "destination", angle: "climate" } } },
      { cityId: "bangkok",     locations: { klong:    { yields: "destination", angle: "landmark" },   market:   { yields: "junk" },                       temple:   { yields: "trait", trait: "hobby" } } },
      { cityId: "sydney" }
    ]
  },

  // C-009: Mariana Cordeiro — a samba performer who lifts during the encore.
  // Trail goes east from Rio across four continents, ending in Tokyo.
  {
    id: "C-009",
    culpritId: "mariana",
    hours: 168,
    trail: [
      { cityId: "rio",       locations: { copacabana:{ yields: "destination", angle: "currency" },  escadaria:{ yields: "trait", trait: "hair" },       samba:    { yields: "junk" } } },
      { cityId: "lisbon",    locations: { docks:    { yields: "junk" },                              trampark: { yields: "trait", trait: "mark" },       fado:     { yields: "destination", angle: "landmark" } } },
      { cityId: "marrakech", locations: { souk:    { yields: "trait", trait: "accessory" },          riad:     { yields: "destination", angle: "food" }, snake:    { yields: "junk" } } },
      { cityId: "mumbai",    locations: { dabbawalas:{ yields: "destination", angle: "fact" },       studio:   { yields: "trait", trait: "hobby" },      promenade:{ yields: "junk" } } },
      { cityId: "tokyo" }
    ]
  },

  // C-010: Konstantin "Eclipse" Volkov — the cold operator. The Frozen Window.
  // A grand-tour trail across all five NEW cities the bureau just added to its
  // beat. Long-distance swimmer with a winter-window calling card.
  {
    id: "C-010",
    culpritId: "konstantin",
    hours: 168,
    trail: [
      { cityId: "helsinki", locations: { market:    { yields: "trait", trait: "accessory" },        sauna:     { yields: "destination", angle: "climate" },  ferry:    { yields: "junk" } } },
      { cityId: "athens",   locations: { acropolis: { yields: "trait", trait: "hair" },             plaka:     { yields: "junk" },                            piraeus:  { yields: "destination", angle: "landmark" } } },
      { cityId: "nairobi",  locations: { market:    { yields: "junk" },                              park:      { yields: "trait", trait: "mark" },            karen:    { yields: "destination", angle: "fact" } } },
      { cityId: "hanoi",    locations: { quarter:   { yields: "destination", angle: "food" },       lake:      { yields: "junk" },                            bridge:   { yields: "trait", trait: "hobby" } } },
      { cityId: "auckland" }
    ]
  },
];

export const CASE_BY_ID = Object.fromEntries(CASES.map(c => [c.id, c]));
