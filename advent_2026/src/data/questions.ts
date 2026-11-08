export interface Question {
  day: number;
  category: string;
  question: string;
  answer: string;
  acceptedAnswers: string[];
  incorrectOptions: string[];
  interestingFact: string;
}
export const questions: Question[] = [
  {
    day: 1,
    category: "Architecture",
    question:
      "Which architect designed the Guggenheim Museum in Bilbao, famous for its spectacular flowing titanium curves?",
    answer: "Gehry",
    acceptedAnswers: ["Frank Gehry", "Фрэнк Гери", "Гери"],
    incorrectOptions: ["Foster", "Hadid", "Piano"],
    interestingFact:
      "The Guggenheim Museum opened in Bilbao in 1997. Its shimmering titanium curves catch the changing light.",
  },
  {
    day: 2,
    category: "Russian art",
    question:
      "Which artist created the famous Black Square, challenging the traditional idea of what a painting should be?",
    answer: "Malevich",
    acceptedAnswers: [
      "Kazimir Malevich",
      "Malevitch",
      "Малевич",
      "Казимир Малевич",
    ],
    incorrectOptions: ["Kandinsky", "Chagall", "Repin"],
    interestingFact:
      "When Black Square was first exhibited in 1915, Malevich hung it high across a corner of the room—the place traditionally reserved for a religious icon in a Russian home.",
  },
  {
    day: 3,
    category: "Greek mythology",
    question:
      "Which Greek goddess of wisdom protects and guides Odysseus during his long journey home?",
    answer: "Athena",
    acceptedAnswers: ["Athene", "Афина", "Pallas Athena"],
    incorrectOptions: ["Hera", "Aphrodite", "Artemis"],
    interestingFact:
      "Athena does not always arrive looking like a goddess. In the Odyssey, she borrows the appearance of Mentor, an old family friend, to guide Odysseus’s son Telemachus.",
  },
  {
    day: 4,
    category: "Space and science",
    question:
      "Which is the largest planet in our Solar System, famous for its Great Red Spot, a giant storm that has lasted for centuries?",
    answer: "Jupiter",
    acceptedAnswers: ["Юпитер"],
    incorrectOptions: ["Saturn", "Mars", "Neptune"],
    interestingFact:
      "Jupiter spins once in about ten hours, giving it the shortest day of any planet in our Solar System. Even its largest moon, Ganymede, is bigger than the planet Mercury.",
  },
  {
    day: 5,
    category: "Classical music",
    question:
      "Imagine four violin concertos taking you through spring, summer, autumn and winter. Which composer wrote them?",
    answer: "Vivaldi",
    acceptedAnswers: ["Antonio Vivaldi", "Вивальди", "Антонио Вивальди"],
    incorrectOptions: ["Bach", "Handel", "Mozart"],
    interestingFact:
      "Vivaldi’s Four Seasons came with poems describing the scenes in the music. In Spring, the viola even plays the part of a barking dog beside a sleeping shepherd.",
  },
  {
    day: 6,
    category: "Christmas traditions",
    question:
      "Which saint is celebrated on 6 December in many European countries and helped inspire the modern figure of Santa Claus?",
    answer: "Nicholas",
    acceptedAnswers: [
      "Saint Nicholas",
      "St Nicholas",
      "Николай",
      "Святой Николай",
    ],
    incorrectOptions: ["Patrick", "George", "Andrew"],
    interestingFact:
      "In paintings, Saint Nicholas often carries three golden balls. They represent the bags of gold he secretly gave to three young women in a famous legend about his generosity.",
  },
  {
    day: 7,
    category: "Russian New Year cinema",
    question:
      "In the beloved film Ирония судьбы, или С лёгким паром!, which city does Zhenya accidentally fly to on New Year's Eve?",
    answer: "Leningrad",
    acceptedAnswers: [
      "Ленинград",
      "Petersburg",
      "St Petersburg",
      "Saint Petersburg",
      "Санкт-Петербург",
      "Петербург",
      "Питер",
    ],
    incorrectOptions: ["Moscow", "Riga", "Sochi"],
    interestingFact:
      "Nadya’s “Leningrad” apartment building in The Irony of Fate was actually filmed in Moscow. Her home and Zhenya’s were on the same avenue, at numbers 113 and 125.",
  },
  {
    day: 8,
    category: "Art history",
    question:
      "Two lovers wrapped in golden patterns stand together in a famous painting called The Kiss. Who painted it?",
    answer: "Klimt",
    acceptedAnswers: ["Gustav Klimt", "Климт", "Густав Климт"],
    incorrectOptions: ["Monet", "Munch", "Mucha"],
    interestingFact:
      "The Kiss does not shimmer with gold alone: Klimt also used silver and platinum leaf. Its precious surface changes as the light moves across it.",
  },
  {
    day: 9,
    category: "Yoga and philosophy",
    question:
      "In yoga philosophy, what Sanskrit word describes the vital life force, closely associated with the breath?",
    answer: "Prana",
    acceptedAnswers: ["Прана"],
    incorrectOptions: ["Mantra", "Asana", "Mudra"],
    interestingFact:
      "Yoga traditions describe prana as moving through five vayus, or “winds”. Each has a different role, from drawing energy inward to carrying it throughout the body.",
  },
  {
    day: 10,
    category: "London architecture",
    question:
      "London's distinctive skyscraper at 30 St Mary Axe is better known by which rather delicious nickname?",
    answer: "Gherkin",
    acceptedAnswers: ["The Gherkin"],
    incorrectOptions: ["Shard", "Cheesegrater", "Scalpel"],
    interestingFact:
      "Despite the Gherkin’s rounded shape, its exterior glass panels are flat. Just one curved piece crowns the very top: a lens-shaped pane 2.4 metres across.",
  },
  {
    day: 11,
    category: "European adventures",
    question:
      "Which European country is home to the fairy-tale Lake Bled, with a tiny island church in the middle and a medieval castle perched high above the water?",
    answer: "Slovenia",
    acceptedAnswers: ["Slovenija", "Словения"],
    incorrectOptions: ["Austria", "Switzerland", "Croatia"],
    interestingFact:
      "Bled Island’s church is reached by 99 stone steps. A local wedding tradition asks the groom to carry his bride up every one of them before they marry there.",
  },
  {
    day: 12,
    category: "Shakespeare and theatre",
    question:
      "In Shakespeare's Othello, in which beautiful Italian city, famous for its canals and gondolas, do Othello and Desdemona secretly marry?",
    answer: "Venice",
    acceptedAnswers: ["Venezia", "Венеция"],
    incorrectOptions: ["Florence", "Rome", "Verona"],
    interestingFact:
      "Venice is spread across 118 small islands. Its canals are the spaces between them, with bridges stitching the city together over the lagoon.",
  },
  {
    day: 13,
    category: "Visual arts",
    question:
      "Which Mexican artist became famous for her colourful self-portraits, often featuring flowers in her hair and animals beside her?",
    answer: "Kahlo",
    acceptedAnswers: ["Frida Kahlo", "Фрида Кало", "Кало"],
    incorrectOptions: ["Rivera", "O'Keeffe", "Carrington"],
    interestingFact:
      "Frida Kahlo had a mirror fitted beneath the canopy of her bed, allowing her to paint self-portraits while lying down. That bed can still be seen in her Blue House museum.",
  },
  {
    day: 14,
    category: "British Christmas history",
    question:
      "An 1848 picture of a royal family gathered around a decorated Christmas tree helped make the tradition fashionable in Britain. Which queen was in the picture?",
    answer: "Victoria",
    acceptedAnswers: ["Queen Victoria", "Виктория", "Королева Виктория"],
    incorrectOptions: ["Charlotte", "Elizabeth", "Anne"],
    interestingFact:
      "Victoria and Albert’s family exchanged presents on Christmas Eve, following German tradition. The royal family still follows that custom today.",
  },
  {
    day: 15,
    category: "Architecture",
    question:
      "Which famous American architect designed Fallingwater, an extraordinary house built directly above a waterfall, making the building feel like part of nature?",
    answer: "Wright",
    acceptedAnswers: [
      "Frank Lloyd Wright",
      "Frank Wright",
      "Фрэнк Ллойд Райт",
      "Райт",
    ],
    incorrectOptions: ["Gropius", "Aalto", "Neutra"],
    interestingFact:
      "A glass hatch in Fallingwater’s living room opens onto a staircase that descends towards Bear Run, the stream beneath the house.",
  },
  {
    day: 16,
    category: "British literature and cinema",
    question:
      "Which friendly bear arrived in London from Peru and received his name from a railway station?",
    answer: "Paddington",
    acceptedAnswers: ["Паддингтон"],
    incorrectOptions: ["Rupert", "Winnie", "Baloo"],
    interestingFact:
      "Paddington began with a real toy bear Michael Bond spotted alone on a Selfridges shelf on Christmas Eve in 1956. Bond bought it for his wife, and a story soon followed.",
  },
  {
    day: 17,
    category: "Japanese culture",
    question:
      "In Japan, the springtime tradition of hanami celebrates the beautiful blossoms of which tree?",
    answer: "Cherry",
    acceptedAnswers: ["Sakura", "Сакура", "Вишня"],
    incorrectOptions: ["Maple", "Pine", "Apple"],
    interestingFact:
      "Hanami was not always about cherry blossom. Early flower-viewing celebrations in Japan admired plum blossom; cherries became the best-known stars of the tradition later.",
  },
  {
    day: 18,
    category: "Natural wonders",
    question:
      "What is the name for the magical, colourful curtains of light that sometimes dance across the Arctic night sky?",
    answer: "Aurora",
    acceptedAnswers: [
      "Aurora Borealis",
      "Northern Lights",
      "Северное сияние",
      "Полярное сияние",
    ],
    incorrectOptions: ["Rainbow", "Eclipse", "Halo"],
    interestingFact:
      "The northern lights get their colours from different gases: oxygen glows green or red, while nitrogen can glow blue or purple. Even the height of the glowing gas changes the colours you see.",
  },
  {
    day: 19,
    category: "English literature",
    question:
      "Which British novelist created the witty Elizabeth Bennet, one of literature's most beloved heroines?",
    answer: "Austen",
    acceptedAnswers: ["Jane Austen", "Остин", "Джейн Остин"],
    incorrectOptions: ["Bronte", "Dickens", "Eliot"],
    interestingFact:
      "Austen first called Pride and Prejudice First Impressions. She began that early version around 1796, years before Elizabeth Bennet and Mr Darcy finally reached readers in 1813.",
  },
  {
    day: 20,
    category: "Archaeology and exploration",
    question:
      "Which ancient civilisation built the extraordinary mountain city of Machu Picchu in the Andes?",
    answer: "Inca",
    acceptedAnswers: ["Incas", "Инки", "Инка"],
    incorrectOptions: ["Maya", "Aztec", "Olmec"],
    interestingFact:
      "The Incas fitted the finest stone walls at Machu Picchu together without mortar. Each block was shaped to meet its neighbours, like pieces of an enormous stone puzzle.",
  },
  {
    day: 21,
    category: "New Year traditions",
    question:
      "Which country celebrates New Year's Eve with a tradition called Hogmanay, where the first person to enter a home after midnight is believed to bring good luck for the coming year?",
    answer: "Scotland",
    acceptedAnswers: ["Шотландия"],
    incorrectOptions: ["Ireland", "Wales", "Denmark"],
    interestingFact:
      "Christmas Day only became a public holiday in Scotland in 1958. At Hogmanay, a first-footer may bring shortbread or coal, wishing the household food and warmth for the year ahead.",
  },
  {
    day: 22,
    category: "Musical theatre",
    question:
      "Which British composer created the music for both Cats and The Phantom of the Opera? Give his surname.",
    answer: "Webber",
    acceptedAnswers: [
      "Lloyd Webber",
      "Andrew Lloyd Webber",
      "Уэббер",
      "Ллойд Уэббер",
      "Эндрю Ллойд Уэббер",
    ],
    incorrectOptions: ["Sondheim", "Bernstein", "Gershwin"],
    interestingFact:
      "Cats grew from T. S. Eliot’s poems rather than a conventional script. Grizabella, the cat who sings Memory, came from an unpublished poem supplied by Eliot’s widow.",
  },
  {
    day: 23,
    category: "Archaeology and discovery",
    question:
      "In 1922, which British archaeologist made one of the most spectacular discoveries in history when he found the almost intact tomb of the Egyptian pharaoh Tutankhamun? Give his surname.",
    answer: "Carter",
    acceptedAnswers: ["Howard Carter", "Картер", "Говард Картер"],
    incorrectOptions: ["Evans", "Petrie", "Champollion"],
    interestingFact:
      "Before finding Tutankhamun, Carter went to Egypt at just seventeen to work as an archaeological artist. His careful watercolours recorded ancient paintings as well as the birds and wildlife around him.",
  },
  {
    day: 24,
    category: "Christmas Eve ballet",
    question:
      "On Christmas Eve, Clara receives a magical toy and journeys into an enchanted world where she meets the Sugar Plum Fairy. What is the name of the ballet?",
    answer: "Nutcracker",
    acceptedAnswers: ["The Nutcracker", "Щелкунчик"],
    incorrectOptions: ["Cinderella", "Giselle", "Coppélia"],
    interestingFact:
      "The Nutcracker premiered in 1892. The Sugar Plum Fairy’s bell-like celesta looks a little like a piano, but its felt hammers strike metal plates rather than strings.",
  },
];
