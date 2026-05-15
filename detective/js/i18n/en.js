// English locale.

function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

export const locale = {
  code: "en",
  name: "English",

  ui: {
    bureau: "GLOBE DETECTIVE BUREAU",
    title1: "GLOBE",
    title2: "DETECTIVE",
    tagline: "An international caper. A ticking clock. One detective.",
    beginBriefing: "BEGIN BRIEFING",
    keyboardHint: "// keyboard: <kbd>Space</kbd> skip text · <kbd>Esc</kbd> dossier",
    chooseCase: "CHOOSE YOUR CASE",
    chiefsBriefingLabel: "CHIEF'S BRIEFING — CASE FILE",
    takeCase: "TAKE THE CASE",
    currentLocation: "CURRENT LOCATION",
    actions: "ACTIONS",
    investigate: "INVESTIGATE THIS CITY",
    openDossier: "OPEN DOSSIER",
    clickMarkerHint: "click a marker on the map to fly there",
    backMap: "← BACK TO MAP",
    dossier: "DOSSIER",
    suspectDossier: "SUSPECT DOSSIER",
    traitsCollected: "TRAITS COLLECTED",
    returnMap: "← RETURN TO MAP",
    issueWarrant: "ISSUE WARRANT",
    newCase: "NEW CASE",
    yes: "YES",
    no: "NO",
    ok: "OK",
    cont: "CONTINUE",
    yourRank: "YOUR RANK",
    warrantIssued: "WARRANT ISSUED",
    caseClosed: "CASE CLOSED",
    trailLost: "TRAIL LOST",
    noTraitsYet: "No traits collected yet. Investigate witnesses to learn what they look like.",
    pickSuspect: "Pick a suspect and issue a warrant.",
    alreadySearched: "ALREADY SEARCHED",
    clickToInvestigate: "CLICK TO INVESTIGATE",
    language: "Language",

    caseLine: (id, title) => `Case ${id} · ${title}`,
    locationLine: (city, country) => `📍 ${city}, ${country}`,
    clockLine: (timeStr) => `⏱ ${timeStr}`,
    stolen: (loot) => `Stolen: ${loot}`,
    cityHeader: (city, country) => `${city}, ${country}`,
    citySub: (lang, curr, landmark) => `Native tongue: ${lang}. Local currency: ${curr}. Known for ${landmark}.`,
    cityFlavor: (climate, fact) => `A city of ${climate}. ${capitalize(fact)}.`,
    flyTo: (city, country, hours, time) => `Fly to ${city}, ${country}?\n\nFlight time: ${hours} hours.\n\nYou have ${time}.`,
    needMoreTraits: (n) => `Need ${n} more trait${n === 1 ? "" : "s"} before you can issue a warrant.`,
    locationCost: (hours, done) => `${hours}h · ${done ? "ALREADY SEARCHED" : "CLICK TO INVESTIGATE"}`,
    wrongWarrant: `The description on the warrant didn't match. The judge tore it up.\n\n— 12 hours penalty.`,
    noWarrantArrival: (city) => `You arrived in ${city} on instinct. You see them in the distance — but you have no warrant. Without one, they walk free.\n\nReturn to your dossier and identify them, then come back.`,
    winTitle: (name) => `You caught ${name}.`,
    winBody: (name, city, loot) => `${name} surrendered in ${city} with ${loot} still in their case.\n\nThe chief sends a single word over the wire: "Excellent."`,
    loseClockTitle: "The trail's gone cold.",
    loseClockBody: (name, loot) => `The week ran out. ${name} is already on a private plane, and ${loot} is going with them.\n\nThe chief sighs, and pours another coffee.`,
    loseWrongTitle: "You were chasing the wrong shadow.",
    loseWrongBody: (name) => `Your warrant named the wrong person, and the real thief — ${name} — walked past you and out the door.`,

    timeDaysHours: (d, h) => `${d}d ${h}h left`,
    timeHours: (h) => `${h}h left`,
  },

  ranks: {
    ace: "ACE DETECTIVE",
    inspector: "INSPECTOR",
    detective: "DETECTIVE",
    rookie: "ROOKIE",
  },

  traitCategories: {
    hair: "Hair", build: "Build", mark: "Distinguishing mark",
    accessory: "Accessory", hobby: "Hobby",
  },

  cities: {
    lisbon: {
      name: "Lisbon", country: "Portugal",
      language: "Portuguese", currency: "euros", landmark: "Belém Tower",
      food: "salt cod and custard tarts", flagColors: "green and red",
      climate: "warm Atlantic breeze",
      fact: "the westernmost capital of mainland Europe",
      locations: {
        docks:    { name: "Old Docks", flavor: "Gulls scream over creaking ropes. A fisherman is mending a net and pretending not to notice you." },
        trampark: { name: "Tram 28 Stop", flavor: "Yellow trams clatter past tiled facades. A busker eyes your badge." },
        fado:     { name: "Fado Bar", flavor: "A guitarist tunes up. The bartender pours something dark and asks no questions." },
      }
    },
    reykjavik: {
      name: "Reykjavik", country: "Iceland",
      language: "Icelandic", currency: "krónur", landmark: "Hallgrímskirkja",
      food: "fermented shark and rye bread", flagColors: "blue, white, and red",
      climate: "cold air, with the smell of sulphur on the wind",
      fact: "the northernmost capital of any sovereign state",
      locations: {
        harbor:  { name: "Old Harbor", flavor: "Fishing trawlers groan against the dock. Steam rises somewhere inland." },
        spa:     { name: "Geothermal Spa", flavor: "Tourists drift in milky water. A masseuse hums a tune you don't recognize." },
        embassy: { name: "Tiny Consulate", flavor: "A bored attaché stamps something. The radiator ticks loudly." },
      }
    },
    cairo: {
      name: "Cairo", country: "Egypt",
      language: "Arabic", currency: "pounds", landmark: "the Pyramids of Giza",
      food: "ful medames and koshari", flagColors: "red, white, and black",
      climate: "dry desert heat",
      fact: "home to the oldest of the Seven Wonders still standing",
      locations: {
        souq:    { name: "Khan el-Khalili Souq", flavor: "Spice carts and copper lamps. A merchant offers tea like it's a contract." },
        museum:  { name: "Antiquities Museum", flavor: "A curator straightens a glass case. One of the displays is suspiciously empty." },
        felucca: { name: "Nile Felucca Dock", flavor: "A boatman polishes a brass cleat. The river smells like silt and diesel." },
      }
    },
    marrakech: {
      name: "Marrakech", country: "Morocco",
      language: "Arabic", currency: "dirhams", landmark: "Jemaa el-Fnaa square",
      food: "tagine and mint tea", flagColors: "red with a green star",
      climate: "dry heat, with the smell of orange blossoms",
      fact: "the city the dye 'morocco red' is named after",
      locations: {
        souk:  { name: "Tanneries Souk", flavor: "Pools of dye the color of a bruise. Your eyes water; the workers smile." },
        riad:  { name: "Hidden Riad", flavor: "A door in a wall opens onto a courtyard of citrus trees. The proprietor watches a fountain." },
        snake: { name: "Snake Charmer's Pitch", flavor: "A reed pipe whines. The cobra is unimpressed; the charmer is not." },
      }
    },
    capetown: {
      name: "Cape Town", country: "South Africa",
      language: "English and Afrikaans", currency: "rand", landmark: "Table Mountain",
      food: "bobotie and rooibos tea", flagColors: "green, gold, black, blue, and red",
      climate: "fresh Atlantic wind off two oceans",
      fact: "perched between two oceans at the foot of a flat-topped mountain",
      locations: {
        waterfront: { name: "V&A Waterfront", flavor: "A seal barks at a tourist. A cruise ship moans. Wind tugs at your collar." },
        cableway:   { name: "Cable Car Station", flavor: "Cars sway out into the mist. The operator hums something local." },
        bookshop:   { name: "Antique Bookshop", flavor: "Dust motes drift through afternoon sun. The owner is reading by lamp." },
      }
    },
    istanbul: {
      name: "Istanbul", country: "Türkiye",
      language: "Turkish", currency: "lira", landmark: "the Hagia Sophia",
      food: "köfte and Turkish coffee", flagColors: "red with a white crescent",
      climate: "salt air from two seas",
      fact: "the only city in the world straddling two continents",
      locations: {
        bazaar:  { name: "Grand Bazaar", flavor: "A carpet vendor unrolls a kilim like he's casting a spell. Somewhere, a teaspoon clinks." },
        ferry:   { name: "Bosphorus Ferry", flavor: "Gulls follow the wake. A schoolboy throws bread and counts. The wind is sharp." },
        cistern: { name: "Sunken Cistern", flavor: "Columns rise from black water. Carp slip between them. Drips echo." },
      }
    },
    mumbai: {
      name: "Mumbai", country: "India",
      language: "Hindi and Marathi", currency: "rupees", landmark: "the Gateway of India",
      food: "vada pav and bombay duck", flagColors: "saffron, white, and green",
      climate: "humid monsoon air, thick with the smell of the sea",
      fact: "the largest film industry in the world by output",
      locations: {
        dabbawalas: { name: "Dabbawala Stand", flavor: "Tiffin tins clatter onto bicycles. A man checks a code that means nothing to you." },
        studio:     { name: "Film Studio Lot", flavor: "A dance number rehearses past you. Someone shouts about lighting." },
        promenade:  { name: "Marine Drive", flavor: "The 'Queen's Necklace' arcs along the bay. A coconut vendor watches you like a chess clock." },
      }
    },
    bangkok: {
      name: "Bangkok", country: "Thailand",
      language: "Thai", currency: "baht", landmark: "Wat Arun",
      food: "pad thai and tom yum", flagColors: "red, white, and blue",
      climate: "humid heat with the smell of chili and lemongrass",
      fact: "the city whose full ceremonial name is the longest in the world",
      locations: {
        klong:  { name: "Klong Canal Pier", flavor: "A longtail boat coughs to life. The pilot wears a kerchief and a grin." },
        market: { name: "Floating Market", flavor: "Boats jam the canal. Someone fries garlic; everyone wants ten baht more." },
        temple: { name: "Wat Arun Temple", flavor: "Porcelain glints in the heat. A monk sweeps the same step twice." },
      }
    },
    tokyo: {
      name: "Tokyo", country: "Japan",
      language: "Japanese", currency: "yen", landmark: "Tokyo Tower",
      food: "sushi and ramen", flagColors: "white with a red disc",
      climate: "crisp autumn air with the smell of grilled eel",
      fact: "home to more Michelin-starred restaurants than any other city",
      locations: {
        crossing: { name: "Shibuya Crossing", flavor: "A tidal wave of pedestrians collides at the green light. Neon hums overhead." },
        shrine:   { name: "Meiji Shrine", flavor: "Gravel crunches under wooden gates. The forest in the city is somehow silent." },
        izakaya:  { name: "Backstreet Izakaya", flavor: "Smoke from yakitori. A salaryman laughs too loud. The chef nods at you." },
      }
    },
    sydney: {
      name: "Sydney", country: "Australia",
      language: "English", currency: "Australian dollars", landmark: "the Opera House",
      food: "meat pies and flat whites", flagColors: "blue with the Union Jack and Southern Cross",
      climate: "bright sun and salt spray",
      fact: "the city whose harbor bridge is nicknamed 'the Coathanger'",
      locations: {
        wharf: { name: "Circular Quay", flavor: "A ferry blasts its horn. A busker plays didgeridoo to a small, polite crowd." },
        bondi: { name: "Bondi Beach", flavor: "Surfers wax boards. A lifeguard squints at the horizon like he's reading mail." },
        opera: { name: "Opera House Steps", flavor: "Tour groups photograph the sails. Inside, an orchestra is tuning, faintly." },
      }
    },
    lima: {
      name: "Lima", country: "Peru",
      language: "Spanish", currency: "soles", landmark: "Plaza Mayor",
      food: "ceviche and lomo saltado", flagColors: "red and white",
      climate: "cool Pacific mist that locals call 'la garúa'",
      fact: "the Pacific coast city that ate the Inca trail's southern end",
      locations: {
        plaza:    { name: "Plaza Mayor", flavor: "Soldiers in scarlet pace the cathedral steps. A pigeon ruins someone's photograph." },
        mercado:  { name: "Mercado Central", flavor: "Stacks of yellow ají peppers; the air bites your throat. A vendor is haggling in Quechua." },
        barranco: { name: "Barranco Art District", flavor: "A mural the size of a building. A gallery owner is locking up — or pretending to." },
      }
    },
    mexicocity: {
      name: "Mexico City", country: "Mexico",
      language: "Spanish", currency: "pesos", landmark: "the Zócalo",
      food: "tacos al pastor and mole", flagColors: "green, white, and red",
      climate: "thin highland air, the sun closer than expected",
      fact: "the city built on a drained lake bed at over 2,000 meters elevation",
      locations: {
        zocalo:     { name: "Zócalo Plaza", flavor: "A flag the size of a house ripples overhead. A child sells fried grasshoppers." },
        xochimilco: { name: "Xochimilco Canals", flavor: "Painted trajineras drift past floating gardens. A mariachi boat pulls alongside." },
        lucha:      { name: "Lucha Libre Arena", flavor: "Masks for sale at the door. Somewhere inside, somebody hits the canvas hard." },
      }
    },
    havana: {
      name: "Havana", country: "Cuba",
      language: "Spanish", currency: "Cuban pesos", landmark: "the Malecón seawall",
      food: "ropa vieja and mojitos", flagColors: "red, white, and blue with a star",
      climate: "humid Caribbean heat and the smell of cigars",
      fact: "the city of vintage American cars frozen in time",
      locations: {
        malecon:    { name: "Malecón Seawall", flavor: "Waves break against the wall. A '57 Chevy idles, the driver smoking." },
        cigar:      { name: "Cigar Factory", flavor: "Rows of rollers; a reader reads the news aloud. Tobacco dust hangs in the light." },
        buenavista: { name: "Music Club", flavor: "A trumpet line cuts through the smoke. The bandleader winks at no one in particular." },
      }
    },
    helsinki: {
      name: "Helsinki", country: "Finland",
      language: "Finnish", currency: "euros", landmark: "Helsinki Cathedral",
      food: "salmon soup and rye bread", flagColors: "white with a blue cross",
      climate: "cold Baltic air that turns your breath silver",
      fact: "the country that invented the sauna and the Moomins",
      locations: {
        market: { name: "Market Square", flavor: "A reindeer pelt blows off a table. The vendor curses cheerfully." },
        sauna:  { name: "Public Sauna", flavor: "Steam hisses. A bather throws cold water and gasps. Nobody talks." },
        ferry:  { name: "Suomenlinna Ferry", flavor: "Gulls perch on the railing. A bell rings; the ice cracks somewhere distant." },
      }
    },
    buenosaires: {
      name: "Buenos Aires", country: "Argentina",
      language: "Spanish", currency: "Argentine pesos", landmark: "the Obelisco",
      food: "asado and dulce de leche", flagColors: "light blue and white with a sun",
      climate: "humid pampas air, warm as a hand on your shoulder",
      fact: "the birthplace of tango and home of the world's widest avenue",
      locations: {
        milonga:  { name: "Tango Milonga", flavor: "Couples step in close geometry. Someone watches from a corner table." },
        boca:     { name: "La Boca Streets", flavor: "Houses painted every color a ship's leftover paint can be. A street tango pair pose for tips." },
        recoleta: { name: "Recoleta Cemetery", flavor: "Marble angels and cats. A caretaker leans on a broom and waits for you to leave." },
      }
    },
    vancouver: {
      name: "Vancouver", country: "Canada",
      language: "English", currency: "Canadian dollars", landmark: "Stanley Park",
      food: "salmon and poutine", flagColors: "red and white with a maple leaf",
      climate: "cool rainforest drizzle off the Pacific",
      fact: "a city of glass towers wedged between ocean and mountains",
      locations: {
        gastown:   { name: "Gastown Steam Clock", flavor: "The clock hisses on the hour. A barista watches you from a doorway." },
        granville: { name: "Granville Island Market", flavor: "Crab on ice. A busker on a saw plays Vivaldi. Seagulls plot." },
        stanley:   { name: "Stanley Park Seawall", flavor: "A heron stalks a tide pool. Bike bells. Cedar in the air." },
      }
    },
    edinburgh: {
      name: "Edinburgh", country: "Scotland",
      language: "English (with Scots flavor)", currency: "pounds sterling", landmark: "Edinburgh Castle",
      food: "haggis and shortbread", flagColors: "blue with a white saltire",
      climate: "wet wind off the North Sea, smelling of coal and gorse",
      fact: "a medieval old town piled on a volcanic crag",
      locations: {
        royal:  { name: "Royal Mile", flavor: "Bagpipes drift from a close. A woman in tartan sells tickets to nothing in particular." },
        vaults: { name: "Underground Vaults", flavor: "Damp stone, a tour guide telling a ghost story she half-believes. The air is cold." },
        arthur: { name: "Arthur's Seat Trail", flavor: "Wind, gorse, and a view that argues with you. A hiker is taking too many photos." },
      }
    },
    seoul: {
      name: "Seoul", country: "South Korea",
      language: "Korean", currency: "won", landmark: "Gyeongbokgung Palace",
      food: "kimchi and bibimbap", flagColors: "white with red, blue, and black",
      climate: "dry mountain wind in autumn, the smell of grilling meat at night",
      fact: "a city where palaces and skyscrapers share a skyline",
      locations: {
        myeongdong: { name: "Myeongdong Streets", flavor: "Neon, K-pop, and the smell of toasted street toast. A vendor sings to her batter." },
        palace:     { name: "Palace Guard Change", flavor: "Drums and silk robes. The guards do not blink; their boots do not scuff." },
        noraebang:  { name: "Noraebang Booth", flavor: "A neon door, a tambourine. Down the hall, somebody is murdering a ballad." },
      }
    },
  },

  suspects: {
    vex:     { name: "Vesper 'Vex' Marlowe" },
    kestrel: { name: "Kestrel Onuoha" },
    moss:    { name: "Dr. Moss Kallio" },
    duarte:  { name: "Aurelio Duarte" },
    selene:  { name: "Selene Voss" },
    ravi:    { name: "Ravi 'The Magpie' Singh" },
    ines:    { name: "Inés Calatrava" },
    tomo:    { name: "Tomo 'Whisper' Hayashi" },
    magnus:  { name: "Magnus Bjornsson" },
    petra:   { name: "Petra Wolfe" },
  },

  traitValues: {
    hair: {
      "silver":      "silver hair",
      "black-braid": "a black braid",
      "ash-blond":   "ash-blond hair",
      "slick-jet":   "slick-back jet hair",
      "auburn-bob":  "an auburn bob",
      "salt-pepper": "salt-and-pepper hair",
      "platinum":    "platinum blonde hair",
      "shaved":      "a shaved head",
      "red-beard":   "a red beard",
      "white-pixie": "a white pixie cut",
    },
    build: {
      "tall":     "tall",
      "athletic": "athletic",
      "wiry":     "wiry",
      "stocky":   "stocky",
      "petite":   "petite",
      "lean":     "lean",
      "huge":     "huge",
    },
    mark: {
      "scar-left-cheek":     "a scar on the left cheek",
      "falcon-tattoo-wrist": "a tattoo of a falcon on the wrist",
      "round-glasses":       "small round glasses",
      "gold-tooth":          "a gold tooth",
      "freckles-nose":       "freckles across the nose",
      "right-leg-limp":      "a limp in the right leg",
      "beauty-mark-lip":     "a beauty mark above the lip",
      "koi-tattoo-forearm":  "a tattoo of a koi on the forearm",
      "broken-nose":         "a broken nose",
      "heterochromia":       "heterochromia (one blue eye, one brown)",
    },
    accessory: {
      "platinum-pocket-watch": "a platinum pocket watch",
      "leather-gloves":        "leather gloves",
      "fountain-pen":          "an antique fountain pen",
      "panama-hat":            "a panama hat",
      "jade-ring":             "a jade ring",
      "silk-scarf":            "a silk scarf",
      "ruby-earrings":         "ruby earrings",
      "black-wristband":       "a black wristband",
      "iron-signet":           "an iron signet ring",
      "silver-locket":         "a silver locket",
    },
    hobby: {
      "fencing":          "fencing",
      "falconry":         "falconry",
      "ornithology":      "ornithology",
      "jazz-piano":       "jazz piano",
      "rare-books":       "the rare-book trade",
      "sleight-of-hand":  "sleight of hand",
      "flamenco":         "flamenco dancing",
      "parkour":          "parkour",
      "open-water-swim":  "open-water swimming",
      "antique-maps":     "collecting antique maps",
    },
  },

  cases: {
    "C-001": {
      title: "The Bronze Falcon",
      loot: "the Bronze Falcon of Lisbon",
      lootLong: "the Bronze Falcon of Lisbon, a 16th-century navigational charm worth a small country",
      briefing:
        "Detective. The Bronze Falcon was lifted from a velvet case in Lisbon last night — no alarm, no broken glass, just an empty pedestal and a single black feather on the floor.\n\nWhoever did this is fast, and they're already moving. You have one week before this disappears into a private collection forever. Get to Lisbon. Find the trail. Bring them in.",
    },
    "C-002": {
      title: "The Whispering Score",
      loot: "the lost prelude",
      lootLong: "Rachmaninoff's lost prelude, a single handwritten manuscript thought destroyed in 1943",
      briefing:
        "A vault in Helsinki has been quietly emptied of one item. The cleaning staff thought the dust on the floor was a stain. It's a footprint. The score that nobody believed existed is in the wind.\n\nThe thief is musical — they couldn't help themselves. Witnesses at the airport say a man hummed it to the customs agent. Move.",
    },
    "C-003": {
      title: "The Glass Cobra",
      loot: "the Glass Cobra",
      lootLong: "the Glass Cobra of Jaipur, an emerald-fanged scepter on loan to a museum in Cape Town",
      briefing:
        "The Glass Cobra was on display behind three layers of laminated security glass. This morning the glass is intact and the case is empty. Either someone walked through walls, or the curator helped — and the curator has a perfect alibi.\n\nStart in Cape Town. Witnesses are talking; one of them is lying.",
    },
    "C-004": {
      title: "The Midnight Atlas",
      loot: "the Cantino Planisphere",
      lootLong: "the 1502 Cantino Planisphere, a map so accurate for its age that nations once killed for it",
      briefing:
        "The Cantino is gone. The case in Lisbon registers as locked and undisturbed; the map inside is a forgery printed on aged paper. The original walked out sometime in the last seventy-two hours.\n\nThis is a collector's crime. Whoever has it loves maps a little too much. Start at the source.",
    },
    "C-005": {
      title: "The Saffron Tiara",
      loot: "the Saffron Tiara",
      lootLong: "a Mughal tiara of seven saffron-colored sapphires, last worn in 1707",
      briefing:
        "The Saffron Tiara was stolen from a hotel safe in Mumbai during a private viewing. The cameras caught nothing but a woman laughing in a doorway, and then the lights went out.\n\nShe likes attention. She'll perform somewhere along the trail. Don't let her get to the buyer.",
    },
  },

  clues: {
    dest: {
      currency: [
        (c) => `The teller said the suspect changed a thick stack of bills for ${c.currency}. "Strange request, this time of year."`,
        (c) => `A receipt left on the counter is denominated in ${c.currency}. The ink is barely dry.`,
        (c) => `Somebody overheard them muttering about the exchange rate on the ${c.currency}.`,
      ],
      language: [
        (c) => `The waiter remembered them asking for the bill in ${c.language}. Polite, but with a foreign tongue.`,
        (c) => `A torn napkin has a phone number and a scribbled phrase — it's ${c.language}.`,
        (c) => `They were practicing ${c.language} on the bus, the conductor says.`,
      ],
      landmark: [
        (c) => `The witness saw them buying a postcard of ${c.landmark}. Smiling, like they were going home.`,
        (c) => `A travel guide tucked under their arm was open to the page on ${c.landmark}.`,
        (c) => `They asked the cabbie how far to ${c.landmark}. Twice.`,
      ],
      food: [
        (c) => `The chef remembered them ordering ${c.food} like a regular. "Knew exactly how to eat it, too."`,
        (c) => `A receipt for ${c.food}, paid in cash. Generous tip.`,
        (c) => `They smelled of ${c.food}, the doorman swore. "Couldn't miss it."`,
      ],
      flagColors: [
        (c) => `Pinned to their lapel: a small enamel flag — ${c.flagColors}.`,
        (c) => `They were carrying a souvenir keychain, ${c.flagColors}. Cheap, but specific.`,
        (c) => `A sticker on their suitcase showed a flag in ${c.flagColors}.`,
      ],
      climate: [
        (c) => `They were dressed completely wrong for here. Said they were heading somewhere with ${c.climate}.`,
        (c) => `"They complained about the local weather," the porter said. "Looking forward to ${c.climate}, apparently."`,
        (c) => `Their bag was packed for ${c.climate}. The porter peeked.`,
      ],
      fact: [
        (c) => `The bookshop clerk says they bought a single book — a history of ${c.fact}.`,
        (c) => `They were boasting at the bar about a city that is ${c.fact}.`,
        (c) => `A diary page abandoned on the train: a single underlined note about ${c.fact}.`,
      ],
    },
    trait: {
      hair: [
        (v) => `The witness remembers ${v} more than the face.`,
        (v) => `A security camera caught the suspect from behind — ${v}, unmistakable.`,
        (v) => `"You couldn't miss the ${v}," the bartender said.`,
      ],
      build: [
        (v) => `The doorman described them as ${v}.`,
        (v) => `"${capitalize(v)} build," the porter said. "Moved like they knew it."`,
        (v) => `Footage shows someone ${v} ducking under the camera.`,
      ],
      mark: [
        (v) => `The witness can't stop talking about a detail: ${v}.`,
        (v) => `A maid found a discarded handkerchief and remembers — ${v}, plain as day.`,
        (v) => `An old photograph in the case file is dog-eared on the same spot every time: ${v}.`,
      ],
      accessory: [
        (v) => `Whoever it was, they were wearing ${v}.`,
        (v) => `The pawnbroker says they tried to sell ${v}. He didn't bite.`,
        (v) => `The desk clerk noticed ${v} — "expensive, but worn like they didn't care."`,
      ],
      hobby: [
        (v) => `Talk in the area is they're known for ${v}.`,
        (v) => `A regular at the club mentions someone who shows up for ${v}.`,
        (v) => `"Asked about local clubs for ${v}," the concierge volunteers.`,
      ],
    },
    junk: [
      "Nothing here. The walk back will give you time to think.",
      "A waste of an hour. The trail is going cold somewhere else.",
      "The proprietor wouldn't meet your eyes — but only because he owes someone money. Not your problem today.",
      "You watch the door for a while. Nobody comes in. You leave.",
      "A child asks if you're a real detective. You say yes. She asks for proof. You leave.",
    ],
    deadEnd: [
      "Nobody matching your description has been through here. The trail isn't this way.",
      "The locals are friendly but unhelpful. Wrong city, detective.",
      "You spend an hour asking. Nothing. The suspect never came here.",
    ],
  },
};
