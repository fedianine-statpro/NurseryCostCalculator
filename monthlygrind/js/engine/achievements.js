// Badge detection for the end-of-game modal.
// Each definition returns true when the player qualifies.

const STARTING = 1000;

export const ACHIEVEMENT_DEFS = [
  {
    id: "frugal",
    title: "Frugal",
    icon: "💰",
    desc: "Finished between $1,000 and $1,500 — a real budget-sim win.",
    test: (p) => p.balance >= STARTING && p.balance <= 1500
  },
  {
    id: "high-roller",
    title: "High Roller",
    icon: "🎰",
    desc: "Ended above $3,500.",
    test: (p) => p.balance > 3500
  },
  {
    id: "comeback-kid",
    title: "Comeback Kid",
    icon: "🔁",
    desc: "Went negative at some point and still came out on top.",
    test: (p, ctx) => p.wentBelowZero && ctx.isWinner
  },
  {
    id: "perfectionist",
    title: "Perfectionist",
    icon: "⭐",
    desc: "Never dropped below $1,000 — pure discipline.",
    test: (p, ctx) => ctx.isWinner && !p.wentBelowZero && p.balance >= STARTING
  },
  {
    id: "gambler",
    title: "Gambler",
    icon: "🎲",
    desc: "Drew 20+ life-event cards.",
    test: (p) => (p.eventCardsDrawn || 0) >= 20
  },
  {
    id: "steady-eddie",
    title: "Steady Eddie",
    icon: "🧾",
    desc: "Worked 20+ times — showed up every day.",
    test: (p) => (p.workCardsDrawn || 0) >= 20
  },
  {
    id: "networker",
    title: "Networker",
    icon: "🤝",
    desc: "Maxed out perks — two in the hand.",
    test: (p) => p.perks.length >= 2
  },
  {
    id: "survivor",
    title: "Survivor",
    icon: "🛟",
    desc: "Took a big hit and walked away standing.",
    test: (p, ctx) => ctx.isWinner && p.wentBelowZero
  }
];

// Return earned achievements for a given player.
// ctx = { isWinner: boolean }
export function evaluateAchievements(player, ctx = {}) {
  return ACHIEVEMENT_DEFS.filter((def) => {
    try { return def.test(player, ctx); } catch { return false; }
  });
}
