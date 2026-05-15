// City database. x/y are positions on a 1000x500 SVG viewBox.
// language/currency/landmark/food/flagColors/climate are used by clue templates.
// locations are the 3 places the player can investigate in each city.

export const CITIES = {
  lisbon: {
    id: "lisbon", name: "Lisbon", country: "Portugal",
    x: 463, y: 215,
    language: "Portuguese", currency: "euro", landmark: "Belém Tower",
    food: "salt cod and custard tarts", flagColors: "green and red",
    climate: "warm Atlantic breeze",
    fact: "the westernmost capital of mainland Europe",
    locations: [
      { id: "docks", name: "Old Docks", cost: 3, flavor: "Gulls scream over creaking ropes. A fisherman is mending a net and pretending not to notice you." },
      { id: "trampark", name: "Tram 28 Stop", cost: 2, flavor: "Yellow trams clatter past tiled facades. A busker eyes your badge." },
      { id: "fado", name: "Fado Bar", cost: 4, flavor: "A guitarist tunes up. The bartender pours something dark and asks no questions." }
    ]
  },
  reykjavik: {
    id: "reykjavik", name: "Reykjavik", country: "Iceland",
    x: 488, y: 95,
    language: "Icelandic", currency: "króna", landmark: "Hallgrímskirkja",
    food: "fermented shark and rye bread", flagColors: "blue, white, and red",
    climate: "cold, with the smell of sulphur on the wind",
    fact: "the northernmost capital of any sovereign state",
    locations: [
      { id: "harbor", name: "Old Harbor", cost: 3, flavor: "Fishing trawlers groan against the dock. Steam rises somewhere inland." },
      { id: "spa", name: "Geothermal Spa", cost: 4, flavor: "Tourists drift in milky water. A masseuse hums a tune you don't recognize." },
      { id: "embassy", name: "Tiny Consulate", cost: 2, flavor: "A bored attaché stamps something. The radiator ticks loudly." }
    ]
  },
  cairo: {
    id: "cairo", name: "Cairo", country: "Egypt",
    x: 596, y: 240,
    language: "Arabic", currency: "pound", landmark: "Pyramids of Giza",
    food: "ful medames and koshari", flagColors: "red, white, and black",
    climate: "dry desert heat",
    fact: "home to the oldest of the Seven Wonders still standing",
    locations: [
      { id: "souq", name: "Khan el-Khalili Souq", cost: 3, flavor: "Spice carts and copper lamps. A merchant offers tea like it's a contract." },
      { id: "museum", name: "Antiquities Museum", cost: 4, flavor: "A curator straightens a glass case. One of the displays is suspiciously empty." },
      { id: "felucca", name: "Nile Felucca Dock", cost: 2, flavor: "A boatman polishes a brass cleat. The river smells like silt and diesel." }
    ]
  },
  marrakech: {
    id: "marrakech", name: "Marrakech", country: "Morocco",
    x: 472, y: 250,
    language: "Arabic", currency: "dirham", landmark: "Jemaa el-Fnaa square",
    food: "tagine and mint tea", flagColors: "red with a green star",
    climate: "dry and hot, with the smell of orange blossoms",
    fact: "the city the dye 'morocco red' is named after",
    locations: [
      { id: "souk", name: "Tanneries Souk", cost: 3, flavor: "Pools of dye the color of a bruise. Your eyes water; the workers smile." },
      { id: "riad", name: "Hidden Riad", cost: 3, flavor: "A door in a wall opens onto a courtyard of citrus trees. The proprietor watches a fountain." },
      { id: "snake", name: "Snake Charmer's Pitch", cost: 2, flavor: "A reed pipe whines. The cobra is unimpressed; the charmer is not." }
    ]
  },
  capetown: {
    id: "capetown", name: "Cape Town", country: "South Africa",
    x: 575, y: 410,
    language: "English and Afrikaans", currency: "rand", landmark: "Table Mountain",
    food: "bobotie and rooibos tea", flagColors: "green, gold, black, blue, and red",
    climate: "fresh Atlantic wind off two oceans",
    fact: "perched between two oceans at the foot of a flat-topped mountain",
    locations: [
      { id: "waterfront", name: "V&A Waterfront", cost: 3, flavor: "A seal barks at a tourist. A cruise ship moans. Wind tugs at your collar." },
      { id: "cableway", name: "Cable Car Station", cost: 4, flavor: "Cars sway out into the mist. The operator hums something local." },
      { id: "bookshop", name: "Antique Bookshop", cost: 2, flavor: "Dust motes drift through afternoon sun. The owner is reading by lamp." }
    ]
  },
  istanbul: {
    id: "istanbul", name: "Istanbul", country: "Türkiye",
    x: 588, y: 195,
    language: "Turkish", currency: "lira", landmark: "Hagia Sophia",
    food: "köfte and Turkish coffee", flagColors: "red with a white crescent",
    climate: "salt air from two seas",
    fact: "the only city in the world straddling two continents",
    locations: [
      { id: "bazaar", name: "Grand Bazaar", cost: 4, flavor: "A carpet vendor unrolls a kilim like he's casting a spell. Somewhere, a teaspoon clinks." },
      { id: "ferry", name: "Bosphorus Ferry", cost: 2, flavor: "Gulls follow the wake. A schoolboy throws bread and counts. The wind is sharp." },
      { id: "cistern", name: "Sunken Cistern", cost: 3, flavor: "Columns rise from black water. Carp slip between them. Drips echo." }
    ]
  },
  mumbai: {
    id: "mumbai", name: "Mumbai", country: "India",
    x: 720, y: 260,
    language: "Hindi and Marathi", currency: "rupee", landmark: "Gateway of India",
    food: "vada pav and bombay duck", flagColors: "saffron, white, and green",
    climate: "humid monsoon air, thick with the smell of the sea",
    fact: "the largest film industry in the world by output is here",
    locations: [
      { id: "dabbawalas", name: "Dabbawala Stand", cost: 2, flavor: "Tiffin tins clatter onto bicycles. A man checks a code that means nothing to you." },
      { id: "studio", name: "Film Studio Lot", cost: 4, flavor: "A dance number rehearses past you. Someone shouts about lighting." },
      { id: "promenade", name: "Marine Drive", cost: 3, flavor: "The 'Queen's Necklace' arcs along the bay. A coconut vendor watches you like a chess clock." }
    ]
  },
  bangkok: {
    id: "bangkok", name: "Bangkok", country: "Thailand",
    x: 820, y: 270,
    language: "Thai", currency: "baht", landmark: "Wat Arun",
    food: "pad thai and tom yum", flagColors: "red, white, and blue",
    climate: "humid heat with the smell of chili and lemongrass",
    fact: "the city's full ceremonial name is the longest in the world",
    locations: [
      { id: "klong", name: "Klong Canal Pier", cost: 3, flavor: "A longtail boat coughs to life. The pilot wears a kerchief and a grin." },
      { id: "market", name: "Floating Market", cost: 3, flavor: "Boats jam the canal. Someone fries garlic; everyone wants ten baht more." },
      { id: "temple", name: "Wat Arun Temple", cost: 4, flavor: "Porcelain glints in the heat. A monk sweeps the same step twice." }
    ]
  },
  tokyo: {
    id: "tokyo", name: "Tokyo", country: "Japan",
    x: 900, y: 200,
    language: "Japanese", currency: "yen", landmark: "Tokyo Tower",
    food: "sushi and ramen", flagColors: "white with a red disc",
    climate: "crisp autumn air with the smell of grilled eel",
    fact: "home to more Michelin-starred restaurants than any other city",
    locations: [
      { id: "crossing", name: "Shibuya Crossing", cost: 3, flavor: "A tidal wave of pedestrians collides at the green light. Neon hums overhead." },
      { id: "shrine", name: "Meiji Shrine", cost: 4, flavor: "Gravel crunches under wooden gates. The forest in the city is somehow silent." },
      { id: "izakaya", name: "Backstreet Izakaya", cost: 2, flavor: "Smoke from yakitori. A salaryman laughs too loud. The chef nods at you." }
    ]
  },
  sydney: {
    id: "sydney", name: "Sydney", country: "Australia",
    x: 905, y: 405,
    language: "English", currency: "Australian dollar", landmark: "Opera House",
    food: "meat pies and flat whites", flagColors: "blue with the Union Jack and Southern Cross",
    climate: "bright sun and salt spray",
    fact: "its harbor bridge is nicknamed 'the Coathanger'",
    locations: [
      { id: "wharf", name: "Circular Quay", cost: 3, flavor: "A ferry blasts its horn. A busker plays didgeridoo to a small, polite crowd." },
      { id: "bondi", name: "Bondi Beach", cost: 3, flavor: "Surfers wax boards. A lifeguard squints at the horizon like he's reading mail." },
      { id: "opera", name: "Opera House Steps", cost: 4, flavor: "Tour groups photograph the sails. Inside, an orchestra is tuning, faintly." }
    ]
  },
  lima: {
    id: "lima", name: "Lima", country: "Peru",
    x: 290, y: 350,
    language: "Spanish", currency: "sol", landmark: "Plaza Mayor",
    food: "ceviche and lomo saltado", flagColors: "red and white",
    climate: "cool Pacific mist that locals call 'la garúa'",
    fact: "the Pacific coast city that ate the Inca trail's southern end",
    locations: [
      { id: "plaza", name: "Plaza Mayor", cost: 3, flavor: "Soldiers in scarlet pace the cathedral steps. A pigeon ruins someone's photograph." },
      { id: "mercado", name: "Mercado Central", cost: 2, flavor: "Stacks of yellow ají peppers; the air bites your throat. A vendor is haggling in Quechua." },
      { id: "barranco", name: "Barranco Art District", cost: 4, flavor: "A mural the size of a building. A gallery owner is locking up — or pretending to." }
    ]
  },
  mexicocity: {
    id: "mexicocity", name: "Mexico City", country: "Mexico",
    x: 215, y: 270,
    language: "Spanish", currency: "peso", landmark: "Zócalo",
    food: "tacos al pastor and mole", flagColors: "green, white, and red",
    climate: "thin highland air, the sun closer than expected",
    fact: "built on a drained lake bed at over 2,000 meters elevation",
    locations: [
      { id: "zocalo", name: "Zócalo Plaza", cost: 3, flavor: "A flag the size of a house ripples overhead. A child sells fried grasshoppers." },
      { id: "xochimilco", name: "Xochimilco Canals", cost: 4, flavor: "Painted trajineras drift past floating gardens. A mariachi boat pulls alongside." },
      { id: "lucha", name: "Lucha Libre Arena", cost: 3, flavor: "Masks for sale at the door. Somewhere inside, somebody hits the canvas hard." }
    ]
  },
  havana: {
    id: "havana", name: "Havana", country: "Cuba",
    x: 235, y: 240,
    language: "Spanish", currency: "Cuban peso", landmark: "Malecón seawall",
    food: "ropa vieja and mojitos", flagColors: "red, white, and blue with a star",
    climate: "humid Caribbean heat and the smell of cigars",
    fact: "the city of vintage American cars frozen in time",
    locations: [
      { id: "malecon", name: "Malecón Seawall", cost: 2, flavor: "Waves break against the wall. A '57 Chevy idles, the driver smoking." },
      { id: "cigar", name: "Cigar Factory", cost: 3, flavor: "Rows of rollers; a reader reads the news aloud. Tobacco dust hangs in the light." },
      { id: "buenavista", name: "Music Club", cost: 4, flavor: "A trumpet line cuts through the smoke. The bandleader winks at no one in particular." }
    ]
  },
  helsinki: {
    id: "helsinki", name: "Helsinki", country: "Finland",
    x: 565, y: 110,
    language: "Finnish", currency: "euro", landmark: "Helsinki Cathedral",
    food: "salmon soup and rye bread", flagColors: "white with a blue cross",
    climate: "cold Baltic air that turns your breath silver",
    fact: "the country that invented the sauna and the Moomins",
    locations: [
      { id: "market", name: "Market Square", cost: 2, flavor: "A reindeer pelt blows off a table. The vendor curses cheerfully." },
      { id: "sauna", name: "Public Sauna", cost: 3, flavor: "Steam hisses. A bather throws cold water and gasps. Nobody talks." },
      { id: "ferry", name: "Suomenlinna Ferry", cost: 3, flavor: "Gulls perch on the railing. A bell rings; the ice cracks somewhere distant." }
    ]
  },
  buenosaires: {
    id: "buenosaires", name: "Buenos Aires", country: "Argentina",
    x: 320, y: 415,
    language: "Spanish", currency: "Argentine peso", landmark: "Obelisco",
    food: "asado and dulce de leche", flagColors: "light blue and white with a sun",
    climate: "humid pampas air, warm as a hand on your shoulder",
    fact: "the birthplace of tango and the home of the world's widest avenue",
    locations: [
      { id: "milonga", name: "Tango Milonga", cost: 4, flavor: "Couples step in close geometry. Someone watches from a corner table." },
      { id: "boca", name: "La Boca Streets", cost: 3, flavor: "Houses painted every color a ship's leftover paint can be. A street tango pair pose for tips." },
      { id: "recoleta", name: "Recoleta Cemetery", cost: 3, flavor: "Marble angels and cats. A caretaker leans on a broom and waits for you to leave." }
    ]
  },
  vancouver: {
    id: "vancouver", name: "Vancouver", country: "Canada",
    x: 165, y: 165,
    language: "English", currency: "Canadian dollar", landmark: "Stanley Park",
    food: "salmon and poutine", flagColors: "red and white with a maple leaf",
    climate: "cool rainforest drizzle off the Pacific",
    fact: "a city of glass towers wedged between ocean and mountains",
    locations: [
      { id: "gastown", name: "Gastown Steam Clock", cost: 2, flavor: "The clock hisses on the hour. A barista watches you from a doorway." },
      { id: "granville", name: "Granville Island Market", cost: 3, flavor: "Crab on ice. A busker on a saw plays Vivaldi. Seagulls plot." },
      { id: "stanley", name: "Stanley Park Seawall", cost: 3, flavor: "A heron stalks a tide pool. Bike bells. Cedar in the air." }
    ]
  },
  edinburgh: {
    id: "edinburgh", name: "Edinburgh", country: "Scotland",
    x: 467, y: 145,
    language: "English (with Scots flavor)", currency: "pound sterling", landmark: "Edinburgh Castle",
    food: "haggis and shortbread", flagColors: "blue with a white saltire",
    climate: "wet wind off the North Sea, smelling of coal and gorse",
    fact: "a medieval old town piled on a volcanic crag",
    locations: [
      { id: "royal", name: "Royal Mile", cost: 3, flavor: "Bagpipes drift from a close. A woman in tartan sells tickets to nothing in particular." },
      { id: "vaults", name: "Underground Vaults", cost: 4, flavor: "Damp stone, a tour guide telling a ghost story she half-believes. The air is cold." },
      { id: "arthur", name: "Arthur's Seat Trail", cost: 3, flavor: "Wind, gorse, and a view that argues with you. A hiker is taking too many photos." }
    ]
  },
  seoul: {
    id: "seoul", name: "Seoul", country: "South Korea",
    x: 870, y: 195,
    language: "Korean", currency: "won", landmark: "Gyeongbokgung Palace",
    food: "kimchi and bibimbap", flagColors: "white with red, blue, and black",
    climate: "dry mountain wind in autumn, the smell of grilling meat at night",
    fact: "a city where palaces and skyscrapers share a skyline",
    locations: [
      { id: "myeongdong", name: "Myeongdong Streets", cost: 3, flavor: "Neon, K-pop, and the smell of toasted street toast. A vendor sings to her batter." },
      { id: "palace", name: "Palace Guard Change", cost: 4, flavor: "Drums and silk robes. The guards do not blink; their boots do not scuff." },
      { id: "noraebang", name: "Noraebang Booth", cost: 2, flavor: "A neon door, a tambourine. Down the hall, somebody is murdering a ballad." }
    ]
  },
};

// Stable list (used by clue generator for "alternative angles")
export const CITY_LIST = Object.values(CITIES);
