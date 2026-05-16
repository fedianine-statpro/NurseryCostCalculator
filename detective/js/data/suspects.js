// Suspect structural data — IDs, avatars, signature MO keys, and (most
// importantly) the bucket-tag values per trait category used for matching.
//
// Two-layer trait system:
//   • SUSPECT_TRAITS holds a BUCKET TAG per category (e.g. accessory: "trinket").
//     Witness clues use the bucket-level description (so multiple suspects can
//     match a single clue) and warrant matching uses the bucket tag.
//   • The locale's `suspectTraits[suspectId][category]` holds a VIVID per-suspect
//     description used in the dossier so suspects look visually distinct even
//     though they share matching tags.
//
// Trait categories: hair / build / mark / accessory / hobby.
//
// Bucket distribution (15 suspects):
//   hair        — silver(3), dark(5), light(4), red(3)
//   build       — tall(5), athletic(5), compact(5)
//   mark        — scar(2), tattoo(3), eyewear(3), facial(4), injury(3)
//   accessory   — trinket(5), jewelry(5), clothing(5)
//   hobby       — stunts(3), birds(3), performance(4), collecting(3), water(2)

export const SUSPECTS = [
  { id: "vex",        avatar: "🎩", signature: "playing-card" },
  { id: "kestrel",    avatar: "🦅", signature: "black-feather" },
  { id: "moss",       avatar: "🦉", signature: "ink-blot" },
  { id: "duarte",     avatar: "🎷", signature: "humming" },
  { id: "selene",     avatar: "🦊", signature: "no-trace-vault" },
  { id: "ravi",       avatar: "🪶", signature: "coin-swap" },
  { id: "ines",       avatar: "💄", signature: "rose-petals" },
  { id: "tomo",       avatar: "🥷", signature: "next-city-ghost" },
  { id: "magnus",     avatar: "🪓", signature: "bent-iron" },
  { id: "petra",      avatar: "🐺", signature: "torn-map" },
  // New additions:
  { id: "carmela",    avatar: "🐍", signature: "snakeskin" },
  { id: "stavros",    avatar: "🔮", signature: "olive-leaf" },
  { id: "mariana",    avatar: "🌹", signature: "samba-rhythm" },
  { id: "amara",      avatar: "🐅", signature: "claw-mark" },
  { id: "konstantin", avatar: "🌑", signature: "frosted-pane" },
];

export const SUSPECT_BY_ID = Object.fromEntries(SUSPECTS.map(s => [s.id, s]));

export const TRAIT_CATEGORY_KEYS = ["hair", "build", "mark", "accessory", "hobby"];

// Bucket tags per suspect. Multiple suspects share a tag — that's the point.
// A single trait clue narrows the dossier from 15 to ~3-5, never to 1.
export const SUSPECT_TRAITS = {
  vex:        { hair: "silver", build: "tall",     mark: "scar",    accessory: "trinket",  hobby: "stunts" },
  kestrel:    { hair: "dark",   build: "athletic", mark: "tattoo",  accessory: "clothing", hobby: "birds" },
  moss:       { hair: "light",  build: "compact",  mark: "eyewear", accessory: "trinket",  hobby: "birds" },
  duarte:     { hair: "dark",   build: "athletic", mark: "facial",  accessory: "clothing", hobby: "performance" },
  selene:     { hair: "red",    build: "compact",  mark: "facial",  accessory: "jewelry",  hobby: "collecting" },
  ravi:       { hair: "silver", build: "athletic", mark: "injury",  accessory: "clothing", hobby: "performance" },
  ines:       { hair: "light",  build: "tall",     mark: "facial",  accessory: "jewelry",  hobby: "performance" },
  tomo:       { hair: "dark",   build: "compact",  mark: "tattoo",  accessory: "clothing", hobby: "stunts" },
  magnus:     { hair: "red",    build: "tall",     mark: "injury",  accessory: "trinket",  hobby: "water" },
  petra:      { hair: "light",  build: "compact",  mark: "eyewear", accessory: "trinket",  hobby: "collecting" },
  carmela:    { hair: "dark",   build: "compact",  mark: "facial",  accessory: "jewelry",  hobby: "stunts" },
  stavros:    { hair: "silver", build: "athletic", mark: "eyewear", accessory: "trinket",  hobby: "collecting" },
  mariana:    { hair: "red",    build: "athletic", mark: "tattoo",  accessory: "jewelry",  hobby: "performance" },
  amara:      { hair: "dark",   build: "tall",     mark: "injury",  accessory: "jewelry",  hobby: "birds" },
  konstantin: { hair: "light",  build: "tall",     mark: "scar",    accessory: "clothing", hobby: "water" },
};
