// Seeded RNG so runs are reproducible (?seed=... URL param for debugging).
// mulberry32 — public-domain, fast, good enough for game randomness.
export function makeRng(seed) {
  let a = (seed >>> 0) || 1;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickSeed() {
  const params = new URLSearchParams(location.search);
  const s = params.get("seed");
  if (s) return parseInt(s, 36) || Date.now();
  return Date.now();
}

// Fisher–Yates shuffle using the seeded rng.
export function shuffle(list, rng) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function rollD6(rng) {
  return 1 + Math.floor(rng() * 6);
}

export function randInt(rng, min, max) {
  return min + Math.floor(rng() * (max - min + 1));
}
