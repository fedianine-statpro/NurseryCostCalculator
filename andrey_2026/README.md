# Freakybat: Please Stop Farming Me

A birthday adventure for Andrey. An accidental bounty notice, a legal alias, a family photograph, and one blue partyhat.

## Run locally

With Node.js installed, run this from the game directory:

```sh
npm run serve
```

Open http://127.0.0.1:8000/birthday/. No dependency installation or build step is needed. JavaScript modules need HTTP; opening index.html directly is not supported. The preview server is development tooling only.

## Publish on GitHub Pages

Keep `index.html`, `styles.css`, `js/`, `assets/`, and `vendor/` together. All runtime assets and imports are relative, including the local Three.js library. Publishing the parent repository root places this game at `/NurseryCostCalculator/andrey_2026/`. There is no backend, API key, build, or external runtime dependency. Three.js licensing is included in `vendor/THREE-LICENSE.txt`.

## Play

Click or tap the ground to walk, or a character to speak. During a conversation, click or tap anywhere in the game to continue; Space/Enter also work. Reply choices remain explicit. Settings, inventory controls, photo dialogs and camera gestures never consume dialogue. The panel has a small continue hint, with no Next button or conversation counter. Hover shows the available action and a pointer cursor. Drag to rotate; scroll or pinch to zoom. Q/E rotate, +/− zoom, C centres the camera. Escape closes panels or cancels a walk.

The map provides directions and a destination list with districts and approximate distances. The journal separately checks off registration, the camera, Alex's rehearsal, and each family conversation. Inventory keeps the camera, photographic evidence with testimony, and the partyhat. The hat is granted at the bank and equipped by Alisa at the shore.

On phones, the world uses the full width and panels open as drawers. Controls move to the right in landscape. Settings include larger text, reduced motion, sound, and per-character browser voices. Music and effects default to on and start after the welcome screen's login click. Character voices default to off; enable them in Settings. Existing saves receive those defaults once; subsequent mute and voice preferences persist.

The continuous 64×64 map now spreads the required story across the bank square, Centerpoint market, Danya's south-village home, the park entrance, and the family shore. Gardens, cottages, woodland, a bridge, island watchtower, boats, standing stones, flowers, reeds, and eight optional discoveries fill out the routes. Benches are quiet; no ambient narrator interrupts the story.

## Canonical story and saves

[Freakybat-Full-Story-v4.md](Freakybat-Full-Story-v4.md) is the replacement manuscript. It contains the creative direction and source/provenance notes; borrowed dialogue is not represented as wholly original. The older plan and dialogue review are historical material.

`node tools/import-story.mjs` imports the canonical dialogue into `js/script.js`. All eight decisions have three branches. `js/quest.js` assembles selected branches and continuations; `js/state.js` owns guarded progression; `js/main.js` runs interactions and saves the current scene line and selected choice.

Registration and camera collection can happen in either order. Alex runs immediately after the camera, including after a reload. Anya precedes the girls; either daughter may be first. Both conversations precede the photograph. The bank is the comic climax, followed by the family reunion, the selected cover-story callback, and Victor's sincere letter.

Rewards are idempotent. Ownership, equipment, reunion completion, and closing the letter are separate saved states. Reloading resumes an active conversation. Older story saves start v4 with an explicit notice while retaining audio, voice, text, and reduced-motion preferences. No incompatible old quest rewards or flags are combined with v4.

## Portraits and recordings

The eight personal characters have photo-based pixel portraits. Fictional portraits remain in the [portrait library](assets/portraits/index.html); Keeper, Banker, and Photographer participate in v4. [Files and generation prompts](assets/portraits/README.md) document all fourteen assets. Missing files fall back to code-drawn illustrations.

[Recording scripts](recording-scripts/README.md) provides one document per character and stable clip IDs for 365 unique spoken lines. Retired characters have no recording requirement. Browser voices work now; place finished MP3s under `assets/voices/` and map them in `js/recordings.js`. Unrecorded lines use browser speech. Device voices vary; text remains visible without sound.

Run `node tools/build-recording-scripts.mjs` after dialogue edits. System captions, menu labels, and nonverbal ellipses are not spoken. Music lowers during speech; voice volume is separate.

## Verification

```sh
npm test
node tools/v4-browser.mjs
node tools/v4-presentation.mjs
node tools/v4-art-check.mjs
node tools/dialogue-input-check.mjs
node tools/v4-timing.mjs
```

Browser tools use Chrome installed in its standard Windows location, isolated profiles, and the local static preview. Artifacts go to ignored `test-results/`.

The browser suite exercises all 24 branches across three complete routes, all three callbacks, both preparation orders, both daughter orders, real reloads, photograph cleanup, 22 reachable destinations, portrait loading, static project-prefix paths, and responsive layouts. Presentation checks cover all decision menus, keyboard guards, larger text, portrait fallback, pointer interactions, camera gestures, optional conversations, and save migration. Compatibility entry points retain the old tool filenames.

The timing tool uses real-time movement, an explicit 180-word-per-minute reading assumption, and fixed decision/photograph/letter delays. Its result is a scripted runtime measurement, not a first-time human playtest. Phone emulation does not establish performance or ergonomics on real hardware. Comic delivery and final visual quality still benefit from ordinary player feedback.

The measured v4 route took **11 minutes 1 second**. [Implementation and verification report](IMPLEMENTATION-v4.md) records the changes, checks, timing assumptions, and remaining practical limits.



