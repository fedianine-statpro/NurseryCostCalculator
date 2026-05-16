# Globe Detective

A retro CRT-style international detective game. Vanilla HTML/CSS/JS — no build step, no dependencies. Ships to GitHub Pages as static files.

## Play

Open `index.html` directly in a browser, or host the folder on GitHub Pages.

> Tip: WebAudio sound needs a first click before it'll play, so click anywhere on the title screen to enable sfx.

## How to play

1. **Briefing** — read the Crimnet brief. You have 7 in-game days to catch the thief (the boss case gives you 8).
2. **Map** — click cities to fly there. Flights cost time (4–14 hours).
3. **Investigate** — at each city, pick one of three locations. Each location has a **specialty** that hints at what the witness tends to know (currency, language, hobbies, marks, etc.) so you can plan which to hit first.
   - Some witnesses point to the next city in the trail.
   - Others describe what the suspect looked like (a trait).
   - Some are dead ends — but you spent the hours anyway.
4. **Detective's Notebook** (`Notebook` button on the map screen) — every city you visit auto-records its language, currency, flag, landmark, food, climate, and one notable fact. Facts that were specifically called out in a clue are marked with a green ▸ — they're the breadcrumbs the witnesses left you.
5. **Crime Lab Almanac** (`Almanac` button) — searchable database of every city in the game. Costs 2 in-game hours per query, so use it judiciously. Filter by continent or search by name, currency, language, flag, food, or landmark.
6. **Dossier** — collect 3+ traits, **or** narrow the matching suspects to exactly 1 (the dossier shows a live count), then select the matching suspect and **ISSUE WARRANT**.
   - Each suspect has a signature **MO** shown in the dossier (e.g. "leaves a single playing card").
   - Wrong warrant at the final city = 12-hour penalty.
   - The dossier soft-blocks issuing a warrant against an already-eliminated suspect.
7. **Arrest** — fly to the final city of the trail *with the correct warrant* before the clock runs out.

## Career & promotions

Your progress carries between sessions (localStorage):

- Each closed case advances your **rank**: Rookie → Detective → Inspector → Super Sleuth → Ace Detective.
- After every win the chief asks **one doc-check trivia question** drawn from facts you actually encountered ("Which city uses the dirham?"). Correct → promoted. Wrong → rank held for now.
- The final case (**Crown of Eight Empires**) is locked until you've closed 4 other cases.

You can wipe your career file with the **RESET CAREER** button on the case-select screen.

## Languages

The game supports English and Russian. Toggle with the `EN | RU` buttons in the top-right HUD. Your choice is remembered between sessions (localStorage).

To add another language: create `js/i18n/<code>.js` mirroring the structure of `en.js`, then register it in `js/i18n/i18n.js` and add a button in `index.html`.

## Keyboard

- `Space` / `Enter` — skip typewriter text
- `Esc` — toggle dossier ↔ map (also closes notebook/almanac back to the map)

## Ranks (per-case)

The per-case epilogue rank reflects how clean a single chase was:

- **ACE DETECTIVE** — caught them with days to spare
- **INSPECTOR** — caught them comfortably
- **DETECTIVE** — caught them, barely
- **ROOKIE** — missed the catch (or made it ugly)

(The career rank — promoted via the doc-check trivia — is separate and persists across sessions.)

## Hosting on GitHub Pages

1. Push this folder to a GitHub repo.
2. Settings → Pages → Build and deployment → Deploy from a branch → `main` / `/ (root)`.
3. Your game will be at `https://<user>.github.io/<repo>/`.

## Structure

```
index.html
styles.css
js/
  main.js              # screen routing, game loop
  world-map.svg.js     # inline SVG world map
  data/
    cities.js          # 18 cities with locations + specialties + continent
    suspects.js        # 10 suspects with signature MOs + trait combos
    cases.js           # 8 hand-authored cases (C-008 is the V.I.L.E. boss)
  engine/
    state.js           # game state object + reducers + fact tracking
    clock.js           # travel-time bands
    clues.js           # noir clue templates + destination-fact tagging
    warrant.js         # trait matching + live match counter
    progress.js        # persisted career, V.I.L.E. ladder, doc-check trivia
  ui/
    map.js             # SVG map + city markers
    dossier.js         # suspect grid + trait list + match counter + MOs
    notebook.js        # Detective's Notebook (auto-recorded facts)
    almanac.js         # Crime Lab Almanac (searchable city database)
    narrator.js        # typewriter renderer
    effects.js         # WebAudio sfx
```

## Legal note

Inspired by the detective-travel genre. No characters, names, art, music, or text from any existing franchise. All cases, suspects, and dialogue are original.
