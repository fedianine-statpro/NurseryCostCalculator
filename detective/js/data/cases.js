// Hand-authored cases. Each case has a trail of 5-7 cities.
// Player starts at trail[0]. The last city is the arrest destination.
// At each non-final city, the 3 locations yield:
//   - destination: a clue pointing to the next city (uses next city's clueAngle)
//   - trait: a suspect-trait clue (one of the culprit's traits)
//   - junk: a flavor line that wastes time
// At the FINAL city, any investigation triggers the arrest sequence.

export const CASES = [
  {
    id: "C-001",
    title: "The Bronze Falcon",
    loot: "the Bronze Falcon of Lisbon, a 16th-century navigational charm worth a small country",
    culpritId: "kestrel",
    hours: 168,
    briefing:
      "Detective. The Bronze Falcon was lifted from a velvet case in Lisbon last night — no alarm, no broken glass, just an empty pedestal and a single black feather on the floor.\n\nWhoever did this is fast, and they're already moving. You have one week before this disappears into a private collection forever. Get to Lisbon. Find the trail. Bring them in.",
    trail: [
      {
        cityId: "lisbon",
        locations: {
          docks:    { yields: "destination", angle: "currency" },
          trampark: { yields: "trait",       trait: "accessory" },
          fado:     { yields: "junk" }
        }
      },
      {
        cityId: "marrakech",
        locations: {
          souk:  { yields: "junk" },
          riad:  { yields: "destination", angle: "landmark" },
          snake: { yields: "trait", trait: "hobby" }
        }
      },
      {
        cityId: "istanbul",
        locations: {
          bazaar:  { yields: "trait", trait: "mark" },
          ferry:   { yields: "destination", angle: "food" },
          cistern: { yields: "junk" }
        }
      },
      {
        cityId: "mumbai",
        locations: {
          dabbawalas: { yields: "junk" },
          studio:     { yields: "trait", trait: "build" },
          promenade:  { yields: "destination", angle: "flagColors" }
        }
      },
      {
        cityId: "sydney" // ARREST
      }
    ]
  },
  {
    id: "C-002",
    title: "The Whispering Score",
    loot: "Rachmaninoff's lost prelude, a single handwritten manuscript thought destroyed in 1943",
    culpritId: "duarte",
    hours: 168,
    briefing:
      "A vault in Helsinki has been quietly emptied of one item. The cleaning staff thought the dust on the floor was a stain. It's a footprint. The score that nobody believed existed is in the wind.\n\nThe thief is musical — they couldn't help themselves. Witnesses at the airport say a man hummed it to the customs agent. Move.",
    trail: [
      {
        cityId: "helsinki",
        locations: {
          market: { yields: "trait", trait: "accessory" },
          sauna:  { yields: "junk" },
          ferry:  { yields: "destination", angle: "language" }
        }
      },
      {
        cityId: "edinburgh",
        locations: {
          royal:  { yields: "destination", angle: "fact" },
          vaults: { yields: "trait", trait: "mark" },
          arthur: { yields: "junk" }
        }
      },
      {
        cityId: "lisbon",
        locations: {
          docks:    { yields: "junk" },
          trampark: { yields: "trait", trait: "build" },
          fado:     { yields: "destination", angle: "climate" }
        }
      },
      {
        cityId: "buenosaires",
        locations: {
          milonga:  { yields: "trait", trait: "hobby" },
          boca:     { yields: "destination", angle: "food" },
          recoleta: { yields: "junk" }
        }
      },
      {
        cityId: "havana" // ARREST
      }
    ]
  },
  {
    id: "C-003",
    title: "The Glass Cobra",
    loot: "the Glass Cobra of Jaipur, an emerald-fanged scepter on loan to a museum in Cape Town",
    culpritId: "selene",
    hours: 168,
    briefing:
      "The Glass Cobra was on display behind three layers of laminated security glass. This morning the glass is intact and the case is empty. Either someone walked through walls, or the curator helped — and the curator has a perfect alibi.\n\nStart in Cape Town. Witnesses are talking; one of them is lying.",
    trail: [
      {
        cityId: "capetown",
        locations: {
          waterfront: { yields: "destination", angle: "fact" },
          cableway:   { yields: "junk" },
          bookshop:   { yields: "trait", trait: "hair" }
        }
      },
      {
        cityId: "cairo",
        locations: {
          souq:    { yields: "trait", trait: "accessory" },
          museum:  { yields: "junk" },
          felucca: { yields: "destination", angle: "currency" }
        }
      },
      {
        cityId: "istanbul",
        locations: {
          bazaar:  { yields: "destination", angle: "landmark" },
          ferry:   { yields: "junk" },
          cistern: { yields: "trait", trait: "build" }
        }
      },
      {
        cityId: "bangkok",
        locations: {
          klong:  { yields: "junk" },
          market: { yields: "trait", trait: "mark" },
          temple: { yields: "destination", angle: "food" }
        }
      },
      {
        cityId: "tokyo" // ARREST
      }
    ]
  },
  {
    id: "C-004",
    title: "The Midnight Atlas",
    loot: "the 1502 Cantino Planisphere, a map so accurate for its age that nations once killed for it",
    culpritId: "petra",
    hours: 168,
    briefing:
      "The Cantino is gone. The case in Lisbon registers as locked and undisturbed; the map inside is a forgery printed on aged paper. The original walked out sometime in the last seventy-two hours.\n\nThis is a collector's crime. Whoever has it loves maps a little too much. Start at the source.",
    trail: [
      {
        cityId: "lisbon",
        locations: {
          docks:    { yields: "destination", angle: "language" },
          trampark: { yields: "junk" },
          fado:     { yields: "trait", trait: "hair" }
        }
      },
      {
        cityId: "havana",
        locations: {
          malecon:   { yields: "trait", trait: "build" },
          cigar:     { yields: "destination", angle: "climate" },
          buenavista:{ yields: "junk" }
        }
      },
      {
        cityId: "mexicocity",
        locations: {
          zocalo:    { yields: "junk" },
          xochimilco:{ yields: "destination", angle: "fact" },
          lucha:     { yields: "trait", trait: "mark" }
        }
      },
      {
        cityId: "vancouver",
        locations: {
          gastown:  { yields: "destination", angle: "food" },
          granville:{ yields: "trait", trait: "hobby" },
          stanley:  { yields: "junk" }
        }
      },
      {
        cityId: "seoul" // ARREST
      }
    ]
  },
  {
    id: "C-005",
    title: "The Saffron Tiara",
    loot: "a Mughal tiara of seven saffron-colored sapphires, last worn in 1707",
    culpritId: "ines",
    hours: 168,
    briefing:
      "The Saffron Tiara was stolen from a hotel safe in Mumbai during a private viewing. The cameras caught nothing but a woman laughing in a doorway, and then the lights went out.\n\nShe likes attention. She'll perform somewhere along the trail. Don't let her get to the buyer.",
    trail: [
      {
        cityId: "mumbai",
        locations: {
          dabbawalas: { yields: "destination", angle: "currency" },
          studio:     { yields: "trait", trait: "hair" },
          promenade:  { yields: "junk" }
        }
      },
      {
        cityId: "marrakech",
        locations: {
          souk:  { yields: "destination", angle: "flagColors" },
          riad:  { yields: "trait", trait: "accessory" },
          snake: { yields: "junk" }
        }
      },
      {
        cityId: "lisbon",
        locations: {
          docks:    { yields: "trait", trait: "build" },
          trampark: { yields: "destination", angle: "fact" },
          fado:     { yields: "junk" }
        }
      },
      {
        cityId: "reykjavik",
        locations: {
          harbor:  { yields: "junk" },
          spa:     { yields: "trait", trait: "mark" },
          embassy: { yields: "destination", angle: "language" }
        }
      },
      {
        cityId: "buenosaires" // ARREST
      }
    ]
  }
];

export const CASE_BY_ID = Object.fromEntries(CASES.map(c => [c.id, c]));
