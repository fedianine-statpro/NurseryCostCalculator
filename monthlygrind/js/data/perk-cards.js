// Perk Cards.
// Source: all 31 from Documentation/Perk Cards.md + 5 new ones designed to
// fill strategic gaps. Numbers rebalanced for taut budget-sim feel.
//
// COST_INFLATION is applied at the end of this module — lets us retune the
// economy without editing 36 individual cost fields. Perks should feel earned,
// not auto-bought, so the base cost is nudged above the $1,000 starting bank.
//
// Shape:
//   id, title, desc, cost, category, icon
//   oneTimeBonus:         $ paid immediately on purchase
//   skipOnBuy:            turns skipped after buying
//   passivePerTurn:       fixed $/turn while held
//   randomPerTurn:        { min, max } range added each turn (min can be negative)
//   workIncomeBonus:      decimal % added to every work card income (0.25 = +25%)
//   workFlatBonus:        flat $ added to every work card income
//   categoryDiscounts:    { categoryKey: 0.0-1.0 } — reduces magnitude of negative
//                         immediate AND recurring $ in that category by this fraction.
//   positiveCategoryMultiplier: { categoryKey: 1.x } — multiplies positive immediates in that category
//   extraTurnOnCategory:  categoryKey — grants an extra turn after drawing any event in that category
//   halveBankFee:         true — overdraft fee drops from 10% to 5%
//   weekendBonus:         $ added when landing on a weekend tile
//   absorbBigLoss:        once, converts any single immediate loss >= $300 to 0; then consumed
//   clearNegativeRecurringCategory: categoryKey — on buy, removes active negative recurring of this category

const COST_INFLATION = 500; // flat $ added — perks feel premium without being unreachable

