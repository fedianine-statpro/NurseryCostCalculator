// 16 card categories. Each has an icon slug (matching a file in assets/icons/),
// a primary emoji used as accent, a pastel color token (CSS var), and a label.
export const CATEGORIES = {
  career:        { icon: "briefcase",      emoji: "💼", color: "var(--c-career)",        label: "Career" },
  finance:       { icon: "trending-up",    emoji: "💰", color: "var(--c-finance)",       label: "Finance" },
  health:        { icon: "heart-pulse",    emoji: "🏥", color: "var(--c-health)",        label: "Health" },
  car:           { icon: "car",            emoji: "🚗", color: "var(--c-car)",           label: "Car" },
  home:          { icon: "home",           emoji: "🏠", color: "var(--c-home)",          label: "Home" },
  family:        { icon: "users",          emoji: "👨‍👩‍👧", color: "var(--c-family)",        label: "Family" },
  pet:           { icon: "paw-print",      emoji: "🐾", color: "var(--c-pet)",           label: "Pet" },
  education:     { icon: "graduation-cap", emoji: "🎓", color: "var(--c-education)",     label: "Education" },
  food:          { icon: "utensils",       emoji: "🍽️", color: "var(--c-food)",          label: "Food" },
  entertainment: { icon: "music",          emoji: "🎵", color: "var(--c-entertainment)", label: "Fun" },
  travel:        { icon: "plane",          emoji: "✈️", color: "var(--c-travel)",        label: "Travel" },
  legal:         { icon: "gavel",          emoji: "⚖️", color: "var(--c-legal)",         label: "Legal" },
  disaster:      { icon: "alert-triangle", emoji: "⚠️", color: "var(--c-disaster)",      label: "Disaster" },
  luck:          { icon: "sparkles",       emoji: "✨", color: "var(--c-luck)",          label: "Luck" },
  nature:        { icon: "leaf",           emoji: "🍃", color: "var(--c-nature)",        label: "Nature" },
  shopping:      { icon: "shopping-bag",   emoji: "🛍️", color: "var(--c-shopping)",      label: "Shopping" }
};

export function getCategory(key) {
  return CATEGORIES[key] || { icon: "sparkles", emoji: "✨", color: "var(--c-default)", label: "Life" };
}
