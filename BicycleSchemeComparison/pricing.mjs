export const researched = '2026-11-06';
export const sources = {
  santander: 'https://tfl.gov.uk/modes/cycling/santander-cycles/what-you-pay',
  discounts: 'https://tfl.gov.uk/modes/cycling/santander-cycles/discounts',
  students: 'https://www.studentbeans.com/student-discount/uk/tfl-santander-cycles',
  lime: 'https://www.li.me/en-gb/blog/how-the-new-limeprime-makes-it-easier-to-save-on-rides',
  limeEstimates: 'https://andrejzg.com/lime/',
  limeAccess: 'https://www.li.me/en-gb/why/community/lime-access',
  forest: 'https://help.forest.bike/en/articles/76',
  forestEstimates: 'https://fleethopper.co.uk/londons-app-based-bicycles-and-scooters/',
  forestDiscounts: 'https://forest.bike/blog/how-to-access-discounted-rides-with-forest-bikes',
  forestFree: 'https://forest.bike/blog/pay-as-you-go-pricing-update',
  hackney: 'https://www.hackney.gov.uk/parking-streets-and-transport/sustainable-transport-and-parking/cycling/cycle-hire',
  southwark: 'https://www.southwark.gov.uk/parking-streets-and-transport/travel/active-travel/get-discounted-e-bike-journeys',
  work: 'https://www.cyclesaver.co.uk/cyclepass',
};
export const defaults = {
  limeUnlock: 100, limeMinute: 31, limePrime: 699, limeShort: 100,
  limeFlat: 170, limeOver: 16, limeAccessPercent: 50,
  lime30: 459, lime60: 769, lime200: 1994, lime400: 3699,
  forestUnlock: 100, forestMinute: 33, forestFlex: 699, forestShort: 100,
  forestFlat: 170, forest20: 299, forest35: 459, forest70: 769,
  forest250: 1994, forest500: 3699, forestPlus: 6999,
};
export const providers = {
  santander: { name: 'Santander Cycles', color: '#e55243', letter: 'S', map: 'https://tfl.gov.uk/modes/cycling/santander-cycles/find-a-docking-station', url: sources.santander, note: 'Dock to dock. Check there is a convenient station at both ends.' },
  lime: { name: 'Lime', color: '#75ae23', letter: 'L', map: 'https://www.li.me/en-gb/locations/london', url: 'https://www.li.me/', note: 'Electric, dockless. Check the app for bikes, service areas and required parking bays.' },
  forest: { name: 'Forest', color: '#087b60', letter: 'F', map: 'https://forest.bike/how-it-works', url: 'https://forest.bike/', note: 'Electric, dockless. Park in a permitted bay and check the operating area in the app.' },
};
export const eligibility = [
 ['student','Student (18+), with student ID'], ['graduate','Graduate eligible for Grad Beans'],
 ['nhs','NHS employee'], ['sector','Healthcare, care, charity worker or teacher'],
 ['emergency','Emergency services / eligible Blue Light Card'],
 ['apprentice','Apprentice Oyster card'], ['careleaver','18–25 Care Leaver Oyster'],
 ['older','60+ London Oyster or Freedom Pass'], ['veteran','Veterans Oyster photocard'],
 ['jobseeker','Jobcentre Plus Travel Card'], ['bus','Bus & Tram Discount'],
 ['disability','National Disability or Carers Card'], ['wandsworth','Wandsworth Access for All card'],
 ['richmond','Richmond Fairer Access card'],
];
export const priceFields = [
 ['Lime · PAYG & Prime', [['limeUnlock','Unlock'],['limeMinute','Per minute'],['limePrime','Prime / month'],['limeShort','Prime ≤5 min'],['limeFlat','Prime ≤20 min'],['limeOver','Prime extra minute']]],
 ['Lime · minute bundles', [['lime30','30 min · 1 day'],['lime60','60 min · 3 days'],['lime200','200 min · 7 days'],['lime400','400 min · 30 days']]],
 ['Forest · PAYG & subscriptions', [['forestUnlock','Unlock'],['forestMinute','Per minute'],['forestFlex','Flex / month'],['forestShort','Flex ≤10 min'],['forestFlat','Flex ≤30 min'],['forestPlus','Plus · 1,200 min / month']]],
 ['Forest · minute bundles', [['forest20','20 min · 1 day'],['forest35','35 min · 1 day'],['forest70','70 min · 3 days'],['forest250','250 min · 7 days'],['forest500','500 min · 30 days']]],
];
