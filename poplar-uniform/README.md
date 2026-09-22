# Poplar Pre-Loved Uniform prototype

Static HTML/CSS/JavaScript prototype for GitHub Pages. No build step or server runtime is required.

## Current shop model

- Two conditions: Good and Spare.
- Prices are shown directly to parents. Spare items can be as little as £1.
- Green cardigan: £5 Good / £2 Spare.
- Green sweatshirt: £4.50 Good / £1.50 Spare.
- £5 minimum online order.
- No live stock quantities are displayed.
- Friday collection from the main school office during term time, with at least 3 days requested for preparation.
- Green and yellow checked summer dresses are separate products.
- Cold-weather PE bottoms are listed without gender: the item may be joggers or leggings.

## Zeffy

`assets/app.js` currently uses `https://www.zeffy.com/` as the checkout destination. Replace the `ZEFFY_CHECKOUT_URL` value with the PTA's live Zeffy payment page before launch.

## GitHub Pages

Upload the contents of this folder to a repository and enable GitHub Pages from the repository settings. The site uses only relative asset paths.

## Production note

This static prototype stores the basket only in the visitor's browser and does not maintain central inventory. A production Wix version will need the final order/availability workflow connected to whatever stock process the PTA chooses.