const PERK_CARDS_RAW = [
  // ─── Rebalanced existing (documented) ──────────────────────────────────
  { id: "p-child-care",    title: "All-Care Child Care Voucher",       cost: 400, category: "family",
    desc: "Eliminates child care expenses and pays a $200 parental bonus.",
    icon: "users",
    oneTimeBonus: 200, categoryDiscounts: { family: 1.0 } },

  { id: "p-art-collector", title: "Art Collector's Eye",               cost: 500, category: "entertainment",
    desc: "Your art investments return $30–$150 each turn.",
    icon: "sparkles",
    randomPerTurn: { min: 30, max: 150 } },

  { id: "p-tax-bonanza",   title: "Big Tax Return Bonanza",            cost: 500, category: "finance",
    desc: "A one-time $1,200 cash bonus.",
    icon: "trending-up",
    oneTimeBonus: 1200 },

  { id: "p-car-insurance", title: "Bulletproof Car Insurance",         cost: 400, category: "car",
    desc: "Car-related costs reduced by 80%. Small stipend while held.",
    icon: "car",
    passivePerTurn: 20, categoryDiscounts: { car: 0.8 } },

  { id: "p-ambassador",    title: "Cultural Ambassador Grant",         cost: 550, category: "travel",
    desc: "Skip a turn for a cultural exchange, then receive $1,200.",
    icon: "plane",
    oneTimeBonus: 1200, skipOnBuy: 1 },

  { id: "p-disaster-fund", title: "Disaster Relief Fund",              cost: 450, category: "disaster",
    desc: "Negates costs from natural disaster events. Small stipend.",
    icon: "alert-triangle",
    passivePerTurn: 15, categoryDiscounts: { disaster: 1.0 } },

  { id: "p-eco-home",      title: "Eco Home Revolution Package",       cost: 400, category: "home",
    desc: "Reduce energy bills by 80% and get a $250 eco-living bonus.",
    icon: "home",
    oneTimeBonus: 250, passivePerTurn: 25, categoryDiscounts: { home: 0.8 } },

  { id: "p-eco-warrior",   title: "Eco-Warrior Lifestyle Grant",       cost: 600, category: "nature",
    desc: "Nature-event costs drop 70%. Small stipend while held.",
    icon: "leaf",
    passivePerTurn: 20, categoryDiscounts: { nature: 0.7 } },

  { id: "p-health-club",   title: "Elite Health Club Membership",      cost: 400, category: "health",
    desc: "Reduce health-related costs by 70%. Small stipend while held.",
    icon: "heart-pulse",
    passivePerTurn: 20, categoryDiscounts: { health: 0.7 } },

  { id: "p-promotion",     title: "Executive Work Promotion",          cost: 500, category: "career",
    desc: "Increases all Work card income by 25%.",
    icon: "briefcase",
    workIncomeBonus: 0.25 },

  { id: "p-home-insurance", title: "Fortress Home Insurance",          cost: 500, category: "home",
    desc: "Protects from home repairs and pays a $250 improvement bonus.",
    icon: "home",
    oneTimeBonus: 250, passivePerTurn: 15, categoryDiscounts: { home: 1.0 } },

  { id: "p-inheritance",   title: "Giant Family Inheritance",          cost: 700, category: "family",
    desc: "A one-time $1,500 cash boost.",
    icon: "users",
    oneTimeBonus: 1500 },

  { id: "p-green-commute", title: "Green Commute Initiative",          cost: 400, category: "car",
    desc: "Transportation costs cut 70%. Small stipend while held.",
    icon: "car",
    passivePerTurn: 15, categoryDiscounts: { car: 0.7, travel: 0.3 } },

  { id: "p-handyman",      title: "Handyman's DIY Mastery",            cost: 350, category: "home",
    desc: "Home maintenance costs drop 75%. Grants an extra turn after any home event.",
    icon: "home",
    categoryDiscounts: { home: 0.75 }, extraTurnOnCategory: "home" },

  { id: "p-portfolio",     title: "High-Stakes Investment Portfolio",  cost: 450, category: "finance",
    desc: "Risky returns: -$200 to +$300 each turn.",
    icon: "trending-up",
    randomPerTurn: { min: -200, max: 300 } },

  { id: "p-conference",    title: "International Conference Speaker",  cost: 600, category: "career",
    desc: "Skip a turn, then earn a $1,400 honorarium.",
    icon: "briefcase",
    oneTimeBonus: 1400, skipOnBuy: 1 },

  { id: "p-vacation",      title: "Luxury Vacation Timeshare",         cost: 700, category: "travel",
    desc: "Skip a turn for a lavish holiday, then pocket $1,600.",
    icon: "plane",
    oneTimeBonus: 1600, skipOnBuy: 1 },

  { id: "p-negotiation",   title: "Master's Degree in Negotiation",    cost: 400, category: "education",
    desc: "Spend 2 turns studying; afterwards, +20% on every Work card.",
    icon: "graduation-cap",
    workIncomeBonus: 0.20, skipOnBuy: 2 },

  { id: "p-patent",        title: "Patent Royalties",                  cost: 650, category: "finance",
    desc: "Passive $100 per turn from your inventions.",
    icon: "sparkles",
    passivePerTurn: 100 },

  { id: "p-retreat",       title: "Personal Development Retreat",      cost: 500, category: "nature",
    desc: "Skip a turn for growth, then gain $1,000.",
    icon: "leaf",
    oneTimeBonus: 1000, skipOnBuy: 1 },

  { id: "p-platinum",      title: "Platinum Health Coverage",          cost: 500, category: "health",
    desc: "Halve medical expenses and receive a $300 wellness bonus.",
    icon: "heart-pulse",
    oneTimeBonus: 300, passivePerTurn: 15, categoryDiscounts: { health: 0.5 } },

  // ─── 10 previously missing (documented) ───────────────────────────────
  { id: "p-mogul",         title: "Real Estate Mogul Path",            cost: 600, category: "home",
    desc: "Housing costs drop 60%. Passive $40/turn from property gains.",
    icon: "home",
    passivePerTurn: 40, categoryDiscounts: { home: 0.6 } },

  { id: "p-advisor",       title: "Savvy Financial Advisor Access",    cost: 450, category: "finance",
    desc: "Positive finance events pay 50% more. $200 planning bonus on buy.",
    icon: "trending-up",
    oneTimeBonus: 200, positiveCategoryMultiplier: { finance: 1.5 } },

  { id: "p-smart-home",    title: "Smart Home Makeover",               cost: 500, category: "home",
    desc: "Utility and maintenance cut 50%. Small stipend while held.",
    icon: "home",
    passivePerTurn: 20, categoryDiscounts: { home: 0.5, car: 0.2 } },

  { id: "p-solar",         title: "Solar Power Revolution",            cost: 400, category: "home",
    desc: "Energy bills drop 70%. Small stipend while held.",
    icon: "home",
    passivePerTurn: 25, categoryDiscounts: { home: 0.7 } },

  { id: "p-student-loan",  title: "Student Loan Angel Investor",       cost: 400, category: "education",
    desc: "Wipes any active education-category debts. $300 educational bonus.",
    icon: "graduation-cap",
    oneTimeBonus: 300, clearNegativeRecurringCategory: "education" },

  { id: "p-tech-startup",  title: "Tech Startup Angel Investor",       cost: 600, category: "finance",
    desc: "Risky bet: -$150 to +$300 each turn.",
    icon: "sparkles",
    randomPerTurn: { min: -150, max: 300 } },

  { id: "p-networking",    title: "Ultimate Networking Event Pass",    cost: 500, category: "career",
    desc: "Skip a turn, then +15% on all Work cards and a $400 kickback.",
    icon: "briefcase",
    oneTimeBonus: 400, skipOnBuy: 1, workIncomeBonus: 0.15 },

  { id: "p-pet-plan",      title: "Ultimate Pet Protection Plan",      cost: 300, category: "pet",
    desc: "Pet expenses drop 70%. Small stipend while held.",
    icon: "paw-print",
    passivePerTurn: 20, categoryDiscounts: { pet: 0.7 } },

  { id: "p-transit",       title: "Unlimited Public Transport Pass",   cost: 300, category: "car",
    desc: "Transportation costs nearly gone.",
    icon: "car",
    passivePerTurn: 10, categoryDiscounts: { car: 0.9, travel: 0.3 } },

  { id: "p-wildlife",      title: "Wildlife Conservation Donor",       cost: 500, category: "nature",
    desc: "Skip a turn for a wildlife project, then gain $1,100.",
    icon: "leaf",
    oneTimeBonus: 1100, skipOnBuy: 1 },

  // ─── 5 brand-new perks ────────────────────────────────────────────────
  { id: "p-side-hustle",   title: "Side Hustle",                       cost: 350, category: "career",
    desc: "Earn an extra $50 every time you Work.",
    icon: "briefcase",
    workFlatBonus: 50 },

  { id: "p-weekend-warrior", title: "Weekend Warrior",                 cost: 400, category: "entertainment",
    desc: "Pocket $150 each time you pass a weekend tile.",
    icon: "music",
    weekendBonus: 150 },

  { id: "p-safety-net",    title: "Safety Net",                        cost: 450, category: "finance",
    desc: "Overdraft fee halved (10% → 5%). $200 cushion on buy.",
    icon: "trending-up",
    oneTimeBonus: 200, halveBankFee: true },

  { id: "p-day-trader",    title: "Day Trader",                        cost: 500, category: "finance",
    desc: "High-variance returns: -$250 to +$350 each turn.",
    icon: "trending-up",
    randomPerTurn: { min: -250, max: 350 } },

  { id: "p-rainy-day",     title: "Rainy Day Fund",                    cost: 350, category: "finance",
    desc: "Once, a single event loss of $300+ is reduced to zero. Then spent.",
    icon: "sparkles",
    absorbBigLoss: true }
];

// Apply the flat cost inflation so perks are unaffordable from the $1,000 start.
export const PERK_CARDS = PERK_CARDS_RAW.map((p) => ({ ...p, cost: p.cost + COST_INFLATION }));

export function perkById(id) {
  return PERK_CARDS.find((p) => p.id === id);
}
