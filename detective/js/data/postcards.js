// Postcard art + greetings for each city. Shown the first time the player
// arrives at a city during a case, between travel and the map screen.
//
// ASCII silhouettes are kept to ASCII-only characters (/, \, |, _, -, =, *,
// o, +, .) and ~6-9 lines tall so they render stably in any monospace font.
// They're meant to be evocative, not photorealistic.
//
// The `greeting` is intentionally in the city's LOCAL language (not the
// game's UI language) — that's the postcard charm, and a small educational
// moment every time the player lands somewhere new.

function join(...lines) { return lines.join("\n"); }

export const POSTCARDS = {
  // ── Europe ─────────────────────────────────────────────────────────────
  lisbon: {
    greeting: "Bem-vindo a Lisboa",
    art: join(
      "         _____",
      "        |# # #|",
      "        |     |",
      "        |  T  |",
      "        |# # #|",
      "        |_____|",
      "   ~~~~~~~~~~~~~~~~~",
    ),
  },
  reykjavik: {
    greeting: "Velkomin til Reykjavíkur",
    art: join(
      "           /\\",
      "          /  \\",
      "         / || \\",
      "        /  ||  \\",
      "       /   ||   \\",
      "      /____||____\\",
    ),
  },
  helsinki: {
    greeting: "Tervetuloa Helsinkiin",
    art: join(
      "             +",
      "            _|_",
      "           /   \\",
      "          | + + |",
      "         _|     |_",
      "        |    +    |",
      "        |_________|",
    ),
  },
  edinburgh: {
    greeting: "Welcome to Edinburgh",
    art: join(
      "       |---|_|---|",
      "       |         |",
      "       | [] [] [] |",
      "      _|_________|_",
      "     /             \\",
      "    /_______________\\",
    ),
  },
  athens: {
    greeting: "Καλώς ορίσατε στην Αθήνα",
    art: join(
      "        _____________",
      "       |_____________|",
      "       | || || || || |",
      "       | || || || || |",
      "       | || || || || |",
      "       |_||_||_||_||_|",
    ),
  },

  // ── Africa ─────────────────────────────────────────────────────────────
  cairo: {
    greeting: "Ahlan bik fi al-Qahira",
    art: join(
      "             /\\",
      "            /  \\",
      "           /    \\",
      "        /\\/      \\",
      "       /  \\        \\",
      "      /____\\________\\",
    ),
  },
  marrakech: {
    greeting: "Marhaban bik fi Marrakech",
    art: join(
      "         *      *      *",
      "         |      |      |",
      "        / \\    / \\    / \\",
      "       |   |  |   |  |   |",
      "       |___|__|___|__|___|",
      "      ====================",
    ),
  },
  capetown: {
    greeting: "Welcome to Cape Town · Welkom in Kaapstad",
    art: join(
      "        _________________",
      "       /                 \\",
      "      /                   \\",
      "     /_____________________\\",
      "    ~~~~~~~~~~~~~~~~~~~~~~~~~",
    ),
  },
  nairobi: {
    greeting: "Karibu Nairobi",
    art: join(
      "          _______",
      "         /       \\",
      "        /  ~~~~~  \\",
      "        \\_________/",
      "             |",
      "             |",
      "             |",
      "      _______|________",
    ),
  },

  // ── Asia ───────────────────────────────────────────────────────────────
  istanbul: {
    greeting: "İstanbul'a hoş geldiniz",
    art: join(
      "              ___",
      "       |     /   \\     |",
      "       |    |  o  |    |",
      "       |    |     |    |",
      "       |    |_____|    |",
      "       |________________|",
    ),
  },
  mumbai: {
    greeting: "Mumbai mein aapka swagat hai",
    art: join(
      "         .-----------.",
      "         |    ___    |",
      "         |   /   \\   |",
      "         |  |     |  |",
      "         |  |     |  |",
      "         |__|_____|__|",
    ),
  },
  bangkok: {
    greeting: "Yindee tonrap su Krung Thep",
    art: join(
      "              /\\",
      "             /^^\\",
      "            /^^^^\\",
      "           /^^^^^^\\",
      "          /^^^^^^^^\\",
      "         /__________\\",
    ),
  },
  hanoi: {
    greeting: "Chào mừng đến Hà Nội",
    art: join(
      "       /\\  /\\  /\\  /\\",
      "      /__\\/__\\/__\\/__\\",
      "     |_________________|",
      "    ~~~~~~~~~~~~~~~~~~~~~",
      "    ~~~~~~~~~~~~~~~~~~~~~",
    ),
  },
  tokyo: {
    greeting: "Tōkyō e yōkoso",
    art: join(
      "              /\\",
      "             /||\\",
      "            /_||_\\",
      "           /  ||  \\",
      "          /___||___\\",
      "         /    ||    \\",
    ),
  },
  seoul: {
    greeting: "Seoul-e osin geos-eul hwan-yeong-hap-ni-da",
    art: join(
      "        /\\__/\\__/\\__/\\",
      "       /                \\",
      "      /__________________\\",
      "      |   []   []   []   |",
      "      |   []   []   []   |",
      "      |__________________|",
    ),
  },

  // ── Americas ───────────────────────────────────────────────────────────
  vancouver: {
    greeting: "Welcome to Vancouver",
    art: join(
      "          /\\    /\\",
      "         /  \\  /  \\  /\\",
      "        /    \\/    \\/  \\",
      "       | ||| ||| ||| || |",
      "       | ||| ||| ||| || |",
      "       ~~~~~~~~~~~~~~~~~~~",
    ),
  },
  mexicocity: {
    greeting: "Bienvenido a la Ciudad de México",
    art: join(
      "             /\\  /\\",
      "            /  \\/  \\",
      "           |  /\\/\\  |",
      "           | |    | |",
      "           |_|____|_|",
    ),
  },
  havana: {
    greeting: "Bienvenido a La Habana",
    art: join(
      "             ______",
      "           _/      \\_____",
      "          /  o    o      |",
      "         |________________|",
      "            O        O",
      "      ~~~~~~~~~~~~~~~~~~~~~",
    ),
  },
  lima: {
    greeting: "Bienvenido a Lima",
    art: join(
      "              +",
      "             / \\",
      "            |   |",
      "         ___|___|___",
      "        |   |   |   |",
      "        | [ ] [ ] [ ]|",
      "        |___|___|___|",
    ),
  },
  buenosaires: {
    greeting: "Bienvenido a Buenos Aires",
    art: join(
      "              /\\",
      "             /||\\",
      "              ||",
      "              ||",
      "              ||",
      "              ||",
      "          ____||____",
    ),
  },
  rio: {
    greeting: "Bem-vindo ao Rio",
    art: join(
      "              o",
      "          ____|____",
      "              |",
      "              |",
      "             / \\",
      "            /   \\",
      "           /_____\\",
      "      ~~~~~~~~~~~~~~~~~",
    ),
  },

  // ── Oceania ────────────────────────────────────────────────────────────
  sydney: {
    greeting: "G'day from Sydney",
    art: join(
      "            __",
      "           /  \\     __",
      "          /    \\   /  \\",
      "         /      \\ /    \\",
      "        /________X______\\",
      "    ~~~~~~~~~~~~~~~~~~~~~~~",
    ),
  },
  auckland: {
    greeting: "Haere mai ki Tāmaki Makaurau",
    art: join(
      "              |",
      "              o",
      "              |",
      "              |",
      "              |",
      "            __|__",
      "           |     |",
      "      ~~~~~~~~~~~~~~~~~",
    ),
  },
};
