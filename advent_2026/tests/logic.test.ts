import { describe, it, expect } from "vitest";
import {
  calendar,
  matches,
  normalize,
  fresh,
  attempt,
  storageKey,
} from "../src/logic";
import { questions } from "../src/data/questions";
describe("London calendar", () => {
  it.each([
    [20, 11, 1, 0],
    [1, 12, 1, 0],
    [2, 12, 2, 1],
    [11, 12, 11, 10],
    [24, 12, 24, 23],
    [25, 12, null, 24],
  ])("%s/%s", (d, m, t, n) => {
    const c = calendar(new Date(Date.UTC(2026, m - 1, d)));
    expect(c.today).toBe(t);
    expect(c.past).toHaveLength(n);
  });
  it("crosses precisely at midnight", () => {
    expect(calendar(new Date("2026-12-01T23:59:59Z")).today).toBe(1);
    expect(calendar(new Date("2026-12-02T00:00:00Z")).today).toBe(2);
    expect(calendar(new Date("2027-06-01")).past).toHaveLength(24);
  });
});
describe("answers", () => {
  for (const q of questions)
    it("day " + q.day + " aliases and distractors", () => {
      for (const a of [q.answer, ...q.acceptedAnswers])
        expect(matches("  " + a.toUpperCase() + "! ", q)).toBe(true);
      for (const a of q.incorrectOptions) expect(matches(a, q)).toBe(false);
      expect(matches("I think it is " + q.answer, q)).toBe(false);
      expect(q.incorrectOptions).toHaveLength(3);
    });
  it("normalises accents punctuation spacing", () =>
    expect(normalize(" Sáint   Pétersburg! ")).toBe(
      normalize("Saint Petersburg"),
    ));
});
it("offers help on second mistake and preserves it", () => {
  let p = attempt(fresh(), false);
  expect(p.multiple).toBe(false);
  p = attempt(p, false);
  expect(p.multiple).toBe(true);
  expect(attempt(p, false, false)).toEqual(p);
  expect(attempt(p, true)).toMatchObject({
    completed: true,
    revealed: true,
    wrong: 2,
  });
});
it("isolates preview development and real storage", () => {
  expect(
    new Set([
      storageKey(true),
      storageKey(false),
      storageKey(false, true),
      storageKey(true, true),
    ]).size,
  ).toBe(4);
});
