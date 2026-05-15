// 10 suspects. Each has 5 traits across 5 categories.
// Traits MUST be distinct enough that 3 of them uniquely identify one suspect.
// Categories: hair, build, mark, accessory, hobby

export const TRAIT_CATEGORIES = {
  hair: "Hair",
  build: "Build",
  mark: "Distinguishing mark",
  accessory: "Accessory",
  hobby: "Hobby",
};

export const SUSPECTS = [
  {
    id: "vex", name: "Vesper 'Vex' Marlowe", avatar: "🎩",
    traits: { hair: "silver hair", build: "tall", mark: "scar on the left cheek", accessory: "platinum pocket watch", hobby: "fencing" }
  },
  {
    id: "kestrel", name: "Kestrel Onuoha", avatar: "🦅",
    traits: { hair: "black braid", build: "athletic", mark: "tattoo of a falcon on the wrist", accessory: "leather gloves", hobby: "falconry" }
  },
  {
    id: "moss", name: "Dr. Moss Kallio", avatar: "🦉",
    traits: { hair: "ash-blond", build: "wiry", mark: "small round glasses", accessory: "antique fountain pen", hobby: "ornithology" }
  },
  {
    id: "duarte", name: "Aurelio Duarte", avatar: "🎷",
    traits: { hair: "slick-back jet hair", build: "stocky", mark: "gold tooth", accessory: "panama hat", hobby: "jazz piano" }
  },
  {
    id: "selene", name: "Selene Voss", avatar: "🦊",
    traits: { hair: "auburn bob", build: "petite", mark: "freckles across the nose", accessory: "jade ring", hobby: "rare-book trade" }
  },
  {
    id: "ravi", name: "Ravi 'The Magpie' Singh", avatar: "🪶",
    traits: { hair: "salt-and-pepper", build: "lean", mark: "limp in the right leg", accessory: "silk scarf", hobby: "sleight of hand" }
  },
  {
    id: "ines", name: "Inés Calatrava", avatar: "💄",
    traits: { hair: "platinum blonde", build: "tall", mark: "beauty mark above the lip", accessory: "ruby earrings", hobby: "flamenco dancing" }
  },
  {
    id: "tomo", name: "Tomo 'Whisper' Hayashi", avatar: "🥷",
    traits: { hair: "shaved head", build: "wiry", mark: "tattoo of a koi on the forearm", accessory: "black wristband", hobby: "parkour" }
  },
  {
    id: "magnus", name: "Magnus Bjornsson", avatar: "🪓",
    traits: { hair: "red beard", build: "huge", mark: "broken nose", accessory: "iron signet ring", hobby: "open-water swimming" }
  },
  {
    id: "petra", name: "Petra Wolfe", avatar: "🐺",
    traits: { hair: "white pixie cut", build: "petite", mark: "heterochromia (one blue, one brown eye)", accessory: "silver locket", hobby: "antique map collecting" }
  },
];

export const SUSPECT_BY_ID = Object.fromEntries(SUSPECTS.map(s => [s.id, s]));
