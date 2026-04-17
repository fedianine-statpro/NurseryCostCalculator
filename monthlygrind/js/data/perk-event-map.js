// Perk -> [matching event titles] from Documentation/PerkToEventRelationship.md.
// We primarily use category-based discounts (see perk-cards.js), but this explicit
// map lets us give an extra nudge to named events (e.g. Inheritance-flavored perks
// that should still fire on a "Mystery Inheritance" draw regardless of category).
// Lookups are done by event title (exact match).

export const PERK_TRIGGER_EVENTS = {
  "p-child-care":    ["Birth of a Child", "First Child", "Grandchildren Joy"],
  "p-art-collector": ["Art Sale", "Artistic Achievement"],
  "p-tax-bonanza":   ["Tax Adjustment", "Tax Refund Joy"],
  "p-car-insurance": ["Car Repair", "Unexpected Expense", "Speeding Ticket", "Parking Ticket Pandemonium", "Doughnut Dilemma"],
  "p-ambassador":    ["Networking Event", "Sponsored Course", "Charity Work Wonder", "Entrepreneurial Spirit", "Attending a Historical Event", "Attending a Space Launch"],
  "p-disaster-fund": ["Natural Disaster", "Experiencing a Natural Disaster", "Surviving a Natural Disaster", "Total Theft", "Experiencing a Home Burglary"],
  "p-eco-home":      ["Utility Surge"],
  "p-eco-warrior":   ["Studying Abroad Adventure", "Participating in a Protest", "Volunteering Abroad", "Starting a Garden"],
  "p-health-club":   ["Medical Bill", "Major Health Issue", "Undergoing a Health Scare", "Gym Membership Misfortune"],
  "p-promotion":     [],
  "p-home-insurance": ["Home Repair", "DIY Disaster", "Experiencing a Home Burglary"],
  "p-inheritance":   ["Inheritance", "Mystery Inheritance", "Inheritance Surprise", "Unexpected Inheritance"],
  "p-green-commute": ["Speeding Ticket", "Parking Ticket Pandemonium", "First Major Purchase", "Doughnut Dilemma"],
  "p-handyman":      ["Home Repair", "DIY Disaster", "Misplaced Keys Calamity"],
  "p-portfolio":     ["Stock Dividends", "Rental Income", "Book Royalties", "Found Money", "Lottery Win", "Forgotten Bitcoin", "Market Master", "Winning a Small Lottery", "Major Financial Investment", "Found a Lost Valuable", "Getting a Patent"],
  "p-conference":    ["Networking Event", "Sponsored Course", "Charity Work Wonder", "Entrepreneurial Spirit", "Attending a Historical Event", "Attending a Space Launch"],
  "p-vacation":      ["Dream Vacation", "Relocation", "Emergency Travel"],
  "p-negotiation":   [],
  "p-patent":        ["Getting a Patent", "Developing a Successful Mobile App"],
  "p-retreat":       ["Spiritual Awakening", "Going on a Spiritual Retreat", "Overcoming a Phobia", "Discovering a Personal Philosophy"],
  "p-platinum":      ["Medical Bill", "Major Health Issue", "Undergoing a Health Scare", "First Major Surgery", "Surviving a Serious Accident"]
};

export function perkFiresForEvent(perkId, eventTitle) {
  const list = PERK_TRIGGER_EVENTS[perkId];
  return Array.isArray(list) && list.includes(eventTitle);
}
