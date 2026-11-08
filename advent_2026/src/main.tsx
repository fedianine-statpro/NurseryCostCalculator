import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { questions } from "./data/questions";
import { gifts } from "./data/gifts";
import {
  calendar,
  matches,
  fresh,
  attempt,
  load,
  storageKey,
  shuffled,
} from "./logic";
import { World } from "./World";
import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/great-vibes/latin-400.css";
import WishMagic from "./components/WishMagic";
import "./style.css";
function App() {
  const [override, setOverride] = useState("");
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const tick = () => setNow(new Date());
    const t = setInterval(tick, 1000);
    window.addEventListener("focus", tick);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(t);
      window.removeEventListener("focus", tick);
      document.removeEventListener("visibilitychange", tick);
    };
  }, []);
  const date = calendar(
    override && import.meta.env.DEV ? new Date(override + "T12:00:00Z") : now,
  );
  const key = storageKey(date.preview, import.meta.env.DEV);
  return (
    <Experience
      key={key + date.stamp}
      date={date}
      storeKey={key}
      dev={
        <>
          {import.meta.env.DEV && (
            <details className="dev">
              <summary>Development workshop</summary>
              <label>
                Simulate London date{" "}
                <input
                  type="date"
                  value={override}
                  onChange={(e) => setOverride(e.target.value)}
                />
              </label>
              <button onClick={() => setOverride("")}>Use real clock</button>
            </details>
          )}
        </>
      }
    />
  );
}
function Experience({
  date,
  storeKey,
  dev,
}: {
  date: ReturnType<typeof calendar>;
  storeKey: string;
  dev: React.ReactNode;
}) {
  const [progress, setProgress] = useState<ReturnType<typeof load>>(() =>
    date.preview ? {} : load(storeKey),
  );
  const [selected, setSelected] = useState<number | null>(date.today);
  const [opening, setOpening] = useState<number | null>(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [celebrate, setCelebrate] = useState(false);
  const [awakened, setAwakened] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const q = questions.find((q) => q.day === selected);
  const p = selected ? progress[selected] || fresh() : fresh();
  const [choices, setChoices] = useState<string[]>([]);
  useEffect(() => {
    if (q) setChoices(shuffled(q));
    setAnswer("");
    setFeedback("");
    setCelebrate(false);
  }, [selected]);
  function persist(next: typeof progress) {
    setProgress(next);
    if (date.preview) return;
    try {
      localStorage.setItem(storeKey, JSON.stringify(next));
      setSaveError(false);
    } catch {
      setSaveError(true);
    }
  }
  function submit(value: string, text: boolean) {
    if (!q || !value.trim()) return;
    const correct = matches(value, q);
    const next = attempt(p, correct, text);
    persist({ ...progress, [q.day]: next });
    setAnswer("");
    setFeedback(
      correct
        ? ""
        : next.multiple
          ? "A little help: choose an answer below."
          : "Not quite. Try once more. ✨",
    );
    setCelebrate(correct);
  }
  function visit(d: number) {
    if (opening !== null) return;
    setOpening(d);
    timer.current = setTimeout(
      () => {
        setSelected(d);
        setOpening(null);
        setTimeout(() => {
          heading.current?.focus();
          heading.current?.scrollIntoView({
            behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
              ? "instant"
              : "smooth",
            block: "start",
          });
        }, 30);
      },
      matchMedia("(prefers-reduced-motion: reduce)").matches ? 30 : 720,
    );
  }
  function reset() {
    persist({});
    setFeedback("");
    setCelebrate(false);
  }
  const complete = Object.entries(progress).filter(
    ([d, p]) => p.completed && (date.past.includes(+d) || date.today === +d),
  ).length;
  return (
    <div
      className={
        "app" + (date.finale ? " finale" : "") + (awakened ? " awakened" : "")
      }
    >
      <a className="skip" href="#experience">
        Skip to your Christmas question
      </a>
      <World />
      <div className="snow" aria-hidden="true">
        {Array.from({ length: 14 }, (_, i) => (
          <i
            key={i}
            style={{ left: i * 7.3 + "%", animationDelay: -i * 1.7 + "s" }}
          />
        ))}
      </div>
      <header>
        <h1>Alsu’s Advent</h1>
        <WishMagic onAwaken={() => setAwakened(true)} />
      </header>
      <main>
        <section
          className={"parchment " + (celebrate ? "celebrate" : "")}
          id="experience"
          aria-labelledby="question-heading"
        >
          {selected !== date.today && (
            <button
              className="back"
              onClick={() => {
                setSelected(date.today);
                setFeedback("");
              }}
            >
              ← Follow the lights {date.finale ? "to the village" : "to today"}
            </button>
          )}
          {q ? (
            <>
              <span className="seal" aria-hidden="true">
                ✧
              </span>
              {!date.preview && (
                <div className="eyebrow ink">
                  {selected === date.today ? "TODAY" : "FROM YOUR ADVENT"}
                </div>
              )}
              <p className="date">
                {q.day} December <span>· {q.category}</span>
              </p>
              <h2 id="question-heading" tabIndex={-1} ref={heading}>
                {p.completed ? "A secret, just for you" : q.question}
              </h2>
              {p.completed ? (
                <div className="reveal">
                  {celebrate && (
                    <div className="reveal-sparks" aria-hidden="true">
                      {Array.from({ length: 18 }, (_, i) => (
                        <i key={i} style={{ "--i": i } as React.CSSProperties}>
                          ✦
                        </i>
                      ))}
                    </div>
                  )}
                  <p className="clue" role="status">
                    {gifts[q.day].giftClue ||
                      "Your secret hiding place will be revealed here."}
                  </p>
                  <img
                    key={q.day}
                    className="gift-photo"
                    src={
                      gifts[q.day].giftImage
                        ? import.meta.env.BASE_URL +
                          gifts[q.day].giftImage!.replace(/^\//, "")
                        : import.meta.env.BASE_URL +
                          "images/gift-illustration.webp"
                    }
                    alt={
                      gifts[q.day].giftImage
                        ? gifts[q.day].imageAlt
                        : "An illustrated wrapped gift — photograph coming soon"
                    }
                    onError={(e) => {
                      e.currentTarget.src =
                        import.meta.env.BASE_URL +
                        "images/gift-illustration.webp";
                      e.currentTarget.alt =
                        "An illustrated gift — photograph unavailable";
                    }}
                    loading="lazy"
                  />
                  <aside>
                    <span>A little discovery · {q.answer}</span>
                    <p>{q.interestingFact}</p>
                  </aside>
                  {q.day === 24 && (
                    <p className="eve">
                      Merry Christmas, my darling Alsu. May there always be a
                      little wonder waiting for you. ♡
                    </p>
                  )}
                </div>
              ) : (
                <>
                  {p.multiple ? (
                    <div className="choices">
                      {choices.map((c) => (
                        <button key={c} onClick={() => submit(c, false)}>
                          {c}
                          <span aria-hidden="true">✧</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        submit(answer, true);
                      }}
                    >
                      <label htmlFor="answer">Your answer</label>
                      <div className="answer-row">
                        <input
                          id="answer"
                          autoComplete="off"
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                          placeholder="A name, a word, a little magic…"
                          required
                        />
                        <button type="submit">
                          Reveal the magic <span aria-hidden="true">✧</span>
                        </button>
                      </div>
                    </form>
                  )}
                  <p className="feedback" role="status">
                    {feedback || (p.wrong === 1 ? "Try once more. ✨" : "")}
                  </p>
                </>
              )}
            </>
          ) : (
            <div className="christmas">
              <span className="eyebrow ink">THE VILLAGE IS AGLOW</span>
              <h2 id="question-heading" ref={heading} tabIndex={-1}>
                Merry Christmas,
                <br />
                <em>my darling Alsu.</em>
              </h2>
              <p>
                Every little light holds a memory.
                <br />
                Every door is still yours to explore.
              </p>
              <p>With all my love, this Christmas and always. ♡</p>
            </div>
          )}
          {saveError && (
            <p role="alert">
              Your browser could not save progress. Keep this page open to keep
              your discoveries.
            </p>
          )}
        </section>
        {date.past.length > 0 && (
          <section className="village" aria-labelledby="village-title">
            <h2 id="village-title">Your Advent doors</h2>
            {complete > 0 && (
              <div className="progress" aria-label={complete + " discoveries"}>
                {"✦ ".repeat(Math.min(complete, 24))}
              </div>
            )}
            <div className="doors">
              {date.past.map((d) => (
                <button
                  key={d}
                  className={
                    "door-scene variant-" +
                    (d % 6) +
                    (opening === d ? " opening" : "") +
                    (progress[d]?.completed ? " completed" : "")
                  }
                  aria-label={
                    "Open " +
                    d +
                    " December" +
                    (progress[d]?.completed ? ", completed" : "")
                  }
                  onClick={() => visit(d)}
                >
                  <span className="cottage">
                    <span className="roof" />
                    <span className="door-frame">
                      <span className="light" />
                      <span className="door-leaf">
                        <span className="door-spark" aria-hidden="true">
                          ✦
                        </span>
                        <span className="number">{d}</span>
                        <span className="handle" />
                      </span>
                    </span>
                    <span className="step" />
                    <span className="completed-star" aria-hidden="true">
                      {progress[d]?.completed ? "✦" : ""}
                    </span>
                  </span>
                  <span className="door-caption">{d} December</span>
                </button>
              ))}
            </div>
          </section>
        )}
        {import.meta.env.DEV && (
          <button className="reset" onClick={reset}>
            Reset development progress
          </button>
        )}
        {dev}
      </main>
    </div>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
