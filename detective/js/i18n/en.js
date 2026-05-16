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

    // Suspect-match counter shown in the dossier.
    matchAll: (n) => `${n} suspects on file. Collect traits to narrow it down.`,
    matchN: (n, total) => `${n} of ${total} suspects still match the evidence.`,
    matchOne: `Only one suspect fits — close them down.`,
    matchZero: `No suspect fits your evidence. A witness gave you a bum steer somewhere.`,
    moLabel: `MO:`,
    traitFrom: (locName, cityName) => `from ${locName}, ${cityName}`,

    // Crimnet briefing header (typewriter banner above the chief's words).
    crimnetHeader: (id) => `// CRIMNET BRIEFING — CASE ${id} — 06:42 GMT //`,
    crimnetClassified: `// CLASSIFIED · ACME DETECTIVE AGENCY · EYES ONLY //`,
    arrivedIn: "ARRIVED IN",

    // Map-side panel hooks.
    openNotebook: "DETECTIVE'S NOTEBOOK",
    openAlmanac: "CRIME LAB ALMANAC",
    notebookTitle: "DETECTIVE'S NOTEBOOK",
    almanacTitle: "CRIME LAB ALMANAC",
    notebookEmpty: "Your notebook is blank. Visit a city — the local language, currency, and customs will write themselves in.",
    notebookNoFacts: "Nothing recorded for this city yet.",
    notebookVisited: "VISITED CITIES",
    notebookHinted: "TRAIL OF BREADCRUMBS",
    notebookLeadHeader: "AN UNNAMED LEAD",
    notebookLeadHint: "Each lead below is a destination a witness gave you, but you haven't been there yet. Take the facts to the Crime Lab Almanac — search by currency, language, flag, food, or landmark — and the city will give itself up.",
    closeNotebook: "← CLOSE NOTEBOOK",
    closeAlmanac: "← CLOSE ALMANAC",
    almanacCost: (h) => `Querying the Crime Lab costs ${h}h. Continue?`,
    almanacSearchPlaceholder: "search currency, language, flag, food, landmark…",
    almanacTally: (n) => `${n} cities match.`,

    factLabel: {
      language: "Language",
      currency: "Currency",
      flagColors: "Flag",
      landmark: "Landmark",
      food: "Local dish",
      climate: "Climate",
      fact: "Notable",
    },
    continentLabel: {
      all: "ALL", europe: "EUROPE", africa: "AFRICA", asia: "ASIA",
      oceania: "OCEANIA", namerica: "N. AMERICA", samerica: "S. AMERICA",
    },
    almanacCol: {
      city: "City", currency: "Currency", language: "Language",
      flagColors: "Flag", landmark: "Landmark", food: "Local dish",
    },

    // Location specialty hint label, shown on each location card.
    specialtyLabel: "Tends to know:",
    specialty: {
      money:    "currency & flag",
      language: "language & flag",
      food:     "food & language",
      history:  "landmark & history",
      climate:  "climate & weather",
      culture:  "hobbies & accessories",
      people:   "appearance & marks",
      transit:  "where they were headed",
    },

    // V.I.L.E. ladder on the case-select screen.
    careerHeader: "CAREER FILE",
    careerCasesClosed: (n) => `${n} case${n === 1 ? "" : "s"} closed`,
    careerRank: "Rank",
    caseLocked: "LOCKED",
    caseLockedWhy: (n) => `Close ${n} other case${n === 1 ? "" : "s"} to unlock.`,
    caseDone: "✓ CLOSED",
    caseFresh: "OPEN",
    btnResetCareer: "RESET CAREER",
    confirmResetCareer: "Wipe your career file and start over from Rookie?",

    // Doc-check trivia gate (after a win, before promotion).
    triviaTitle: "DOC CHECK",
    triviaIntro: "The chief drops a manila folder on your desk. \"Before I promote you — one question. You've been there, you should know this.\"",
    triviaPrompt: {
      currency:   (v) => `Which city uses ${v} as its currency?`,
      language:   (v) => `In which city would you hear ${v} on the street?`,
      flagColors: (v) => `Which city flies a flag of ${v}?`,
      landmark:   (v) => `Which city is famous for ${v}?`,
      food:       (v) => `Where would a chef set down a plate of ${v}?`,
    },
    triviaCorrect: "Correct. Step up, detective — promoted.",
    triviaWrong: (c) => `Close. The answer was ${c}. The promotion can wait — finish another case and we'll talk.`,
    triviaContinue: "CONTINUE",

    // Soft warrant deny when 0 suspects match (player kept clicking the
    // dossier and somehow chose an eliminated face — should not normally
    // happen, but covered).
    noMatchWarrant: "Your evidence is contradictory — no suspect on file matches all of your traits. Check your Detective's Notebook and the witnesses you have.",
  },

  ranks: {
    rookie:       "ROOKIE",
    detective:    "DETECTIVE",
    inspector:    "INSPECTOR",
    superSleuth:  "SUPER SLEUTH",
    ace:          "ACE DETECTIVE",
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
      fact: "a red-walled city whose dye lent its name to a color",
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
      language: "Hindi and Marathi", currency: "rupees", landmark: "a great basalt arch on the harbour",
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
      language: "Japanese", currency: "yen", landmark: "a red-and-white steel tower over the skyline",
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
      language: "Finnish", currency: "euros", landmark: "the white cathedral on Senate Square",
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
      language: "English (with Scots flavor)", currency: "pounds sterling", landmark: "a castle perched on a volcanic crag",
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
    rio: {
      name: "Rio de Janeiro", country: "Brazil",
      language: "Portuguese", currency: "reais", landmark: "Christ the Redeemer atop Corcovado",
      food: "feijoada and pão de queijo", flagColors: "green and yellow with a blue celestial sphere",
      climate: "humid tropical heat with salt off the Atlantic",
      fact: "the city that hosts the largest carnival on Earth",
      locations: {
        copacabana: { name: "Copacabana Promenade", flavor: "The Portuguese pavement curls like a wave. Bronze tourists, lifeguards, and a vendor selling caipirinhas." },
        escadaria:  { name: "Escadaria Selarón", flavor: "Two hundred-odd steps of tile from every country anyone ever sent. A painter pretends not to listen." },
        samba:      { name: "Samba School Rehearsal", flavor: "A drum line shakes the corrugated roof. A dancer in feathers ties her shoe and watches you." },
      }
    },
    athens: {
      name: "Athens", country: "Greece",
      language: "Greek", currency: "euros", landmark: "the Acropolis",
      food: "souvlaki and moussaka", flagColors: "blue and white with a cross",
      climate: "dry Mediterranean heat and Aegean wind",
      fact: "the city often called the birthplace of democracy",
      locations: {
        acropolis: { name: "Acropolis Slope", flavor: "Marble blocks the size of bathtubs. A guard mutters into a radio and watches the cats." },
        plaka:     { name: "Plaka Tavernas", flavor: "Grape leaves and grilled lemon. A bouzouki plays in the next courtyard. Someone slaps a backgammon piece." },
        piraeus:   { name: "Port of Piraeus", flavor: "Ferries pile up against the dock like dominoes. A purser checks a manifest twice and frowns." },
      }
    },
    nairobi: {
      name: "Nairobi", country: "Kenya",
      language: "Swahili and English", currency: "Kenyan shillings", landmark: "the savannah on the city's edge",
      food: "nyama choma and ugali", flagColors: "black, red, and green with white stripes",
      climate: "cool highland air at over 1,700 meters",
      fact: "the only major capital with wild giraffes and rhinos inside the city limits",
      locations: {
        market: { name: "Maasai Market", flavor: "Beadwork in rows like a paint chart. A trader compares your watch to the sun and smiles." },
        park:   { name: "National Park Gate", flavor: "Acacias on a horizon. A ranger checks a license; somewhere, a giraffe is unbothered." },
        karen:  { name: "Karen Blixen House", flavor: "Wooden floors and old books. The curator dusts a clock that hasn't moved since 1931." },
      }
    },
    hanoi: {
      name: "Hanoi", country: "Vietnam",
      language: "Vietnamese", currency: "đồng", landmark: "Hoàn Kiếm Lake and the Old Quarter",
      food: "phở and bánh mì", flagColors: "red with a yellow star",
      climate: "hot and humid monsoon air thick with motorbike smoke",
      fact: "a thousand-year-old capital built around a lake said to hide a golden turtle",
      locations: {
        quarter: { name: "Old Quarter Streets", flavor: "Thirty-six guild streets, one for each thing a city ever needed. A pho vendor stirs and watches you." },
        lake:    { name: "Hoàn Kiếm Lake", flavor: "Red bridge, green water. A retiree practices tai chi as if alone. The fishermen know better." },
        bridge:  { name: "Long Biên Bridge", flavor: "Iron held together by century-old rivets. Trains rattle past. The river runs the color of strong tea." },
      }
    },
    auckland: {
      name: "Auckland", country: "New Zealand",
      language: "English and Māori", currency: "New Zealand dollars", landmark: "the Sky Tower",
      food: "pavlova and green-lipped mussels", flagColors: "blue with the Union Jack and the Southern Cross",
      climate: "mild Pacific breeze with sudden showers",
      fact: "a city of sails built on top of 48 dormant volcanic cones",
      locations: {
        viaduct: { name: "Viaduct Harbour", flavor: "Yachts in tidy rows. A skipper is coiling rope with the precision of a watchmaker." },
        mteden:  { name: "Mount Eden Crater", flavor: "A grass-bowl crater the size of a stadium, in the middle of the city. The wind never stops." },
        kroad:   { name: "Karangahape Road", flavor: "Vintage neon and a bakery that's been here longer than the country. Someone is busking with a ukulele." },
      }
    },
  },

  suspects: {
    vex:        { name: "Vesper 'Vex' Marlowe",       signature: "leaves a single playing card — always the Jack of Spades." },
    kestrel:    { name: "Kestrel Onuoha",              signature: "drops one black feather where the alarm should be." },
    moss:       { name: "Dr. Moss Kallio",             signature: "ink-blot left on the glass — like a thumbprint, but read it sideways." },
    duarte:     { name: "Aurelio Duarte",              signature: "hums the same eight bars all the way to the airport." },
    selene:     { name: "Selene Voss",                 signature: "exits clean — not a hair, not a print, just a quiet vault." },
    ravi:       { name: "Ravi 'The Magpie' Singh",     signature: "swaps the prize for a coin worth a fraction of it." },
    ines:       { name: "Inés Calatrava",              signature: "scatters rose petals on the floor. She wants you to know." },
    tomo:       { name: "Tomo 'Whisper' Hayashi",      signature: "no trace at all — until the next city, where they were already seen." },
    magnus:     { name: "Magnus Bjornsson",            signature: "bends the bars or breaks the lock; never picks it." },
    petra:      { name: "Petra Wolfe",                 signature: "tears off one corner of an old map and pins it to the door." },
    carmela:    { name: "Carmela 'La Serpiente' Reyes",signature: "leaves a curl of dried snakeskin tucked into the lock." },
    stavros:    { name: "Stavros Helios",              signature: "leaves a single dried olive leaf where the prize sat." },
    mariana:    { name: "Mariana Cordeiro",            signature: "the guards spend the rest of the night humming a samba they cannot place." },
    amara:      { name: "Amara 'Tigress' Okeke",       signature: "three parallel scratches across the case glass — a claw mark." },
    konstantin: { name: "Konstantin 'Eclipse' Volkov", signature: "one window left fogged with winter breath, even on a summer night." },
  },

  // Bucket-level descriptions — what a witness can describe. Multiple
  // suspects share each bucket so a single trait clue narrows the dossier
  // from 15 to ~3-5, never to 1.
  traitValues: {
    hair: {
      "silver": "silver or salt-and-pepper hair",
      "dark":   "dark hair",
      "light":  "very fair, almost platinum hair",
      "red":    "red or auburn hair",
    },
    build: {
      "tall":     "a tall build",
      "athletic": "an athletic build",
      "compact":  "a small, compact build",
    },
    mark: {
      "scar":    "a visible scar",
      "tattoo":  "a tattoo on a visible spot",
      "eyewear": "glasses, or something unusual about the eyes",
      "facial":  "a striking detail on the face",
      "injury":  "an old injury — a limp, a broken nose, or a bad mend",
    },
    accessory: {
      "trinket":  "an old metal trinket — a watch, signet, pen, or locket",
      "jewelry":  "showy jewelry — rings, earrings, or chains",
      "clothing": "a distinctive piece of clothing — a hat, gloves, or a scarf",
    },
    hobby: {
      "stunts":      "athletic stunts — fencing, parkour, or stage daring",
      "birds":       "an obsession with birds",
      "performance": "performing arts — music, dance, or stagecraft",
      "collecting":  "collecting old books, maps, or coins",
      "water":       "long-distance open-water swimming",
    },
  },

  // Per-suspect vivid descriptions — what the FILE on each suspect says.
  // Shown in the dossier so two suspects in the same trait bucket still
  // read as distinct individuals.
  suspectTraits: {
    vex:        { hair: "silver hair, swept straight back", build: "tall and angular", mark: "a scar across the left cheek", accessory: "a platinum pocket watch on a long chain", hobby: "competitive fencing" },
    kestrel:    { hair: "a long, sleek black braid",        build: "an athlete's build", mark: "a tattoo of a falcon on the wrist", accessory: "soft leather gloves, always", hobby: "falconry" },
    moss:       { hair: "thin ash-blond hair",              build: "wiry and small", mark: "small round wire-rim glasses", accessory: "an antique fountain pen clipped inside the jacket", hobby: "ornithology" },
    duarte:     { hair: "slick-back jet-black hair",        build: "athletic but stocky", mark: "one gold tooth that catches the light", accessory: "a cream panama hat", hobby: "jazz piano" },
    selene:     { hair: "an auburn bob",                    build: "petite, almost dancer-small", mark: "freckles scattered across the bridge of the nose", accessory: "a heavy jade ring", hobby: "the rare-book trade" },
    ravi:       { hair: "salt-and-pepper hair tied back",   build: "lean and quick", mark: "a slight limp in the right leg", accessory: "a violet silk scarf", hobby: "sleight of hand at the card table" },
    ines:       { hair: "platinum blonde, almost white",    build: "tall and statuesque", mark: "a beauty mark above the upper lip", accessory: "deep ruby earrings", hobby: "flamenco dancing" },
    tomo:       { hair: "a shaved head, dark stubble",      build: "compact and wiry", mark: "a tattoo of a koi on the forearm", accessory: "a black canvas wristband", hobby: "parkour" },
    magnus:     { hair: "a thick red beard going grey",     build: "huge — built like a barrel", mark: "a broken nose, badly reset", accessory: "an iron signet ring", hobby: "open-water swimming" },
    petra:      { hair: "a white pixie cut",                build: "petite, light on the feet", mark: "heterochromia — one eye blue, one brown", accessory: "a small silver locket", hobby: "collecting antique maps" },
    carmela:    { hair: "long dark hair, raven-glossy",     build: "small and quick", mark: "a faint snakebite-scar beside the lip", accessory: "a pair of curved gold hoops", hobby: "knife throwing as a stage act" },
    stavros:    { hair: "silver hair worn very long",       build: "athletic and squared at the shoulders", mark: "thick reading glasses on a chain", accessory: "a worn olivewood smoking pipe", hobby: "collecting Byzantine coins" },
    mariana:    { hair: "a tumble of red-auburn curls",     build: "athletic and rhythmic", mark: "a flame tattoo curling up the collarbone", accessory: "a thin gold ankle chain", hobby: "samba and stage performance" },
    amara:      { hair: "dark braids piled into a crown",   build: "tall, with a hunter's posture", mark: "a long thin scar running down the forearm", accessory: "stacked amber bracelets at one wrist", hobby: "tracking and falconry" },
    konstantin: { hair: "pale ash-blond, cut short",        build: "tall and lean", mark: "a small straight scar at the temple", accessory: "a tailored charcoal overcoat", hobby: "long-distance open-water swimming" },
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
    "C-006": {
      title: "The Pearl of the Andes",
      loot: "the Tupac Inca Pearl",
      lootLong: "the Tupac Inca Pearl — a fist-sized black pearl pulled from a sunken Spanish galleon and locked in Lima for four centuries",
      briefing:
        "Detective. The Tupac Inca Pearl was on temporary display in Lima for the feast of San Pedro. Half the city was in the street and the other half was in the cathedral. Nobody was in the gallery — except for one person, and now the case is empty.\n\nThe glass is intact. The alarm logged nothing. On the marble floor of the gallery, somebody left a single playing card face-up. Bring the chief the pearl. And the card-player too.",
    },
    "C-007": {
      title: "The Last Train Robbery",
      loot: "the Conductor's Brass Watch",
      lootLong: "the Conductor's Brass Watch from the original Orient Express — engraved by a vanished Genevan house and worth more than the carriage it once rode in",
      briefing:
        "An hour before the museum opened in Istanbul, someone walked into a sealed wagon-lit that has not moved in sixty years, and walked out with a brass pocket watch the size of an apple. Whoever it was knew exactly which sleeper compartment, and exactly which loose panel.\n\nThey left a copper coin where the watch sat. Wrong weight. Wrong era. A magpie's joke.",
    },
    "C-008": {
      title: "Crown of Eight Empires",
      loot: "the Hanseatic Circlet",
      lootLong: "the Hanseatic Circlet — eight thin bands of silver, gold, and iron braided together by a Baltic prince who governed eight ports and trusted none of them",
      briefing:
        "This one we've been chasing for years.\n\nThe Hanseatic Circlet vanished from a Helsinki vault overnight. Nothing was forced — but a bar of the inner gate was bent like a stalk of wheat, and that bar is two inches of cold-rolled steel. There is exactly one person in our files who could do that.\n\nThis is the final V.I.L.E. operative still in the wind. The trail is long, the loot is heavy, and the suspect is bigger than the door. Bring it home.",
    },
    "C-009": {
      title: "The Cariocan Caper",
      loot: "the Emerald of Tijuca",
      lootLong: "the Emerald of Tijuca — a cabochon the size of a hen's egg, cut in the seventeenth century and reset for a Brazilian empress's tiara",
      briefing:
        "Detective. The Emerald of Tijuca was on display for one night at the Carnival gala in Rio. Half the city was dancing in the street and the other half was at the gala — until the lights cut, the samba kept going, and the case was empty when the lights came back on.\n\nThe only thing on the empty velvet was the smell of jasmine perfume and the rhythm of a tune the witnesses can't stop humming. She danced her way out. Catch her before she dances her way to a buyer.",
    },
    "C-010": {
      title: "The Frozen Window",
      loot: "the Iron Cross of the Hansards",
      lootLong: "the Iron Cross of the Hansards — a small iron-and-amber pendant carried by a Baltic merchant who, legend says, never lost a ship",
      briefing:
        "Helsinki. A locked vault, second sub-basement, no signs of forced entry. The only thing wrong: a window in the corridor outside, fogged over with the breath of someone exhaling in a hot room. Outside, it was 24°C and the window was on the inside of the wall.\n\nWe have a name. We've had it for years. He moves slow, he plans long, and his trail runs eastward through some places this bureau has never had to file before. Pack a heavier coat than you'd think.",
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
