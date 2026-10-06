# СЕРГЕЙ · Юбилейный спецвыпуск

A Russian-language birthday game presented as a family magazine. Eight chapters, an introduction and a family finale; intended for approximately 8–10 minutes of relaxed reading and interaction. Reading speed determines duration. No countdowns, scores or losing states.

## Run locally

Open `index.html` in a modern browser. There are no dependencies, external requests or build steps. Classic scripts and relative paths support opening the file directly. Browser policies may restrict saving progress from a local file; the story still works.

For consistent local storage, serve this folder with a static server (for example, if Python is installed, `python -m http.server 8000`) and visit `http://localhost:8000`.

## GitHub Pages

Create a GitHub repository and push this folder, including `index.html` at the repository root. In the repository's **Settings → Pages**, select **Deploy from a branch**, choose your branch and **/(root)**, then save. GitHub supplies the site URL. No build configuration or server code is required. Relative paths also support a project URL such as `https://YOUR-NAME.github.io/YOUR-REPOSITORY/`.

## Edit the family story

All biography, dates, captions, buttons and reactions live in `story-data.js`, in `window.MAGAZINE.scenes`. Keep quotes and commas valid JavaScript. `body` is an array of paragraphs. `year` is display text; approximate dates are intentionally labelled. `chapter` sets the chapter label and palette. `source`, `stamp`, `facts` and `aside` are optional.

Scene types:

| Type | Behavior |
| --- | --- |
| omitted / article | Text, optional photo, continuation |
| cover | Magazine cover |
| document | Official form with optional facts |
| choice | Buttons, then a reaction and continuation |
| inspect | Open every item in any order; continue once all are opened |
| reveal | Button reveals a result; a second button continues |
| quiet | Spacious reading page |
| montage | Labelled archive objects |
| birthday | Family letter from `birthdayMessage` |
| end | Closing page with a replay button |

Choice reactions can be shared through the scene's `reaction`, or overridden on an individual choice. `next` labels the continuation after a choice. For reveal scenes, `next` labels the reveal and `afterNext` labels the continuation. Folder `after` and `close` provide the flowers case closure. Each scene needs a unique, stable `id`.

## Replace photographs

Put your photographs in `assets/photos/`, using the filenames referenced in the story:

- `sergey-childhood.jpg`
- `sergey-accountant.jpg` (shown with the «БУХГАЛТЕР» career reveal)
- `sergey-army.jpg`
- `sergey-irina.jpg`
- `natasha-family.jpg`
- `cuba-family.jpg`
- `canada-house.jpg`
- `sergey-fishing.jpg`
- `family-together.jpg`

Alternatively, change each scene's `photo` path. Edit `caption` alongside it; the same caption supplies image alternative text. Missing images display a paper placeholder. No personal photographs are included. Landscape or portrait photographs work; images retain their proportions. Resize large originals before uploading for faster loading.

### Extra album photographs

There are **24 photo slots in total**: the nine main photographs above plus these fifteen optional images. Put them in `assets/photos/` using these filenames, or edit `photoAlbums` near the top of `story-data.js`. Each album shows only successfully loaded photos; missing optional images do not leave empty frames. Albums show up to three photos side by side on desktop and stack on smaller screens. There is no extra button or automatic slideshow.

| Filename | Photograph / location in the story |
| --- | --- |
| `mira-yura.jpg` | Mira and Yura; childhood chapter |
| `sergey-young.jpg` | Another young Sergey photo; childhood chapter |
| `sergey-guitar.jpg` | Sergey with a guitar; inside the guitar folder |
| `sergey-irina-wedding.jpg` | Wedding photo; alongside the early couple photo |
| `cuba-life.jpg` | Family life in Cuba; Cuba chapter |
| `victor-baby.jpg` | Baby Victor; after opening the demographic appendix |
| `canada-early.jpg` | Family in early Canada years; migration opening |
| `sergey-camping.jpg` | Sergey camping; tent scene |
| `sergey-hiking.jpg` | Sergey hiking; tent scene |
| `family-camping.jpg` | Family camping; tent scene |
| `sergey-fishing-catch.jpg` | Another fishing photo, optionally with a catch; fishing question |
| `sergey-chess.jpg` | Sergey playing chess; inside the lifelong chess folder |
| `sergey-cartoon.jpg` | Still from one of Sergey's animated films; animation scene |
| `family-years.jpg` | Favourite family memory; birthday finale |
| `family-celebration.jpg` | Family celebration; birthday finale |

Captions are editable next to each path. An optional `alt` field supplies a separate image description; otherwise the caption is used. Album keys usually match a scene ID; folder items and reactions can explicitly name an `album`. Album photos are optional and do not affect story progress. Captions avoid inferring dates, places or events beyond the supplied story; adjust them to fit the actual photos you choose.

The homemade childhood magazine uses an original SVG illustration labelled as an editorial illustration. No photograph of the original magazine is needed.

## Audio

