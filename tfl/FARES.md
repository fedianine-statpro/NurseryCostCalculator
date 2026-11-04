# Fare data and maintenance

All prices, eligibility profiles, caps, published season-ticket prices, time windows and source URLs live in `fares.js`. Values are integer pence. `engine.js` is the pure comparison engine; `script.js` only reads controls and presents the result. No backend or dependencies are needed for the existing static hosting.

Research checked 4 November 2026 against TfL and London City Hall. The bus increase took effect **1 November**, after an extension of the July freeze. The data includes £1.85 singles, £5.55 daily cap, £26.10 weekly cap and £100.30 monthly adult Bus & Tram Pass. Rail singles use the March 2026 tables; July corrections concern Zones 7–9, which are outside the quick calculator. Travelcard and rail cap prices remain frozen until March 2027.

## Updating fares

1. Follow `sources` in `fares.js`. Check the current TfL pages and latest Mayoral Direction, including changes made after the annual March increase.
2. Replace the published adult, student/apprentice and child season tables, standard single-fare scales, bus fares and cap arrays. Do not multiply season prices by a percentage: published rounding differs. Share identical schedules by profile reference.
3. Update eligibility profiles and time rules if TfL changes them. Check whether any concession gains weekly PAYG capping. Do not assume discounted PAYG has a weekly cap.
4. Update England and Wales bank holidays from GOV.UK, effective dates, `checked`, `version` and `reviewBy`. Update the visible checked date in `calculator.html` (or keep the UI date derived from the data).
5. Run `npm test` (Node 22+), then `npm start` and check desktop/mobile, keyboard use, mixed travel, every discount, exact fares, invalid inputs and a start date near the end of a month.

The UI flags a stale verification date and comparisons outside the verified fare period. It does not fetch prices at runtime or claim to update automatically.

## Calculation assumptions

The comparison uses a calendar-month period from the selected start date. The user picks actual weekdays, with bank holidays charged as travel days at off-peak rates unless removed using days away. Daily costs are capped, grouped into Monday–Sunday weeks, then capped where adult-rate weekly capping applies. Dynamic programming compares combinations of rolling 7-day tickets and PAYG over the same period. A monthly season ticket is compared with the best flexible option. No travel or cap credit outside the comparison is assumed.

Rail and bus/tram journey counts are independent and visible in the main form, including zero for either mode. A bus–Tube commute in both directions is two Tube & rail trips and two bus journeys. The first Tube & rail trip occurs at the outward time; further Tube & rail trips alternate direction and occur at the return time. Bus/tram journeys use the outward time first, then the return time. For bus/tram, users count paid Hopper windows, not boardings. Bus fares are capped separately before the combined rail cap; they are already included in a rail Travelcard. Older passes only pay for journeys within the weekday restricted morning period. Free-travel profiles require an existing valid pass.

### Different days

The usual-day shortcut remains the default. “My days are different” seeds the seven day cards from that pattern and the selected weekdays. Each card can override rail and bus/tram counts, rail zones, travel via Zone 1, tram use and touch-in times. Cards can use the live usual pattern, be cleared, or be copied to weekdays/all days. Copies are snapshots; “Use usual day” reconnects a card to the live usual pattern.

`LondonEngine.compare({week: {1: {rail: 2, bus: 2, from: 1, to: 5}, 2: {rail: 0, bus: 2}}})` supplies a repeating week keyed by JavaScript weekday (Sunday 0). Missing or zero-count days mean no travel. Per-day single fares and daily caps reuse the usual-day calculation. The shared optimiser compares tickets with the rail zones required in each ticket period; the monthly ticket covers the union of the month's rail zones, including tram coverage. Days away remove dates in calendar order across the complete plan. The result includes a readable weekly summary and individual daily costs.

All Tube & rail trips on a day use that day's chosen zone pair, alternate direction, and use the selected outward/return times. Separate routes within a day, a narrower pass plus outer-zone extensions, and combinations of a bus-only season ticket with separate rail PAYG are outside the optimisation. Mixed-zone PAYG caps can be more favourable than the conservative union-of-zones cap; the result flags this. Exact fare overrides apply to all rail days, so they should only be used when those fares apply to every selected rail journey.

`npm test` includes the mixed Monday/Tuesday/Wednesday example, different daily zones and times, copying's engine-equivalent uniform pattern, days away, tram coverage and concession pricing. `node scripts/browser-smoke.cjs` exercises the actual page in headless Chrome on desktop and mobile, including copy/clear/restore/reset controls. It writes ignored screenshots to `.qa/`; set `CHROME_PATH` if Chrome is installed elsewhere.

## Deliberate limits

- Greater London zonal journeys in Zones 1–6, plus TfL buses/trams. Zones do not define the administrative London boundary. No fares beyond Zone 6 are fabricated.
- This is a regular-pattern estimator, not a journey planner. The official rail/bus/tram maps are linked. The TfL bulk station API timed out during development, so an unverified replacement station dataset is not used.
- Standard TfL, National Rail and through-fare scales are supported. Heathrow and other special routes require the user's actual discounted outward/return single fares. Route inference, pink readers, dual-zone resolution, Liverpool Street exceptions and airport supplements are not guessed.
- Railcard singles use the published 34% discount convention rounded to 5p, and are explicitly labelled estimates. Exact fares can override these. Disabled Persons Railcard uses reduced peak and off-peak caps. Mixed bus/rail and some time-dependent off-peak cap cases can be cheaper than the conservative estimate.
- Trams with a rail pass extend the compared season ticket to at least Zone 3. A narrower Travelcard plus tram PAYG is not currently optimised; the result explains this.
- National Rail journeys with free-travel or child-pass profiles need route-specific checking. The engine blocks those rather than suggesting an unverified free fare.
- Young Visitor discounts last up to 14 days; the engine blocks a whole-month projection.
- Excludes river boats, cable car, high-speed trains, Heathrow Express, annual/group tickets, new Oyster/photocard fees, refunds, maximum fares and irregular multiroute travel.
- No eligibility is inferred from age, disability or student status alone. Users select a valid card or pass.

## Run locally

`npm start` serves http://127.0.0.1:8000. The existing `calculator.html` URL remains the entry point; `index.html` also forwards there. The page can also be opened directly without a build.
