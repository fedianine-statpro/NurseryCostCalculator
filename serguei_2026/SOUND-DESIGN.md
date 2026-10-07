# Sound design and asset handoff

The audio system is implemented. The six family recordings are present and unchanged. **All nine original music arrangements, two ambience loops and eighteen effects are supplied and enabled.** Music is rendered offline from real CC0 acoustic instrument samples. No runtime synthesizer or comedy beeps are shipped. See [licences](assets/audio/LICENSES.md) and [production measurements](assets/audio/production-report.json).

The canonical asset manifest is [sound-data.js](sound-data.js): exact local filenames, loop flags, scene mappings, cue timing, conservative delivery levels and individual generation briefs. It is metadata, loaded synchronously with the other small scripts; soundtrack audio is fetched only after sound enablement and only for the current scene or gesture.

For separate asset generation, [assets/audio/manifest.json](assets/audio/manifest.json) is a portable snapshot with expanded mappings for every actual scene ID and the six existing recording filenames. After changes, update it with `node tests/export-audio-manifest.cjs`; runtime playback reads the canonical JavaScript manifest directly.

## Music supplied

Use one original motif throughout: **D4–A4–F#4–E4 | D4–B3–A3–D4**, with space between phrases. This motif is used by all nine original arrangements, without borrowing existing songs. Softly filtered upright piano supplies the piano texture; nylon guitar and real plucked/bowed strings supply the other voices.

| Filename under `assets/audio/music/` | Scenes | Arrangement |
| --- | --- | --- |
| `archive-theme.ogg` | `cover`, `inventory` | Felt piano, soft nylon guitar, intimate tape-like warmth without a noise bed |
| `childhood-theme.ogg` | `birth`, `credits`, `childhood`, `prediction` | Light plucked strings, occasional wooden percussion |
| `ledger-theme.ogg` | Moscow/university and corporate chapters | Dry, methodical, understated pizzicato and sparse piano |
| `army-theme.ogg` | `army` | Sparse acoustic guitar; peaceful room, no martial sounds |
| `wedding-theme.ogg` | `irina`, `wedding`, `natasha` | Warm gentle instrumental waltz |
| `cuba-theme.ogg` | `cuba`, `victor` | Light syncopation, nylon guitar, soft hand percussion |
| `canada-sparse.ogg` | `canada-start`, `apartment` | Mostly rests and neutral sparse piano, played at reduced level |
| `home-theme.ogg` | Settled Canadian scenes and indoor hobbies | Warm guitar/piano return of the motif |
| `finale-theme.ogg` | `montage` through `end` | Fuller affectionate arrangement, no triumphant fanfare |

All nine are seamless 60–90 second loops. Export stereo Ogg, approximately 96–128 kbps at 44.1 kHz, approximately −23 LUFS and ≤ −3 dBTP. Keep lossless originals separately. Wrap reverberation into the start, use an exact whole-bar boundary, and avoid silence or baked-in fades at either end. The manager loops decoded Web Audio buffers without restarting on related pages; it cannot correct an audible seam in the supplied composition. Optional `loopStart`/`loopEnd` values are seconds within the decoded buffer.

`kindness`, `canada-search`, `canada-persistence` and `canada-callback` have no musical or ambient bed. `tent`, `fishing` and `fish-result` have lakeside ambience without music. The motif returns at `montage`; `family-message` uses a reduced level before voices begin.

## Ambience supplied

Under `assets/audio/ambience/`:

- `quiet-room.ogg`: still domestic air, barely perceptible occasional wood creak; no clock, speech, hum or constant crackle.
- `lake-air.ogg`: soft shore water and breeze, one or two distant bird calls per minute, no conspicuous repeated bird loop.

Both are 40–80 second seamless stereo loops, about −30 LUFS and ≤ −8 dBTP. They share the effects/atmosphere control and play much softer than voices.

## Interaction assets supplied

Under `assets/audio/effects/`, short mono or narrow stereo WAV files at 44.1 kHz, natural tails, peaks ≤ −9 dBFS. Individual generation briefs and durations are in the manifest.

| Filenames | Actual trigger |
| --- | --- |
| `page-a.wav`, `page-b.wav` | Ordinary page continuation, alternating variations |
| `folder-a.wav`, `folder-b.wav` | Opening the main archive or an inspection folder |
| `document-slide.wav` | Leaving `moscow` via “Достать личное дело студента” |
| `chess-place.wav` | Opening a chess exhibit, after the folder movement |
| `stamp-a.wav`, `stamp-b.wav` | Confirmed editorial reactions |
| `stamp-official.wav` | Accountant conclusion and closing the flower case |
| `flower-folder.wav` | Opening the army flower case |
| `ledger-drop.wav` | Accountant reveal, 320 ms after the career choice |
| `pencil-correction.wav` | Entering `irina`, a single brief correction accent |
| `irina-resolution.wav` | “ИРИНА ОСТАЛАСЬ”, a small original guitar/piano acknowledgement |
| `measure-tape.wav` | Selecting “Вот такой!” in `fishing` |
| `water-plop.wav` | Revealing the modest fish in `fish-result` |
| `photo-place.wav` | Family photographs overlapping the classification cards in `achievement`; no photo-turning controls are restored |
| `recorder-start.wav`, `recorder-stop.wav` | Reserved: native audio controls are retained, so no custom transport effect is added over voices |

