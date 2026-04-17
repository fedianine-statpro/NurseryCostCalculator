// 31-tile board layout. Day 1 = start, Day 31 = finish.
// Every non-start/finish day is a normal day — both Work and Move advance
// exactly one step. The action you pick that turn decides what happens there.
// Tile `type` is used only for visual theming on the board.

export const BOARD_LAYOUT = Array.from({ length: 31 }, (_, i) => {
  const day = i + 1;
  let type;
  if (day === 1) type = "start";
  else if (day === 31) type = "finish";
  else if (day % 7 === 0) type = "weekend"; // small visual rhythm every 7 days
  else type = "day";
  return { day, type };
});

export const TOTAL_DAYS = BOARD_LAYOUT.length; // 31
