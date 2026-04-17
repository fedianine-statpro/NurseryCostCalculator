// 21 Perk Cards from Documentation/Perk Cards.md as structured effect specs.
// Shape:
//   id, title, desc, cost, category, icon (card header icon slug)
//   oneTimeBonus:         $ paid immediately on purchase
//   skipOnBuy:            how many turns to skip after buying (0 default)
//   passivePerTurn:       fixed $/turn while held
//   randomPerTurn:        { min, max } range added each turn
//   workIncomeBonus:      % added to every work card income (decimal, e.g. 0.35 for +35%)
//   categoryDiscounts:    { categoryKey: 0.0-1.0 } -> reduces the magnitude of negative event
//                         immediate AND recurring $ in that category by this fraction.
//   categoryBonuses:      { categoryKey: $flat } -> flat bonus added to positive events in that category
//   investmentMultiplier: multiplies positive "finance"/multiplier event gains by this factor
//   oneTime:              true -> consumed after first trigger (for narrative/documentation)
//
// Costs match the source doc; numbers like "Art Collector's Eye" are implemented as randomPerTurn.
// See perk-event-map.js for the matching-event table (category-based matching is the
// primary mechanism; explicit per-event overrides could be added later).

export const PERK_CARDS = [
  { id: "p-child-care",    title: "All-Care Child Care Voucher",       cost: 400, category: "family",
    desc: "Eliminates child care expenses and pays a $200 parental bonus.",
    icon: "users",
    oneTimeBonus: 200, categoryDiscounts: { family: 1.0 } },

  { id: "p-art-collector", title: "Art Collector's Eye",               cost: 700, category: "entertainment",
    desc: "Art investments may pay $300–$1,500 per turn.",
    icon: "sparkles",
    randomPerTurn: { min: 300, max: 1500 } },

  { id: "p-tax-bonanza",   title: "Big Tax Return Bonanza",            cost: 500, category: "finance",
    desc: "A one-time $2,000 cash bonus.",
    icon: "trending-up",
    oneTimeBonus: 2000 },

  { id: "p-car-insurance", title: "Bulletproof Car Insurance",         cost: 400, category: "car",
    desc: "Car-related event costs reduced by 80%.",
    icon: "car",
    categoryDiscounts: { car: 0.8 } },

  { id: "p-ambassador",    title: "Cultural Ambassador Grant",         cost: 650, category: "travel",
    desc: "Skip a turn for a cultural exchange; then receive $1,800.",
    icon: "plane",
    oneTimeBonus: 1800, skipOnBuy: 1 },

  { id: "p-disaster-fund", title: "Disaster Relief Fund",              cost: 450, category: "disaster",
    desc: "Negates costs from natural disaster events.",
    icon: "alert-triangle",
    categoryDiscounts: { disaster: 1.0 } },

  { id: "p-eco-home",      title: "Eco Home Revolution Package",       cost: 400, category: "home",
    desc: "Reduce energy bills by 80% and get a $250 eco-living bonus.",
    icon: "home",
    oneTimeBonus: 250, categoryDiscounts: { home: 0.8 } },

  { id: "p-eco-warrior",   title: "Eco-Warrior Lifestyle Grant",       cost: 600, category: "nature",
    desc: "Reduces eco-friendly event costs by 70%.",
    icon: "leaf",
    categoryDiscounts: { nature: 0.7 } },

  { id: "p-health-club",   title: "Elite Health Club Membership",      cost: 400, category: "health",
    desc: "Reduce health-related costs by 70%.",
    icon: "heart-pulse",
    categoryDiscounts: { health: 0.7 } },

  { id: "p-promotion",     title: "Executive Work Promotion",          cost: 700, category: "career",
    desc: "Increases all Work card income by 35%.",
    icon: "briefcase",
    workIncomeBonus: 0.35 },

  { id: "p-home-insurance", title: "Fortress Home Insurance",          cost: 500, category: "home",
    desc: "Protects from home repairs and pays a $250 improvement bonus.",
    icon: "home",
    oneTimeBonus: 250, categoryDiscounts: { home: 1.0 } },

  { id: "p-inheritance",   title: "Giant Family Inheritance",          cost: 800, category: "family",
    desc: "A one-time $2,500 cash boost.",
    icon: "users",
    oneTimeBonus: 2500 },

  { id: "p-green-commute", title: "Green Commute Initiative",          cost: 400, category: "car",
    desc: "Transportation costs reduced by 70%.",
    icon: "car",
    categoryDiscounts: { car: 0.7, travel: 0.3 } },

  { id: "p-handyman",      title: "Handyman's DIY Mastery",            cost: 350, category: "home",
    desc: "Reduce home maintenance costs by 75%.",
    icon: "home",
    categoryDiscounts: { home: 0.75 } },

  { id: "p-portfolio",     title: "High-Stakes Investment Portfolio",  cost: 600, category: "finance",
    desc: "Returns of $300–$1,000 per turn, but risk is real.",
    icon: "trending-up",
    randomPerTurn: { min: -200, max: 1000 } },

  { id: "p-conference",    title: "International Conference Speaker",  cost: 600, category: "career",
    desc: "Skip a turn, then earn a $2,000 honorarium.",
    icon: "briefcase",
    oneTimeBonus: 2000, skipOnBuy: 1 },

  { id: "p-vacation",      title: "Luxury Vacation Timeshare",         cost: 700, category: "travel",
    desc: "Skip a turn for a lavish holiday, then pocket $2,500.",
    icon: "plane",
    oneTimeBonus: 2500, skipOnBuy: 1 },

  { id: "p-negotiation",   title: "Master's Degree in Negotiation",    cost: 500, category: "education",
    desc: "Negotiate 25% higher salaries on all future Work cards.",
    icon: "graduation-cap",
    workIncomeBonus: 0.25 },

  { id: "p-patent",        title: "Patent Royalties",                  cost: 750, category: "finance",
    desc: "Passive $300 per turn from your inventions.",
    icon: "sparkles",
    passivePerTurn: 300 },

  { id: "p-retreat",       title: "Personal Development Retreat",      cost: 550, category: "nature",
    desc: "Skip a turn for growth, then gain $1,500.",
    icon: "leaf",
    oneTimeBonus: 1500, skipOnBuy: 1 },

  { id: "p-platinum",      title: "Platinum Health Coverage",          cost: 500, category: "health",
    desc: "Halve medical expenses and receive a $300 wellness bonus.",
    icon: "heart-pulse",
    oneTimeBonus: 300, categoryDiscounts: { health: 0.5 } }
];

export function perkById(id) {
  return PERK_CARDS.find((p) => p.id === id);
}