Prediction leaves a 320 ms comic pause, then ledger contact and a decisive stamp at 680 ms. CSS motion matches those cues. Animation never blocks reading or navigation, and reduced-motion settings remove motion. Moving on cancels pending cues. No sounds play on hover, menu/settings buttons, every sentence, or through quiet passages. One effect can play at a time, with a 180 ms input guard and cancellation of stale asset loads.

## How to replace assets

1. All listed files are supplied. The manifest briefs remain available if you want to replace an arrangement or effect.
2. Save each file at its proposed path. You can also change its `src` in `sound-data.js`.
3. Audition its level, naturalness and loop boundary, then set that asset's `ready` to `true`. Partial collections work; missing entries stay silent.
4. For supplied original music, record the creator and redistribution permission in `provenance.generatedOrRecordedAssets`. For third-party work, record the source URL, creator and exact licence in `provenance.thirdPartyAssets`. Existing CC0 source credits are recorded in assets/audio/LICENSES.md.
5. Publish the static files normally. No build, server processing, streaming service or external audio dependency is needed. Background loading uses `fetch`, so preview new beds over HTTP rather than a `file://` URL.

## Playback and controls

- Three independent layer switches and volume sliders; master mute covers everything. Initial music/effects levels are 22%/18%, family recordings 85%. Native recording volume and seeking remain available.
- Preferences use `sergey-archive-sound-v1`, separate from the unchanged story progress key and schema. Background music defaults to off; ambience/effects and family recordings remain enabled. Existing music preferences are switched off once by preference revision 2, after which explicit choices persist. Enable sound immediately if permitted, otherwise on the first game click or keypress. An explicit saved master mute is respected. Family recordings always require their own Play action.
- A native recording Play is explicit user initiation. Music drops to silence over 650 ms and ambience to 8% of its normal level; cues are cancelled. Restore over 1.8 seconds after pause/end. Only one foreground recording plays at a time.
- Scene/folder departure and closing a recording sleeve stop the affected recording. Master mute pauses all recordings and stops background/effects immediately. Native Play while master-muted stays muted.
- One music layer and one ambient layer, each with at most two sources during a crossfade. Crossfades last about 1.4 seconds; obsolete requests cannot start after a newer scene or mute.
- Tab hiding stops backgrounds and effects and remembers background positions. Returning starts one source per layer. An explicitly playing family recording is allowed to continue, retaining its priority. No family recording is automatically resumed after pause.
- Failed fetches, decoding or browser permission failures leave navigation available. A blocked background start is reported as blocked, with a retry control. Only three decoded background buffers are retained in the cache; short effect buffers are reused.
- Family voices receive no extra distortion, looping, narration, truncation or processing.

## Verification

`tests/sound-design.cjs` runs browser checks with Playwright and Chrome. Install Playwright outside the static site or in your development environment, then run:

```powershell
$env:ARCHIVE_PLAYWRIGHT_PATH = 'C:\path\to\node_modules\playwright'
$env:ARCHIVE_CHROME = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
node tests/sound-design.cjs
```

The test uses a temporary local HTTP server and in-memory, very quiet sine-wave fixtures to verify background loading, looping and cue scheduling. These fixtures are not saved or included as game music. Actual supplied family MP3 files exercise native playback, pause, seeking, volume, foreground priority and navigation. Visibility events and rejected audio-context resume are explicitly simulated. Mobile layout and keyboard access are checked at a 320 px viewport.

Production checks measure decoded peaks, integrated loudness, duration and loop-edge discontinuity. Browser checks also decode every actual local asset and start the supplied beds. Subjective listening quality and Safari/iOS hardware behaviour are not established by these automated checks.

The completed Chrome run passed **47 checks**. JavaScript syntax checks passed, and SHA-256 hashes confirmed all six supplied MP3 files were unchanged. The story and photo data were preserved; the original progress key still contains only `sceneId` and `introSeen`.

## Actual production

Nine 60–76 second music loops use the same original motif, phrase rests and softly varied acoustic samples. Music measures approximately −23 LUFS (sparse Canada −27); ambience measures −36/−31 LUFS. Foley peaks are at or below −12 dBFS. Lake ambience contains gentle water without bird calls. Some foley is adapted from analogous physical actions, as documented in the licences. Two recorder transport files remain reserved because recordings use native controls. All assets remain lazy loaded.

The offline renderer is tools/produce-audio.cjs. Its source cache, lossless masters and note-event scores are backed up outside the published site in C:/Github/dad-audio-originals/soundtrack-20261007. No production tools, raw instrument library or lossless masters are required by the site.
