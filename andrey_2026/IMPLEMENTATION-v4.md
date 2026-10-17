# Story v4 implementation and verification

Implemented **Freakybat: Please Stop Farming Me** from [the replacement manuscript](Freakybat-Full-Story-v4.md).

## Story and gameplay

- Replaced the old quest, event callers, objectives, inventory progression, ending, and letter.
- Imported all eight decisions and 24 branches. Only the selected branch runs, followed by its shared continuation.
- Registration and camera collection work in either order. Alex's rehearsal follows the camera directly and remains pending after interrupted saves.
- Anya, Alisa, and Arisha each have their full individual conversation. Either daughter may be first; both conversations are required before photography.
- The family provides the capture photograph and witness testimony as one evidence item.
- The bank grants the hat once. Alisa equips the already-owned hat at the reunion. The selected cover-story callback occurs at the reunion.
- Victor's letter opens on a normal advance, matches the manuscript exactly, and is marked read only on close.
- Optional conversations run only when sought out. Completed scenes give current hints instead of restarting.
- Removed the old sandwich transformation, pet adoption, photography misfires, coin commission, payment duel, cracker, skills surface, and ambient narration from gameplay.
- Nonverbal ellipses remain click-to-advance and are not spoken.

## World and presentation

The existing continuous 64×64 map is retained, with a much larger story footprint. The bank square, market, south-village home, park entrance, and family shore are separate destinations. Bank-to-house distance is over 18 tiles; bank-to-shore distance is over 30. Each daughter has her own actor interaction.

New scenery includes an open-front stone bank, timber-framed cottages, a market awning, a park gate and registration table, a birthday picnic, lantern posts, crates, barrels, gardens, path edging, planted woodland, flowers, reeds and water ripples. The island, bridge, tower, landing and quiet discoveries remain explorable. Signs use readable colours and scenery fades when it obscures the player or a nearby speaker.

The map lists districts and approximate distances. The journal separately tracks parallel tasks and each daughter. Camera, evidence, witness testimony and claimed/equipped hat states use the existing panels. Long choices wrap on phones; Enter cannot skip an unselected decision. Per-character browser voices and the existing portraits are preserved.

The evidence artwork remains identical after live pose and equipment changes. Ending photography does not create another item.

## Save behaviour

Story version and save version are 4. Old story saves enter the new-story path with an explicit notice while retaining sound, voice assignments, text size and reduced-motion preferences. Incompatible old quest flags and rewards are discarded.

Active scene ID, line index and selected branch are persisted. Browser reload checks cover scene starts, selected branches, camera grant, photograph grant, hat grant, equipment, reunion completion, and the closed letter.

## Checks completed

- **20 automated tests passed.**
- Three full browser routes covered **all 24 branches**, all three cover-story callbacks, both preparation orders and both daughter orders.
- All **22 map destinations** were reachable on the built collision map.
- All **14 portrait assets** loaded.
- Eight decision menus were checked at laptop, portrait-phone and landscape-phone sizes, including long labels and keyboard handling.
- Larger text, active-conversation settings, missing-portrait fallback, actual projected world clicks, hover cursors, orbit, pinch and exploration were checked.
- Early actor visits, repeat hints, pending daughter routing, optional meditation, football and the post-letter invitation were checked.
- Repeated photo renders retained identical evidence artwork and stable GPU geometry usage.
- Runtime assets stayed on the static local origin with the project prefix. No unexpected failed requests or browser errors occurred.
- Recording scripts were regenerated: **365 unique spoken lines** across the character documents.

Commands:

```sh
npm test
node tools/v4-browser.mjs
node tools/v4-presentation.mjs
node tools/v4-art-check.mjs
node tools/v4-timing.mjs
```

## Duration

The real-time browser run took **660.596 seconds — 11 minutes 1 second**, rounded. It used the registration-first route, the money cover story, Alisa first, and the first reply at each decision.

Movement was not accelerated. Dialogue used an explicit 180-word-per-minute reading assumption with a minimum line delay; the letter had a fixed 40-second delay. There were 286 actions. This is a scripted reading-and-walking measurement, not a first-time human usability result or a player-facing timer.

Local artifacts are under ignored `test-results/`: route verification, timing JSON, art verification and desktop/mobile screenshots.

## Remaining practical limits

The game remains an original small browser adventure with procedural low-poly art and browser speech. The checks do not establish AAA production quality, real-phone performance, first-time wayfinding, or the comic delivery of a human cast. Those require real-device and player feedback. The source portraits and future recorded voices can be updated without changing story IDs.

The game remains fully static for GitHub Pages. No backend, external runtime library, build step or API key was added.

## Dialogue input and audio update

Sound and browser voices now default to on, starting from the login interaction. An audio-defaults version updates existing saves once and preserves later mute/voice choices. Click or tap anywhere in the game, or use Space/Enter, to advance a normal dialogue line. Reply choices remain explicit. Next buttons and conversation counters have been removed. Camera gestures, controls and modal dialogs are protected from accidental advancement. `node tools/dialogue-input-check.mjs` exercises real mouse, touch and keyboard input, saved audio preferences and choice/modal protection.


