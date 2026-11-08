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
      "Malevich first exhibited Black Square in 1915, opening a bold new chapter in abstract art.",
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
      "Athena helps Odysseus with wisdom, disguises and divine encouragement throughout the Odyssey.",
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
      "Jupiter spins once in about ten hours, giving it the shortest day of any planet in our Solar System.",
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
      "Published in 1725, The Four Seasons brings birdsong, thunderstorms and icy winds to life through music.",
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
      "Nicholas was a bishop of Myra, in what is now Türkiye. Stories of his generosity helped inspire Christmas gift giving.",
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
      "First broadcast on 1 January 1976, The Irony of Fate became a much loved New Year viewing tradition.",
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
      "Klimt used real gold leaf in The Kiss. Today it glows in the collection of the Belvedere in Vienna.",
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
      "Pranayama, the yogic practice of working with the breath, takes part of its name from prana.",
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
      "The Gherkin opened in 2004. Its spiralling bands of glass make its rounded silhouette instantly recognisable.",
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
      "Legend says that ringing the wishing bell in the church on Bled Island can help a heartfelt wish come true.",
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
      "Othello begins in Venice before the action moves to Cyprus. The sea connects two very different worlds.",
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
      "Kahlo’s beloved Blue House in Mexico City, where she was born, is now a museum celebrating her life and work.",
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
      "The Illustrated London News published the royal family’s tree in 1848, inspiring households to decorate trees of their own.",
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
      "Wright designed Fallingwater in 1935. Its terraces reach over Bear Run, bringing the sound of water into everyday life.",
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
      "Michael Bond’s first Paddington book appeared in 1958. The little bear has a great fondness for marmalade.",
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
      "Hanami means flower viewing. The brief cherry blossom season is an invitation to enjoy beauty while it lasts.",
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
      "Auroras glow when charged particles interact with gases in Earth’s atmosphere. Oxygen can create their familiar green light.",
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
      "Pride and Prejudice was published in 1813. Austen’s playful dialogue still sparkles two centuries later.",
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
      "Built in the fifteenth century, Machu Picchu’s carefully fitted stone buildings sit high above Peru’s Urubamba valley.",
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
      "First footers may bring symbolic gifts such as shortbread or coal, wishing the household food and warmth.",
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
      "Cats was inspired by T. S. Eliot’s cat poems. It opened in London in 1981, five years before The Phantom of the Opera.",
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
      "Carter’s discovery revealed treasures that had rested in Tutankhamun’s tomb for more than three thousand years.",
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
      "Tchaikovsky’s ballet premiered in 1892. The Sugar Plum Fairy’s shimmering music features the bell-like celesta.",
  },
];
