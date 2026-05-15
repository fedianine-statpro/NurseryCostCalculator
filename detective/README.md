# Globe Detective

A retro CRT-style international detective game. Vanilla HTML/CSS/JS — no build step, no dependencies. Ships to GitHub Pages as static files.

## Play

Open `index.html` directly in a browser, or host the folder on GitHub Pages.

> Tip: WebAudio sound needs a first click before it'll play, so click anywhere on the title screen to enable sfx.

## How to play

1. **Briefing** — read the case. You have 7 in-game days to catch the thief.
2. **Map** — click cities to fly there. Flights cost time (4–14 hours).
3. **Investigate** — at each city, pick one of three locations to question witnesses.
   - Some witnesses point to the next city in the trail.
   - Others describe what the suspect looked like (a trait).
   - Some are dead ends — but you spent the hours anyway.
4. **Dossier** — once you've collected 3+ traits, open the dossier (top-right or `Esc`), select the matching suspect, and **ISSUE WARRANT**.
   - Wrong warrant = 12-hour penalty.
5. **Arrest** — fly to the final city of the trail *with the correct warrant* before the clock runs out.

## Languages

The game supports English and Russian. Toggle with the `EN | RU` buttons in the top-right HUD. Your choice is remembered between sessions (localStorage).

To add another language: create `js/i18n/<code>.js` mirroring the structure of `en.js`, then register it in `js/i18n/i18n.js` and add a button in `index.html`.

## Keyboard

- `Space` / `Enter` — skip typewriter text
- `Esc` — toggle dossier / map

## Ranks

Faster and cleaner = higher rank.

- **ACE DETECTIVE** — caught them with days to spare
- **INSPECTOR** — caught them comfortably
- **DETECTIVE** — caught them, barely
- **ROOKIE** — missed the catch (or made it ugly)

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
    cities.js          # 18 cities with clue templates
    suspects.js        # 10 suspects with trait combos
    cases.js           # 5 hand-authored cases
  engine/
    state.js           # game state object + reducers
    clock.js           # travel-time bands
    clues.js           # noir clue templates
    warrant.js         # trait matching
  ui/
    map.js             # SVG map + city markers
    dossier.js         # suspect grid + trait list
    narrator.js        # typewriter renderer
    effects.js         # WebAudio sfx
```

## Legal note

Inspired by the detective-travel genre. No characters, names, art, music, or text from any existing franchise. All cases, suspects, and dialogue are original.
