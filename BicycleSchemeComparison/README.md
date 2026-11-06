# London Bike Finder

A static, mobile-friendly comparison of Santander Cycles, Lime and Forest in London. Includes electric/pedal filtering, dated ride schedules, eligibility and resident discounts, minute-bundle optimisation, work quotes, and editable app-dependent prices.

## View locally

With Node.js 22 or newer, run from this directory:

```sh
node preview.mjs
```

Open **http://127.0.0.1:8000/BicycleSchemeComparison/**. Serve the files over HTTP; browsers generally block ES module imports when opening `index.html` directly from disk. Set `PORT` to change the preview port.

## Host on GitHub Pages

This folder sits within the existing `NurseryCostCalculator` repository. Commit and push the files, then use the repository’s existing GitHub Pages publication process. If Pages serves the repository root, this page will be at:

```text
https://<your-pages-domain>/BicycleSchemeComparison/
```

For a new standalone repository, put this directory’s contents at the root and select **Settings → Pages → Deploy from a branch → your branch → /(root)**. The page uses relative asset URLs, so both arrangements work. No build, API key, npm installation, or server-side application is needed. Deploy `index.html`, `styles.css`, `app.mjs`, `pricing.mjs`, and `calculator.mjs` together. The development tools and tests need not be published.

## Update prices

Research was checked on **6 November 2026**. This is a dated catalogue, not a live feed. Linked official sources and assumptions are available at the bottom of the page. Some Lime and Forest offers can only be confirmed against an individual app account.

- `pricing.mjs`: default amounts in integer **pennies**, source URLs, research date, eligibility labels and price-editor fields.
- `calculator.mjs`: charging rules, provider-specific eligibility, bundle minute allowances/expiry, resident restrictions, subscription allowances and calendar renewals. Structural offer changes belong here, not just in the price table.
- `app.mjs`: display text, source notes and the price-editor UI. Keep its methodological descriptions consistent with the engine.

Change all relevant catalogue amounts, pricing rules, explanatory text and the research date together. Update regression tests with independently checked examples. Personal price edits are stored only in the visitor’s browser and are explicitly labelled. Reset details restores the original catalogue.

The current model treats LimePrime’s five-minute threshold as inclusive, uses standard £1 + 31p/min Lime PAYG, models Forest Plus as 1,200 pooled minutes/calendar month, and assumes new bundles can be purchased after depletion. These are estimates to verify in-app. Bundle overage is per minute without another unlock within the same ride. Bundles cannot overlap or stack with subscriptions. The algorithm optimises only these supported options; it is not a claim that every personal or experimental offer has been considered.

Regular mode models selected weekdays over 30 or 365 days. Visitor mode models 1–30 consecutive days. Two daily rides are at 09:00 and 17:00; other ride counts are spread between 09:00 and 21:00. Fixed 24-hour days do not account for DST. Full annual Santander payments are counted, with monthly equivalents shown separately. Work quotes are net monthly payroll estimates, with a separate annual commitment gate; Santander work quotes use per-ride allowances and started 60-minute overrun blocks. Forest and Lime work quotes use pooled monthly allowances.

No live availability, geolocation, routing, login, tracking, mixed-provider journeys, or penalty fees. No affiliate links. Font requests use Google Fonts, with system fallbacks. Animations use local SVG/CSS and stop under reduced-motion preferences.

## Verify

```sh
node --test tests/calculator.test.mjs
node tests/browser.mjs
```

The first command uses Node’s built-in test runner. The browser smoke test uses an installed Chrome through its DevTools protocol and Node’s native WebSocket API. Its default path is Chrome on Windows; set `CHROME_PATH` for another location. It starts and stops its own local server and headless Chrome, tests nested hosting and mobile interactions, and saves ignored screenshots under `.cache/`. Its isolated Chrome profile is ignored under `.browser-test/`.

Meaningful coverage includes fare thresholds, upfront payments, discount eligibility, resident ride origins, bundle expiry/depletion and repurchase, calendar renewals, free-minute restrictions, invalid values, edited prices, zero rides, excluded providers, work quotes and comparison against a small exhaustive reference solver.

No files have been deployed automatically.
