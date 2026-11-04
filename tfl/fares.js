/* One versioned source of fare data. All money is integer pence. See FARES.md. */
(function (root) {
  const data = {
    version: '2026-11-04', checked: '2026-11-04', reviewBy: '2027-03-01',
    railEffective: '2026-03-01', busEffective: '2026-11-01',
    sources: {
      adult: 'https://content.tfl.gov.uk/adult-fares.pdf',
      student: 'https://content.tfl.gov.uk/18-plus-student-oyster-photocard-fares.pdf',
      child: 'https://content.tfl.gov.uk/11-15-zip-oyster-photocard-fares.pdf',
      zip16: 'https://content.tfl.gov.uk/16-plus-zip-oyster-photocard-fares.pdf',
      railcard: 'https://content.tfl.gov.uk/railcard-fares.pdf',
      bus: 'https://tfl.gov.uk/fares/find-fares/bus-and-tram-fares',
      singles: 'https://www.london.gov.uk/media/111831/download',
      discounts: 'https://tfl.gov.uk/fares/free-and-discounted-travel',
      times: 'https://tfl.gov.uk/fares/find-fares/tube-and-rail-fares',
      caps: 'https://tfl.gov.uk/fares/find-fares/capping',
      november: 'https://www.london.gov.uk/md3517-july-2026-fare-changes',
      disabledRailcard: 'https://content.tfl.gov.uk/disabled-persons-railcard-fares.pdf',
      holidays: 'https://www.gov.uk/bank-holidays'
    },
    // Rows: number of zones, including Zone 1 / excluding Zone 1. [peak, off-peak].
    singles: {
      tube: {central: [[310,300],[360,310],[390,330],[480,360],[530,380],[590,400]], outer: [[230,220],[250,230],[320,240],[340,250],[380,260]]},
      national: {central: [[370,300],[390,320],[460,370],[530,400],[660,440],[850,520]], outer: [[300,270],[360,300],[400,320],[480,370],[550,390]]},
      through: {central: [[550,480],[590,510],[660,540],[730,590],[880,630],[1040,700]], outer: [[300,270],[360,300],[400,320],[480,370],[550,390]]}
    },
    dailyCaps: [0,890,890,1050,1280,1530,1630],
    railcardOffPeakCaps: [0,590,590,695,850,1015,1085],
    childOffPeakCap: 190,
    childTubeSingle: [105,95],
    // Published 7-day and monthly prices, not percentages rounded by the UI.
    seasons: {
      adult: {central: [[4470,17170],[4470,17170],[5250,20160],[6420,24660],[7640,29340],[8160,31340]], outer: [[3350,12870],[3350,12870],[3710,14250],[4450,17090],[5590,21470]]},
      student: {central: [[3120,11990],[3120,11990],[3670,14100],[4490,17250],[5340,20510],[5710,21930]], outer: [[2340,8990],[2340,8990],[2590,9950],[3110,11950],[3910,15020]]},
      child: {central: [[2240,8610],[2240,8610],[2630,10100],[3210,12330],[3820,14670],[4080,15670]], outer: [[1680,6460],[1680,6460],[1860,7150],[2230,8570],[2800,10760]]}
    },
    bus: {
      adult: {single:185, daily:555, weeklyCap:2610, weekly:2610, monthly:10030},
      student: {single:185, daily:555, weeklyCap:2610, weekly:1830, monthly:7030},
      half: {single:90, daily:270, weeklyCap:null, weekly:1300, monthly:5000},
      free: {single:0,daily:0,weeklyCap:null,weekly:0,monthly:0}
    },
    profiles: {
      adult: {label:'Adult · no discount', season:'adult', bus:'adult', note:'Contactless or Oyster. Use the same card or device for every journey to get the caps.'},
      student: {label:'18+ Student Oyster', season:'student', bus:'student', note:'An eligible 18+ Student Oyster photocard gives discounted season tickets. PAYG singles and caps stay at adult rates.'},
      apprentice: {label:'Apprentice Oyster', season:'student', bus:'student', note:'For eligible London residents aged 18+ in the first year of an apprenticeship. Season tickets are discounted; PAYG is adult rate.'},
      zip11: {label:'11–15 Zip Oyster', season:'child', bus:'free', child:true, note:'Requires a valid 11–15 Zip photocard with free bus and tram travel. Child Tube fares and the £1.90 off-peak cap apply.'},
      zip16: {label:'16+ Zip · London resident', season:'child', bus:'free', half:true, note:'With a valid London-resident 16+ Zip photocard: free buses and trams, half-rate rail PAYG and child-rate season tickets.'},
      zip16outside: {label:'16+ Zip · outside London', season:'child', bus:'half', half:true, note:'Requires a valid 16+ Zip photocard. Half-rate PAYG and child-rate season tickets; buses and trams are not free.'},
      under11: {label:'Under 11 · travelling with an adult', season:'child', bus:'free', free:true, note:'Up to four under-11s travel free with a fare-paying adult on TfL rail. Buses and trams are free. A 5–10 Zip card is needed for unaccompanied travel and many National Rail journeys.'},
      older: {label:'60+ Oyster / older person’s Freedom Pass', season:'adult', bus:'adult', older:true, note:'TfL travel is free except 04:30–09:00 on weekdays. Most National Rail services start free travel at 09:30; route exceptions apply. Age alone does not give this discount: you need the pass.'},
      disabled: {label:'Disabled person’s Freedom Pass', season:'adult', bus:'free', free:true, note:'Free at all times on TfL services with a valid Disabled Person’s Freedom Pass. National Rail coverage and conditions vary.'},
      veteran: {label:'Veterans Oyster photocard', season:'adult', bus:'free', free:true, note:'Free at all times on TfL services with an eligible Veterans Oyster photocard. A Veterans Railcard is a different product.'},
      jobcentre: {label:'Jobcentre Plus discount on Oyster', season:'child', bus:'half', half:true, note:'Requires a valid Jobcentre Plus photocard and the discount added to Oyster. Half-rate PAYG and child-rate weekly/monthly tickets.'},
      care: {label:'18–25 Care Leaver Oyster', season:'adult', bus:'half', note:'Half-rate bus and tram PAYG and passes. Rail travel remains adult rate.'},
      busdiscount: {label:'Bus & Tram Discount photocard', season:'adult', bus:'half', note:'Half-rate bus and tram PAYG and weekly/monthly passes. Rail travel remains adult rate.'},
      visitor: {label:'11–15 Young Visitor discount', season:'adult', bus:'half', half:true, visitor:true, note:'Staff must add this discount to Oyster. Valid for up to 14 days, not a whole month. It discounts PAYG and daily caps, not monthly Travelcards.'}
    },
    rules: {peakWindows:[[390,570],[960,1140]], olderRestricted:[270,540], nationalOlderRestricted:[270,570], hopperMinutes:60, weeklyCapProfiles:['adult','student','apprentice','care','busdiscount','older','disabled','veteran','under11'], railcardMultiplier:0.66, discountRoundPence:5},
    bankHolidays: ['2026-01-01','2026-04-03','2026-04-06','2026-05-04','2026-05-25','2026-08-31','2026-12-25','2026-12-28','2027-01-01','2027-03-26','2027-03-29','2027-05-03','2027-05-31','2027-08-30','2027-12-27','2027-12-28']
  };
  root.LondonFares = data;
  if (typeof module !== 'undefined') module.exports = data;
})(typeof globalThis !== 'undefined' ? globalThis : window);
