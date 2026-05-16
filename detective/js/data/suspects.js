// Suspect structural data — IDs, avatars, signature MO, and trait values.
// All display strings (names, aliases, MO text) live in the locale files.
//
// Trait categories: hair / build / mark / accessory / hobby.
// Multiple suspects MAY share a value id within a category (e.g. two "tall"
// suspects) — that's intentional, it forces the player to collect more than
// one trait clue to narrow down.

export const SUSPECTS = [
  { id: "vex",     avatar: "🎩", signature: "leaves-a-card"    },
  { id: "kestrel", avatar: "🦅", signature: "feathers"         },
  { id: "moss",    avatar: "🦉", signature: "ink-blot"         },
  { id: "duarte",  avatar: "🎷", signature: "hums-a-tune"      },
  { id: "selene",  avatar: "🦊", signature: "vanishes-clean"   },
  { id: "ravi",    avatar: "🪶", signature: "switches-coins"   },
  { id: "ines",    avatar: "💄", signature: "rose-petals"      },
  { id: "tomo",    avatar: "🥷", signature: "no-trace"         },
  { id: "magnus",  avatar: "🪓", signature: "bent-iron"        },
  { id: "petra",   avatar: "🐺", signature: "old-map-corner"   },
];

export const SUSPECT_BY_ID = Object.fromEntries(SUSPECTS.map(s => [s.id, s]));

export const TRAIT_CATEGORY_KEYS = ["hair", "build", "mark", "accessory", "hobby"];

// Each suspect's trait values by language-neutral ID.
export const SUSPECT_TRAITS = {
  vex:     { hair: "silver",       build: "tall",     mark: "scar-left-cheek",      accessory: "platinum-pocket-watch", hobby: "fencing" },
  kestrel: { hair: "black-braid",  build: "athletic", mark: "falcon-tattoo-wrist",  accessory: "leather-gloves",        hobby: "falconry" },
  moss:    { hair: "ash-blond",    build: "wiry",     mark: "round-glasses",        accessory: "fountain-pen",          hobby: "ornithology" },
  duarte:  { hair: "slick-jet",    build: "stocky",   mark: "gold-tooth",           accessory: "panama-hat",            hobby: "jazz-piano" },
  selene:  { hair: "auburn-bob",   build: "petite",   mark: "freckles-nose",        accessory: "jade-ring",             hobby: "rare-books" },
  ravi:    { hair: "salt-pepper",  build: "lean",     mark: "right-leg-limp",       accessory: "silk-scarf",            hobby: "sleight-of-hand" },
  ines:    { hair: "platinum",     build: "tall",     mark: "beauty-mark-lip",      accessory: "ruby-earrings",         hobby: "flamenco" },
  tomo:    { hair: "shaved",       build: "wiry",     mark: "koi-tattoo-forearm",   accessory: "black-wristband",       hobby: "parkour" },
  magnus:  { hair: "red-beard",    build: "huge",     mark: "broken-nose",          accessory: "iron-signet",           hobby: "open-water-swim" },
  petra:   { hair: "white-pixie",  build: "petite",   mark: "heterochromia",        accessory: "silver-locket",         hobby: "antique-maps" },
};
