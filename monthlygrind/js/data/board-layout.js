// 31-tile board layout. Day 1 = start, Day 31 = finish.
// Tile types:
//   start  - starting tile, no effect
//   event  - drawing an event card when you land here
//   payday - flat +$50 bonus on landing (rewards aggressive movement)
//   rest   - safe tile, no effect
//   finish - winning tile
//
// Pattern is hand-crafted for variety: roughly 60% event, 15% payday, 25% rest.

const pattern = [
  "start",   // 1
  "rest",    // 2
  "event",   // 3
  "event",   // 4
  "payday",  // 5
  "event",   // 6
  "rest",    // 7
  "event",   // 8
  "event",   // 9
  "payday",  // 10
  "event",   // 11
  "rest",    // 12
  "event",   // 13
  "event",   // 14
  "payday",  // 15
  "event",   // 16
  "event",   // 17
  "rest",    // 18
  "event",   // 19
  "event",   // 20
  "payday",  // 21
  "event",   // 22
  "rest",    // 23
  "event",   // 24
  "event",   // 25
  "payday",  // 26
  "event",   // 27
  "event",   // 28
  "rest",    // 29
  "event",   // 30
  "finish"   // 31
];

export const BOARD_LAYOUT = pattern.map((type, i) => ({
  day: i + 1,
  type,
  // payday bonus amount (grows slightly later in the month to offset mounting events)
  paydayAmount: type === "payday" ? 50 + Math.floor(i / 10) * 25 : 0
}));

export const TOTAL_DAYS = BOARD_LAYOUT.length; // 31
