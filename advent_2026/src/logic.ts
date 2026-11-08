import type { Question } from "./data/questions";
export function normalize(s: string) {
  return s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLocaleLowerCase("en")
    .replace(/[^\p{L}\p{N}]/gu, "");
}
export function matches(s: string, q: Question) {
  return [q.answer, ...q.acceptedAnswers].some(
    (a) => normalize(a) === normalize(s),
  );
}
export function calendar(now: Date) {
  const p = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const n = (t: string) => Number(p.find((x) => x.type === t)?.value);
  const stamp = n("year") * 10000 + n("month") * 100 + n("day");
  const preview = stamp < 20261201,
    finale = stamp > 20261224;
  const today = preview ? 1 : finale ? null : n("day");
  return {
    preview,
    finale,
    today,
    past: Array.from(
      { length: preview ? 0 : finale ? 24 : today! - 1 },
      (_, i) => i + 1,
    ),
    stamp,
  };
}
export interface Progress {
  wrong: number;
  multiple: boolean;
  completed: boolean;
  revealed: boolean;
}
export const fresh = (): Progress => ({
  wrong: 0,
  multiple: false,
  completed: false,
  revealed: false,
});
export function attempt(p: Progress, correct: boolean, text = true): Progress {
  if (correct) return { ...p, completed: true, revealed: true };
  const wrong = text ? Math.min(2, p.wrong + 1) : p.wrong;
  return { ...p, wrong, multiple: wrong === 2 };
}
export function storageKey(preview: boolean, dev = false) {
  return (
    "alsu-enchanted-advent:2026:v1:" +
    (dev ? "development:" : "") +
    (preview ? "preview" : "real")
  );
}
export function load(key: string): Record<number, Progress> {
  try {
    const raw = JSON.parse(localStorage.getItem(key) || "{}");
    const clean: Record<number, Progress> = {};
    for (let d = 1; d <= 24; d++) {
      const p = raw?.[d];
      if (p && typeof p === "object") {
        const wrong = Math.min(2, Math.max(0, Number(p.wrong) || 0));
        clean[d] = {
          wrong,
          multiple: wrong === 2 || p.multiple === true,
          completed: p.completed === true,
          revealed: p.completed === true,
        };
      }
    }
    return clean;
  } catch {
    return {};
  }
}
export function shuffled(q: Question) {
  const a = [q.answer, ...q.incorrectOptions];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