The visible sound switch starts off. Short paper, stamp and fanfare effects are synthesized locally with Web Audio after user interaction. Browsers without Web Audio can still play the whole game. Effects are implemented in `effect()` in `app.js` and stay quiet while a family recording is playing.

Six trimmed family recordings are included. Every recording uses native browser play/pause, seeking and volume controls with a visible title. Nothing autoplays. Pressing play explicitly turns sound on. Only one recording plays at a time; changing a page or archive folder, closing the bonus archive, or switching sound off stops playback. A missing or unsupported recording shows a message and leaves the story available.

| Prepared file | Original excerpt (minutes:seconds) | Location |
| --- | --- | --- |
| `mira-voice.mp3` | `mira-recording.mp3` 04:04–04:37 | Childhood opening, alongside the family photographs |
| `sergey-vysotsky.mp3` | `sergey-singing.mp3` 00:08–02:40 | Vysotsky folder in the army chapter and lifelong interests |
| `family-birthday.mp3` | `family-recording.mp3` 01:15–03:04 | Birthday finale |
| `cake-cutting.mp3` | `cake-recording.mp3` 00:00–00:21 | Optional family-table archive in the finale |
| `cake-candle.mp3` | `cake-recording.mp3` 21:21–21:28 | Optional family-table archive in the finale |
| `irina-funny-song.mp3` | `cake-recording.mp3` 27:23–28:50 | Optional family-table archive in the finale |

Edit `audioClips` near the top of `story-data.js` to replace files or change titles, captions and displayed durations. `sceneAudio` maps scene IDs to clip IDs; `bonusAudio` configures the expandable family-table archive. An archive item names its recording with `audio: 'vysotsky'`. Removing a mapping removes that player. `preload="none"` avoids loading the entire recording until it is requested. The default experience remains approximately 8–10 minutes; listening to all six unique clips adds 6 minutes 49 seconds, and replaying the Vysotsky song adds more time.

### Audio preparation and originals

The source files were stereo containers with an almost silent right channel in the sampled sections. The prepared clips centre the dominant left-channel signal in both output channels. Speech remains centred; singing adds quiet 40ms/65ms delayed reflections at 4% gain to give a gentle stereo ambience. This is an enhancement of the mono source, not a recovery of separately recorded instruments or voices.

Clips use two-pass [FFmpeg loudness normalization](https://ffmpeg.org/ffmpeg-filters.html#loudnorm) targeting -18 LUFS, a -1.5 dB true-peak ceiling and 11 LU loudness range. Songs have 0.25-second fade-ins and 0.7-second fade-outs; speech uses short 0.04/0.12-second fades. Output is 44.1kHz, two-channel MP3 at 128kbps, without original metadata. Timestamp boundaries refer to the unmodified source files; MP3 encoder padding can make reported duration a few hundredths of a second longer.

Full original recordings and the preparation report are backed up outside the published site in `C:\Github\dad-audio-originals\20261007-001839`. Only the six prepared clips belong in `assets/audio/`. Preparation used temporary FFmpeg tools; no audio processing dependency or build step is required to play or publish the game. No commercial Vysotsky recording is included; the Vysotsky clip is Sergey's family performance.

## Reorder or disable scenes

Move complete scene objects within the `scenes` array to reorder them. Navigation follows array order. Add `enabled: false` to an object to omit it. Keep IDs stable so existing bookmarks survive reorderings. If a saved scene no longer exists or is disabled, the game opens at the beginning. Chapter labels are defined in `app.js` if you add a new chapter. The army and finale intentionally allow four options; other choice scenes have three or fewer.

## Change the birthday message

Edit the `birthdayMessage` array at the top of `story-data.js`. Every entry becomes a paragraph in the finale. Edit the two introductory paragraphs on the `family-message` scene separately if desired.

## Progress and restart

The key `sergey-magazine-progress-v1` in `localStorage` contains only `sceneId` and `introSeen`. It does not store choices, recordings, photos, personal data or sound preferences. On return, the game offers **Продолжить с места остановки** and **Начать сначала**. A scene resumes at its beginning; partially opened folders and reactions are not saved. Saving failures never prevent navigation. Progress belongs to this browser and origin; opening the local file and visiting the published site use different storage.

**Меню → Начать сначала** asks for a clear restart confirmation. The last page also offers a replay. No progress is transmitted anywhere.

## Layout and accessibility

The game uses system fonts, body text of at least 20px, large native buttons, strong contrast and keyboard focus indicators. Enter/Space activates focused buttons. New pages focus their heading; opened folders focus their detail heading. Reduced-motion settings disable page and stamp animations. Layouts stack at smaller widths, including 320px. Animations never delay reading or navigation. The final editorial classification message is a story result, with a visible continuation.

`styles.css` controls the visual system; `app.js` controls rendering, navigation, saving and sound. The `assets/illustrations`, `assets/newspaper` and `assets/icons` folders are available for future family additions; current illustrations are original inline SVG in `app.js`, and paper textures are CSS.
