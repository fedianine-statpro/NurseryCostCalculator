(function(root) {
  const F = typeof module !== 'undefined' && module.exports ? require('./fares.js') : root.LondonFares;
  const iso = d => d.toISOString().slice(0,10);
  const moneyRound = n => Math.round(n / F.rules.discountRoundPence) * F.rules.discountRoundPence;
  function date(value) { const d = new Date(value + 'T12:00:00Z'); if (!Number.isFinite(+d) || iso(d) !== value) throw Error('Choose a valid start date.'); return d; }
  function monthEnd(start) { const d = date(start), day = d.getUTCDate(); d.setUTCDate(1); d.setUTCMonth(d.getUTCMonth()+1); const last = new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0,12)).getUTCDate(); d.setUTCDate(Math.min(day,last)); return d; }
  function weekKey(d) { const monday = new Date(d); monday.setUTCDate(d.getUTCDate() - (d.getUTCDay()+6)%7); return iso(monday); }
  function peak(minutes, nonWorking, intoZone1) { if(nonWorking) return false; return F.rules.peakWindows.some(([a,b],i) => minutes>=a && minutes<b && !(i===1 && intoZone1)); }
  function optimise(records, capFor, ticketFor) {
    function segmentCost(a,b) {
      const groups=new Map();for(let i=a;i<b;i++){const r=records[i];if(!groups.has(r.week))groups.set(r.week,[]);groups.get(r.week).push(r);}
      return [...groups.values()].reduce((n,rows)=>n+Math.min(rows.reduce((v,r)=>v+r.cost,0),capFor(rows)??Infinity),0);
    }
    const payg=segmentCost(0,records.length),dp=Array(records.length+1).fill(Infinity),previous=Array(records.length+1).fill(null);dp[0]=0;
    for(let i=0;i<records.length;i++) {
      for(let j=i+1;j<=records.length;j++){const part=segmentCost(i,j);if(dp[i]+part<dp[j]){dp[j]=dp[i]+part;previous[j]={from:i,type:'payg',cost:part};}}
      const j=Math.min(i+7,records.length),ticket=ticketFor(records.slice(i,j));
      if(ticket&&dp[i]+ticket.price<dp[j]){dp[j]=dp[i]+ticket.price;previous[j]={from:i,type:'weekly',cost:ticket.price,...ticket};}
    }
    const flexible=Math.min(payg,dp.at(-1)),plan=[];
    if(flexible<payg){let endIndex=records.length;while(endIndex>0){const step=previous[endIndex];if(!step)break;plan.unshift({...step,start:records[step.from].date,end:records[endIndex-1].date});endIndex=step.from;}}
    return {payg,flexible,plan,ticketCount:plan.filter(p=>p.type==='weekly').length};
  }
  function compareWeek(s) {
    if(typeof s.week!=='object'||Array.isArray(s.week)||Object.keys(s.week).some(k=>!['0','1','2','3','4','5','6'].includes(k)))throw Error('Choose valid days for your weekly plan.');
    if(!Number.isInteger(s.away)||s.away<0||s.away>31)throw Error('Check your days away.');
    const perDay=new Map(),warnings=new Set();
    for(const [key,day] of Object.entries(s.week)) {
      if(!day||![day.rail,day.bus].every(n=>Number.isInteger(n)&&n>=0&&n<=12))throw Error('Use 0–12 journeys for each transport on each day.');
      if(!day.rail&&!day.bus)continue;
      const one=compare({...s,...day,week:null,mode:day.rail?(s.railMode||(s.mode==='bus'?'tube':s.mode)):'bus',trips:day.rail||day.bus,extraBus:day.rail?day.bus:0,days:[Number(key)],away:0});
      if(one.blocked)return one;
      one.warnings.forEach(w=>warnings.add(w));perDay.set(Number(key),{day,result:one});
    }
    if(!perDay.size)throw Error('Add at least one journey to your weekly plan.');
    const first=perDay.values().next().value.result;let skip=s.away;
    const records=first.records.map((base,index)=>{
      const entry=perDay.get(date(base.date).getUTCDay());
      if(!entry||skip>0){if(entry)skip--;return {...base,active:false,cost:0,railTrips:0,busTrips:0};}
      const {day,result}=entry;return {...result.records[index],railTrips:day.rail,busTrips:day.bus,tram:!!day.tram,lo:result.lo,hi:result.hi};
    });
    if(!records.some(r=>r.active))throw Error('There are no travel days left after your days away.');
    const profile=F.profiles[s.profile],canCap=F.rules.weeklyCapProfiles.includes(s.profile)&&s.railcard==='none';
    const coverage=rows=>{
      const active=rows.filter(r=>r.active),rail=active.filter(r=>r.railTrips>0);
      if(!rail.length)return {busOnly:true,lo:0,hi:0,ticketHi:0};
      const lo=Math.min(...rail.map(r=>r.lo)),hi=Math.max(...rail.map(r=>r.hi));
      return {busOnly:false,lo,hi,ticketHi:active.some(r=>r.tram&&r.busTrips)?Math.max(3,hi):hi};
    };
    const season=(c,who)=>F.seasons[who][c.lo===1?'central':'outer'][c.ticketHi-c.lo];
    const capFor=rows=>{if(!canCap)return null;const c=coverage(rows);return c.busOnly?F.bus[profile.bus].weeklyCap:season({...c,ticketHi:c.hi},'adult')[0];};
    const ticketFor=rows=>{
      if(!rows.some(r=>r.active))return null;
      const c=coverage(rows);return {...c,price:c.busOnly?F.bus[profile.bus].weekly:season(c,profile.season)[0]};
    };
    const c=coverage(records),ticket=ticketFor(records),monthlyTicket=c.busOnly?F.bus[profile.bus].monthly:season(c,profile.season)[1];
    const optimal=optimise(records,capFor,ticketFor),monthly=monthlyTicket;
    if(s.away)warnings.add('Days away remove the first selected travel dates in this month.');
    const zones=new Set(records.filter(r=>r.railTrips).map(r=>r.lo+'-'+r.hi));
    if(zones.size>1)warnings.add('Travelcards cover all rail zones in the selected period. PAYG caps use the zones travelled in each week. TfL may offer a cheaper cap plus extension fares for occasional outer-zone trips; that optimisation is not included.');
    if(s.custom?.enabled)warnings.add('Your exact outward and return fares are used for all rail days. Make sure they apply to each day’s route and times.');
    const caps=[...new Set(records.filter(r=>r.active).map(r=>r.week))].map(w=>capFor(records.filter(r=>r.week===w)));
    const weekSummary=[1,2,3,4,5,6,0].filter(day=>perDay.has(day)).map(day=>({weekday:day,...perDay.get(day).day}));
    return {...optimal,...c,monthly,monthlyTicket,weeklyTicket:ticket.price,weeklyCap:capFor(records),weeklyCapVaries:new Set(caps).size>1,days:records.filter(r=>r.active).length,calendarDays:records.length,records,warnings:[...warnings],weekSummary,end:first.end,profile:profile.label,free:optimal.payg===0,winner:monthly<optimal.flexible?'monthly':optimal.flexible<optimal.payg?'weekly':'payg',saving:Math.abs(monthly-optimal.flexible)};
  }
  function compare(input) {
    const s = {mode:'tube',from:1,to:2,days:[1,2,3],out:480,back:1050,trips:2,extraBus:0,profile:'adult',railcard:'none',via1:false,start:'2026-11-04',away:0,custom:null,...input};
    if(s.week!==undefined&&s.week!==null)return compareWeek(s);
    if(!F.profiles[s.profile] || !['tube','national','through','bus','mixed','special'].includes(s.mode)) throw Error('Choose a valid travel type and discount.');
    if(!Array.isArray(s.days) || s.days.some(d=>!Number.isInteger(d)||d<0||d>6) || new Set(s.days).size!==s.days.length) throw Error('Choose valid days of the week.');
    if(!Number.isInteger(s.from)||!Number.isInteger(s.to)||s.from<1||s.to<1||s.from>6||s.to>6) throw Error('This quick comparison covers Zones 1–6. Use TfL for fares beyond these zones.');
    if(![s.out,s.back].every(n=>Number.isInteger(n)&&n>=0&&n<1440)||!Number.isInteger(s.trips)||s.trips<1||s.trips>12||!Number.isInteger(s.extraBus)||s.extraBus<0||s.extraBus>12||!Number.isInteger(s.away)||s.away<0||s.away>31) throw Error('Check your journey counts, times and days away.');
    const p=F.profiles[s.profile], busOnly=s.mode==='bus', railMode=s.mode==='mixed'?'tube':s.mode;
    if(s.railcard!=='none' && (p.half || p.child || p.free || p.older)) throw Error('Choose your photocard or your Railcard discount; these discounts cannot simply be multiplied together.');
    if(!['none','offpeak','disabled'].includes(s.railcard)) throw Error('Choose a valid Railcard.');
    if(p.visitor) return {blocked:'Young Visitor discount lasts at most 14 days. A full month at this rate would be misleading. Use TfL’s fare finder for your visit.'};
    if(!busOnly && (s.mode==='special' || (s.custom && s.custom.enabled)) && (!s.custom || ![s.custom.out,s.custom.back].every(n=>Number.isInteger(n)&&n>=0&&n<=10000))) return {blocked:'Enter the two actual fares from TfL’s Single Fare Finder below. Use the fare for your card, route and travel times.'};
    if(!busOnly && ['national','through'].includes(railMode) && (p.free || p.older || p.child)) return {blocked:'This pass has route-specific National Rail rules. Check TfL’s fare finder and your pass coverage before comparing. The quick free-travel calculation applies to TfL services.'};
    let lo=s.via1?1:Math.min(s.from,s.to), hi=Math.max(s.from,s.to);
    const index=hi-lo, central=lo===1, ticketHi=s.tram&&!busOnly?Math.max(3,hi):hi;
    const season=(profile,upper=hi)=>F.seasons[profile][central?'central':'outer'][upper-lo];
    const [weeklyTicket,monthlyTicket]=busOnly?[F.bus[p.bus].weekly,F.bus[p.bus].monthly]:season(p.season,ticketHi);
    const adultWeekly=busOnly?F.bus.adult.weeklyCap:season('adult')[0];
    const b=F.bus[p.bus], start=date(s.start), end=monthEnd(s.start), records=[], warnings=[];
    let skip=s.away;
    for(let d=new Date(start);d<end;d.setUTCDate(d.getUTCDate()+1)) {
      const active=s.days.includes(d.getUTCDay());
      if(!active) { records.push({date:iso(d),week:weekKey(d),cost:0,active:false}); continue; }
      if(skip>0){skip--;records.push({date:iso(d),week:weekKey(d),cost:0,active:false});continue;}
      const holiday=F.bankHolidays.includes(iso(d)), offday=[0,6].includes(d.getUTCDay())||holiday;
      let peakSpend=0,offSpend=0,busSpend=0;
      for(let i=0;i<s.trips;i++) {
        const time=i===0?s.out:s.back;
        const origin=i%2===0?s.from:s.to, dest=i%2===0?s.to:s.from;
        const isPeak=peak(time,offday,origin!==1&&dest===1);
        const free=p.free || (p.older && (offday || time<F.rules.olderRestricted[0] || time>=F.rules.olderRestricted[1]));
        if(free) continue;
        if(busOnly){busSpend+=b.single; continue;}
        let fare;
        if(s.custom?.enabled || s.mode==='special') fare=i%2===0?s.custom.out:s.custom.back;
        else {
          fare=F.singles[railMode][central?'central':'outer'][index][isPeak?0:1];
          if(p.child) fare=F.childTubeSingle[isPeak?0:1];
          else if(p.half) fare=moneyRound(fare/2);
          else if(s.railcard==='disabled' || (s.railcard==='offpeak'&&!isPeak)) fare=moneyRound(fare*F.rules.railcardMultiplier);
        }
        if(isPeak) peakSpend+=fare; else offSpend+=fare;
      }
      if(!busOnly && (s.mode==='mixed' || s.extraBus)) {
        const count=s.extraBus;
        for(let i=0;i<count;i++) {
          const time=i===0?s.out:s.back;
          if(!(p.free || (p.older&&(offday||time<F.rules.olderRestricted[0]||time>=F.rules.olderRestricted[1])))) busSpend+=b.single;
        }
      }
      busSpend=Math.min(busSpend,b.daily);
      let cap=F.dailyCaps[hi],offCap=cap;
      if(p.half || p.child) cap/=2;
      if(s.railcard==='disabled') cap=F.railcardOffPeakCaps[hi];
      if(p.child) offCap=F.childOffPeakCap;
      else if(p.half) offCap=cap;
      else if(s.railcard==='offpeak' || s.railcard==='disabled') offCap=F.railcardOffPeakCaps[hi];
      // Mixed Railcard bus/rail capping is deliberately conservative: bus fares are not discounted.
      const cost=busOnly?busSpend:Math.min(cap,peakSpend+Math.min(offSpend,offCap)+busSpend);
      records.push({date:iso(d),week:weekKey(d),cost,active:true,holiday});
    }
    const weeklyCap=F.rules.weeklyCapProfiles.includes(s.profile)&&s.railcard==='none'?adultWeekly:null;
    const {payg,flexible,plan,ticketCount}=optimise(records,()=>weeklyCap,()=>({price:weeklyTicket}));
    // Standard Travelcards covering only Zones 1–2 exclude trams; UI compares buses with rail unless tram use is declared.
    let monthly=monthlyTicket;
    if(s.railcard!=='none') warnings.push('Railcard single fares are rounded estimates. Use “Use my exact fares” for the published fare. No discounted weekly PAYG cap is assumed.');
    if(s.railcard!=='none' && (s.mode==='mixed'||s.extraBus)) warnings.push('Mixed bus/rail Railcard capping can be more favourable than this estimate. Check your Oyster journey history if the result is close.');
    if(p.half || p.child) warnings.push('No weekly PAYG cap is assumed for this concession. Discounted 7-day tickets are compared separately.');
    if(s.away>0) warnings.push('Days away remove the first selected travel dates in this month.');
    if(s.tram && hi<3 && !busOnly) warnings.push('The weekly and monthly Travelcards extend to Zone 3 to include trams. A narrower Travelcard plus separate tram PAYG is not compared.');
    if(['national','through'].includes(railMode)) warnings.push('Standard National Rail fare scale. Some routes use different fares: enter exact fares for your route.');
    if(s.mode==='tube'||s.mode==='mixed') warnings.push('Standard TfL rail fares. Heathrow, some Liverpool Street routes and other special fares need “Use my exact fares”.');
    if(start < date(F.busEffective) || end>date(F.reviewBy)) warnings.push('This period crosses outside the verified fare period. Updated fares may change the result.');
    if(s.out<270||s.back<270) warnings.push('Travel before 04:30 belongs to the previous TfL fare day. This estimate groups your outward and return journeys together; check your actual fare-day pattern.');
    return {payg,flexible,monthly,weeklyTicket,monthlyTicket,weeklyCap,plan,ticketCount,days:records.filter(r=>r.active).length,calendarDays:records.length,records,warnings,lo,hi,ticketHi,busOnly,winner:monthly<flexible?'monthly':flexible<payg?'weekly':'payg',saving:Math.abs(monthly-flexible),end:iso(end),profile:p.label,free:payg===0};
  }
  const api={compare,peak,monthEnd,weekKey};root.LondonEngine=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
