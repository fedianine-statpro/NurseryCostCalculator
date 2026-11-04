# London Fare Check: discovery and growth

Public URL: https://fedianine.com/tfl/calculator.html
Sitemap: https://fedianine.com/sitemap.xml

## What ships with the calculator

- A descriptive title, description, canonical URL and indexable static explanations below the calculator.
- Open Graph and social-card metadata, with a 1200 × 630 PNG preview generated from `assets/share-card.svg`.
- Root `robots.txt` pointing to a deliberately small sitemap containing the public home page and calculator. Pages elsewhere in this repository that carry `noindex` remain excluded from the sitemap. `robots.txt` does not remove their own indexing restrictions.
- A crawlable link from the home page.
- Copy/share links that preserve usual-day or custom-week inputs, zones, times, card choices and the comparison start date. Links store inputs in a URL fragment and always recalculate results with the available fare data. There are no stored or guaranteed quoted fares.
- Optional Google Analytics using the existing site property, off until the visitor opts in under “Privacy & optional analytics”. Browser privacy signals are respected. Explicit events are `comparison_completed` (recommendation and usual/weekly plan only) and `share_comparison`; no travel choices, concession profile or shared URL is sent. A sanitized canonical page location is used. In the GA property, leave enhanced measurement off for this page if any property-level custom tracking would collect full links or form values.

## Owner steps after deployment

Search Console needs access to the owner's Google account; publishing site code cannot verify ownership or submit a URL on the owner's behalf.

1. Open https://search.google.com/search-console and select/add `https://fedianine.com/` (or the `fedianine.com` domain property).
2. Complete Google's ownership check if it has not already been done. Do not invent a verification token. The existing Analytics property may provide a verification route if the signed-in account has the required access; follow Search Console's actual instructions.
3. Submit `sitemap.xml` in Sitemaps. Inspect the calculator's public URL, test the live URL, and request indexing.
4. Check indexing reports for the canonical calculator URL and inspect Google's rendered HTML. Confirm there is no live `noindex` directive or `X-Robots-Tag` response header.
5. Optionally verify/import the site into Bing Webmaster Tools and submit the same sitemap.

Sitemap inclusion and indexability do not guarantee indexing, ranking or traffic. Keep the public URL stable. The canonical intentionally excludes individual shared comparison fragments.

## A useful first month

Week 1: publish, submit the sitemap, request indexing, and ask a small number of commuters to complete a comparison without guidance. Record where they hesitate. Prioritise fixes that reduce input time and improve fare correctness.

Week 2: use the outreach copy below for a small number of relevant student unions, staff-benefit teams, local newsletters and relocation guides. Personalise each message; provide a specific useful reason for their readers. Follow each community's rules when sharing publicly. Do not buy links, post repetitive advertisements or promise savings for everyone.

Weeks 3–4: review Search Console queries and pages. Improve existing explanations when real queries reveal missing answers. Add a worked example only if it provides new useful information. Derive example amounts from `engine.js` and `fares.js` so pricing does not drift. Recheck fares after TfL announcements, including changes outside March.

## Measures

- Search Console: indexed status, relevant search impressions, clicks, click-through rate, and queries containing terms such as “Travelcard vs pay as you go”, “3 days a week” and “student Travelcard”. A new site may have little or no data initially.
- Optional Analytics: page visits, completed-comparison events, sharing events and referral sources. These represent visitors who opt in, not the entire audience. Compare trends rather than claiming a total completion rate.
- Product feedback: time to a useful result, misunderstood controls, incorrectly modelled journeys and reports of fare differences. Never collect unnecessary journey details for growth reporting.

## Outreach drafts — prepared, not sent

### Student union or university advice team

Subject: A free tool to compare London Travelcards and pay as you go

Hello [name],

I built London Fare Check to help people compare a monthly Travelcard with pay as you go for the week they actually travel. It handles different journeys on different days, bus connections, travel zones and eligible student/Oyster discounts.

The tool is free and needs no sign-up: https://fedianine.com/tfl/calculator.html

If it would help your students, would you consider trying it and including it in your London travel or budgeting resources? It is independent of TfL and shows its fare sources and assumptions.

Feedback on confusing journeys or missing cases would also be useful.

Victor

### Employer commuter-benefit team or local newsletter

Subject: Travelcard or PAYG for a mixed working week?

Hello [name],

Hybrid working makes the cheapest London travel option less obvious. I made a free calculator that compares a monthly Travelcard with PAYG for different travel on each weekday, including buses and eligible discounts.

People can enter a usual day, change the exceptions and share a link to their comparison: https://fedianine.com/tfl/calculator.html

Would it be useful for your [staff travel resources / readers]? The calculator is independent of TfL and links to official fare sources. I would welcome feedback before you recommend it.

Victor

### Short public description

Travelcard or pay as you go for your London week? London Fare Check compares your Tube & rail trips, buses and trams, including eligible discounts. Set a usual day or build a different pattern for each weekday. Free, independent and no sign-up: https://fedianine.com/tfl/calculator.html

## Maintenance checks

Run `npm test` and `node scripts/browser-smoke.cjs`. The browser smoke script regenerates the social PNG and checks sharing/restoration, metadata, invalid links, consent defaults and mobile layout. Ensure `assets/share-card.png` is included whenever the SVG changes. Add accurate content and sources, not keyword-only pages or fabricated testimonials.
