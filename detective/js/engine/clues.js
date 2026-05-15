// Clue text generation. Two flavors:
//   - destination: hints at the NEXT city using one of its fields (currency, food, etc.)
//   - trait: gives one of the culprit's traits
// Plus dead-end ("junk") clues at off-trail or junk locations.

import { CITIES } from "../data/cities.js";
import { SUSPECT_BY_ID } from "../data/suspects.js";

const DEST_TEMPLATES = {
  currency: [
    (c) => `The teller said the suspect changed a thick stack of bills for ${c.currency}s. "Strange request, this time of year."`,
    (c) => `A receipt left on the counter is denominated in ${c.currency}. The ink is barely dry.`,
    (c) => `Somebody overheard them muttering about the exchange rate on the ${c.currency}.`
  ],
  language: [
    (c) => `The waiter remembered them asking for the bill in ${c.language}. Polite, but with a foreign tongue.`,
    (c) => `A torn napkin has a phone number and a scribbled phrase — it's ${c.language}.`,
    (c) => `They were practicing ${c.language} on the bus, the conductor says.`
  ],
  landmark: [
    (c) => `The witness saw them buying a postcard of ${c.landmark}. Smiling, like they were going home.`,
    (c) => `A travel guide tucked under their arm was open to the page on ${c.landmark}.`,
    (c) => `They asked the cabbie how far to ${c.landmark}. Twice.`
  ],
  food: [
    (c) => `The chef remembered them ordering ${c.food} like a regular. "Knew exactly how to eat it, too."`,
    (c) => `A receipt for ${c.food}, paid in cash. Generous tip.`,
    (c) => `They smelled of ${c.food}, the doorman swore. "Couldn't miss it."`
  ],
  flagColors: [
    (c) => `Pinned to their lapel: a small enamel flag — ${c.flagColors}.`,
    (c) => `They were carrying a souvenir keychain, ${c.flagColors}. Cheap, but specific.`,
    (c) => `A sticker on their suitcase showed a flag in ${c.flagColors}.`
  ],
  climate: [
    (c) => `They were dressed completely wrong for here. Said they were heading somewhere with ${c.climate}.`,
    (c) => `"They complained about the local weather," the porter said. "Looking forward to ${c.climate}, apparently."`,
    (c) => `Their bag was packed for ${c.climate}. The porter peeked.`
  ],
  fact: [
    (c) => `The bookshop clerk says they bought a single book — a history of the place known as ${c.fact}.`,
    (c) => `They were boasting at the bar about a city that is ${c.fact}.`,
    (c) => `A diary page abandoned on the train: a single underlined note about ${c.fact}.`
  ]
};

const TRAIT_TEMPLATES = {
  hair: [
    (v) => `The witness remembers ${v} more than the face.`,
    (v) => `A security camera caught the suspect from behind — ${v}, unmistakable.`,
    (v) => `"You couldn't miss the ${v}," the bartender said.`
  ],
  build: [
    (v) => `The doorman described them as ${v}.`,
    (v) => `"${v.charAt(0).toUpperCase()+v.slice(1)} build," the porter said. "Moved like they knew it."`,
    (v) => `Footage shows someone ${v} ducking under the camera.`
  ],
  mark: [
    (v) => `The witness can't stop talking about a detail: ${v}.`,
    (v) => `A maid found a discarded handkerchief and remembers — ${v}, plain as day.`,
    (v) => `An old photograph in the case file is dog-eared on the same spot every time: ${v}.`
  ],
  accessory: [
    (v) => `Whoever it was, they were wearing ${v}.`,
    (v) => `The pawnbroker says they tried to sell ${v}. He didn't bite.`,
    (v) => `The desk clerk noticed ${v} — "expensive, but worn like they didn't care."`
  ],
  hobby: [
    (v) => `Talk in the area is they're known for ${v}.`,
    (v) => `A regular at the club mentions someone who shows up for ${v}.`,
    (v) => `"Asked about local clubs for ${v}," the concierge volunteers.`
  ]
};

const JUNK_LINES = [
  "Nothing here. The walk back will give you time to think.",
  "A waste of an hour. The trail is going cold somewhere else.",
  "The proprietor wouldn't meet your eyes — but only because he owes someone money. Not your problem today.",
  "You watch the door for a while. Nobody comes in. You leave.",
  "A child asks if you're a real detective. You say yes. She asks for proof. You leave."
];

const DEAD_END_LINES = [
  "Nobody matching your description has been through here. The trail isn't this way.",
  "The locals are friendly but unhelpful. Wrong city, detective.",
  "You spend an hour asking. Nothing. The suspect never came here.",
];

function pickTemplate(arr, seed) {
  return arr[seed % arr.length];
}

// `seed` lets the same case play out consistently per location.
function seedFor(cityId, locationId) {
  let h = 0;
  const s = cityId + ":" + locationId;
  for (let i = 0; i < s.length; i++) h = (h*31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function generateDestinationClue(nextCityId, angle, fromCityId, locationId) {
  const c = CITIES[nextCityId];
  const arr = DEST_TEMPLATES[angle] || DEST_TEMPLATES.landmark;
  const tpl = pickTemplate(arr, seedFor(fromCityId, locationId));
  return tpl(c);
}

export function generateTraitClue(culpritId, traitKey, fromCityId, locationId) {
  const culprit = SUSPECT_BY_ID[culpritId];
  const value = culprit.traits[traitKey];
  const arr = TRAIT_TEMPLATES[traitKey];
  const tpl = pickTemplate(arr, seedFor(fromCityId, locationId));
  return { text: tpl(value), traitKey, value };
}

export function generateJunkClue(fromCityId, locationId) {
  return pickTemplate(JUNK_LINES, seedFor(fromCityId, locationId));
}

export function generateDeadEndClue(fromCityId, locationId) {
  return pickTemplate(DEAD_END_LINES, seedFor(fromCityId, locationId));
}
