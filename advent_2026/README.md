# Alsu’s Enchanted Advent

A personal Christmas woodland built with React, TypeScript, Vite and original SVG/CSS artwork. All assets are local. No runtime service, account or API is needed. Audio is omitted to keep the woodland quiet and lightweight.

## Local development

Use Node 22 or later. From this folder:

```sh
npm ci
npm run dev
npm test
npx playwright install chromium
npm run test:e2e
npm run build
npm run preview
```

Open the URL printed by Vite. The development workshop at the bottom lets you simulate any date, including 1–25 December 2026. Development progress is isolated from public progress. Reset development progress clears only the current development namespace. The public preview has its own “Begin the preview again” control.

## Personalise the gifts

Edit `src/data/gifts.ts`. Each entry has `giftClue`, `giftImage` and `imageAlt`. Place a photo in `public/images/gifts/day-01/` (and the matching folder for each day). Example:

```ts
"1": {
  "giftClue": "Your own hiding-place description here.",
  "giftImage": "images/gifts/day-01/photo.webp",
  "imageAlt": "A useful description of the hiding place"
}
```

JPEG, PNG and WebP work. Export photographs around 1600 pixels on the longest side, ideally below 500 KB. Images fit inside the frame without cropping details. Null clues and images show an illustrated placeholder; failed image loads also fall back to that illustration. No house locations have been invented.

Edit quiz questions, aliases, three distractors and trivia in `src/data/questions.ts`. Matching ignores case, accents, punctuation and spacing and compares the complete normalised answer to explicit aliases. It does not use substring or fuzzy matching.

## Dates and progress

The season is December 2026. `Intl.DateTimeFormat` uses Europe/London, independent of the device timezone. Before December only Day 1 preview is available. During Advent today appears directly, with doors for past days. From Christmas Day all 24 doors remain playable. A one-second check and focus/visibility checks update an open page. A date change returns to today automatically.

Storage keys are `alsu-enchanted-advent:2026:v1:real` and `:preview`, with an extra `development:` namespace locally. Preserve these keys across releases. Wrong text attempts (capped at two), multiple choice, completion and reveal are stored independently for each day. Browser storage is specific to a device and browser; clearing browser data removes progress. If saving fails the page continues in memory and displays a message. No public real-progress reset is exposed. Future content is excluded from rendering, though all questions are intentionally present in the client bundle.

## GitHub Pages deployment

The files in this folder are ready for ordinary static hosting. The published entry is `advent_2026/index.html`, with compiled JavaScript and CSS in `assets/` and photographs/illustrations in `images/`. GitHub Pages does not need to compile TypeScript or run Node.

For this existing repository, use Settings → Pages → Deploy from a branch → main → / (root). Commit and push this folder, including `index.html`, `assets/` and `images/`. The Advent address will be https://fedianine.com/advent_2026/. The same static files also support https://fedianine-statpro.github.io/NurseryCostCalculator/advent_2026/ when hosted without the custom domain. Asset URLs are relative, so either prefix works.

The original development HTML entry is `src/index.html`. After editing questions, clues, artwork or photographs, run `npm run build` and commit the updated generated files along with your source changes. This command compiles into `dist/`, then refreshes the directly hosted files in this folder. It replaces only generated bundles in `assets/` and preserves unrelated files and existing photographs. Keep original photos in `public/images/` so future builds copy them into `images/`.

The workflow at `../.github/workflows/advent-check.yml` checks the build and static site without changing the repository’s Pages deployment settings. It fails if the committed published files are out of date. Publication happens through the existing branch deployment after pushing; local verification does not publish the site.

Run `npm run test:pages` to test the actual published folder through an ordinary static HTTP server at both URL prefixes. This verifies asset loading, the answer/reveal flow, saved preview progress, the London midnight transition, mobile overflow and absence of development controls. No Vite server or source transformation is used for this check.

## Verification and accessibility

Vitest covers all aliases and distractors, whole-answer rejection, date boundaries and progress transitions. Playwright covers preview help, reloads, reveal, past doors, return navigation and mobile overflow. All illustrations are original SVG/CSS. Georgia and system fonts avoid external downloads. Decorative art is hidden from assistive technology. Forms have labels, feedback uses live status, doors are keyboard buttons and reduced motion removes decorative movement and shortens door transitions.
