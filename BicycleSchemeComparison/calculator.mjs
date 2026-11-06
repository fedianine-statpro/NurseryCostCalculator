import { defaults } from './pricing.mjs';
const DAY = 86400000;
export const money = p => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(p / 100);
function addMonths(t, n) {
  const d = new Date(t), day = d.getUTCDate();
  d.setUTCDate(1); d.setUTCMonth(d.getUTCMonth() + n);
  const end = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
  d.setUTCDate(Math.min(day, end)); return +d;
}
export function generateRides(input) {
  const duration = Number(input.minutes), count = Number(input.ridesPerDay);
  const days = input.mode === 'visit' ? Number(input.visitDays) : input.horizon === 'year' ? 365 : 30;
  if (!Number.isInteger(duration) || duration < 1 || duration > 240 || !Number.isInteger(count) || count < 0 || count > 12 || !Number.isInteger(days) || days < 1 || days > 365) throw Error('Enter 1–240 minutes, 0–12 rides per day and 1–30 visit days.');
  const start = Date.parse(input.start + 'T00:00:00Z');
  if (!Number.isFinite(start)) throw Error('Choose a valid start date.');
  const result = [];
  for (let day = 0; day < days; day++) {
    const date = start + day * DAY;
    if (input.mode !== 'visit' && !input.weekdays.includes(new Date(date).getUTCDay())) continue;
    for (let r = 0; r < count; r++) {
      const hour = count === 2 ? (r ? 17 : 9) : count === 1 ? 9 : 9 + 12 * r / (count - 1);
      const local = input.origin === 'all' || (input.origin === 'first' && r === 0);
      result.push({ time: date + Math.round(hour * 60) * 60000, minutes: duration, local });
    }
  }
  return result;
}
function plain(rides, charge) { return { cost: rides.reduce((s,r) => s + charge(r), 0), purchases: [], unused: 0 }; }
// Suffix dynamic program: PAYG, or one prepaid offer starting at this ride.
// Bundles never overlap. If a ride depletes a bundle, only its excess is PAYG.
export function optimizeBundles(rides, bundles, payg, perMinute, unlock = 0) {
  const dp = Array(rides.length + 1).fill(0), choice = [];
  for (let i = rides.length - 1; i >= 0; i--) {
    dp[i] = payg(rides[i]) + dp[i+1]; choice[i] = { next:i+1, purchase:null };
    for (const b of bundles) {
      let left = b.minutes, j = i, extra = 0;
      const expiry = rides[i].time + b.days * DAY;
      while (j < rides.length && rides[j].time < expiry && left > 0) {
        const used = rides[j].minutes;
        extra += Math.max(0, used - left) * perMinute;
        left = Math.max(0,left-used); j++;
      }
      const total = b.price + extra + dp[j];
    if (total < dp[i]) {
        dp[i] = total;
        choice[i] = { next:j, purchase:{ name:b.name, price:b.price, extra, unused:left, time:rides[i].time, expiry } };
      }
    }
  }
  const purchases = [];
  for (let i=0; i<rides.length;) { const c=choice[i]; if(c.purchase) purchases.push(c.purchase); i=c.next; }
  return { cost:dp[0], purchases, unused:purchases.reduce((s,p)=>s+p.unused,0) };
}
function subscription(rides, price, charge, allowance = Infinity) {
  let cost=0, expiry=0, left=0; const purchases=[];
  for (const ride of rides) {
    if (ride.time >= expiry) {
      expiry=addMonths(ride.time,1); left=allowance; cost+=price;
      purchases.push({name:'Monthly subscription',price,time:ride.time,expiry});
    }
    const covered = Math.min(left,ride.minutes); left-=covered;
    cost += charge(ride,covered);
  }
  return {cost,purchases,unused:Number.isFinite(left)?left:0};
}
function santanderOffers(rides, type, elig) {
  const electric = type === 'electric';
  let month=2000, annual=12000;
  if(elig.some(e=>['student','graduate','sector'].includes(e))) {month=1500;annual=9000;}
  if(elig.includes('sector')) annual=6000;
  if(elig.some(e=>['nhs','apprentice','careleaver','older','veteran','jobseeker','bus'].includes(e))) {month=1000;annual=6000;}
  const discounted=month<2000;
  const extra = r => (electric?100:0) + Math.max(0,Math.ceil((r.minutes-60)/60))*(electric?300:165);
  const single = r => Math.ceil(r.minutes/30)*(electric?300:165);
  const dayPrice=elig.includes('student')?175:350;
  const day = {cost:0,purchases:[],unused:0};
  // Day pass has per-ride surcharges, so solve separately with those included.
  const dp=Array(rides.length+1).fill(0), choices=[];
  for(let i=rides.length-1;i>=0;i--) {
    dp[i]=single(rides[i])+dp[i+1];choices[i]={next:i+1};
    let charge=dayPrice,j=i;
    while(j<rides.length && rides[j].time<rides[i].time+DAY){charge+=extra(rides[j]);j++;}
    if(charge<dp[i]){dp[i]=charge+dp[j];choices[i]={next:j,purchase:{name:'Day Pass',price:dayPrice,time:rides[i].time,expiry:rides[i].time+DAY}};}
  }
  day.cost=dp[0];day.purchases=[];
  for(let i=0;i<rides.length;){if(choices[i].purchase)day.purchases.push(choices[i].purchase);i=choices[i].next;}
  const tag = discounted?' · discounted':'';
  return [
    {name:'Single rides',...plain(rides,single)},
    {name:(day.purchases.length?'Day Pass + single rides':'Single rides'),...day},
    {name:'Monthly Pass'+tag,...subscription(rides,month,extra),application:discounted},
    {name:'Annual Pass'+tag,cost:rides.length?annual+rides.reduce((s,r)=>s+extra(r),0):0,purchases:rides.length?[{name:'Annual Pass',price:annual,time:rides[0].time,expiry:addMonths(rides[0].time,12)}]:[],unused:0,application:discounted},
  ].map(o=>({...o,provider:'santander',type,estimated:false,application:o.application || (elig.includes('student')&&o.name.startsWith('Day'))}));
}
export function compareOffers(input) {
  const rides=generateRides(input), p={...defaults,...input.prices}, elig=input.eligibility||[];
  for(const v of Object.values(p)) if(!Number.isFinite(v)||v<0||v>1000000) throw Error('Prices must be between £0 and £10,000.');
  const offers=[];
  if(input.available.santander) {
    offers.push(...santanderOffers(rides,'electric',elig));
    if(input.bike==='any') offers.push(...santanderOffers(rides,'pedal',elig));
  }
  const access=elig.some(e=>['student','nhs','emergency','apprentice','older','veteran','jobseeker','disability','wandsworth'].includes(e));
  const forestAccess=access||elig.includes('richmond');
  for(const provider of ['lime','forest']) {
    if(!input.available[provider]) continue;
    const isLime=provider==='lime', rate=p[provider+'Minute'], unlock=p[provider+'Unlock'];
    const free=isLime?0:Number(input.forestFree||0);
    const payg = r => unlock+Math.max(0,r.minutes-free)*rate;
    const push = (name,calculation,other={})=>offers.push({provider,type:'electric',name,estimated:true,...calculation,...other});
    push('Pay as you go',plain(rides,payg),{estimated:isLime||input.customPrices});
    if(isLime?access:forestAccess) {
      const percent=isLime?Number(input.accessPercent??p.limeAccessPercent):50;
      if(percent<0||percent>100||!Number.isFinite(percent))throw Error('Discount must be between 0 and 100%.');
      push(isLime?'Lime Access':'Friends of the Forest',plain(rides,r=>Math.round(payg(r)*(1-percent/100))),{application:true,estimated:isLime||input.customPrices});
    }
    const sizes=isLime?[30,60,200,400]:[20,35,70,250,500];
    const windows=isLime?[1,3,7,30]:[1,1,3,7,30];
    const bundles=sizes.map((n,i)=>({name:`${n}-minute bundle`,minutes:n,days:windows[i],price:p[provider+n]}));
    const optimal=optimizeBundles(rides,bundles,payg,rate,unlock);
    push(optimal.purchases.length?'Minute bundles + PAYG':'Pay as you go',optimal);
    const flat = r => isLime ? (r.minutes<=5?p.limeShort:p.limeFlat+Math.max(0,r.minutes-20)*p.limeOver) : (r.minutes<=10?p.forestShort:p.forestFlat+Math.max(0,r.minutes-30)*rate);
    push(isLime?'LimePrime':'Forest Flex',subscription(rides,isLime?p.limePrime:p.forestFlex,flat));
    if(!isLime)push('Forest Plus',subscription(rides,p.forestPlus,(r,covered)=>(r.minutes-covered)*rate,1200));
    if(isLime&&input.resident==='hackney') push('Hackney resident fare',plain(rides,r=>r.local?175+Math.max(0,r.minutes-25)*31:payg(r)),{application:true,estimated:!!input.customPrices});
    if(isLime&&input.resident==='southwark'&&rides.every(r=>!r.local||r.minutes<=20)) push('Southwark resident fare',plain(rides,r=>r.local?175:payg(r)),{application:true,estimated:true,explanation:'Uses the published £1.75 maximum for qualifying rides, not an exact short-trip fare.'});
  }
  if(input.work?.enabled && input.available[input.work.provider]) {
    const w=input.work, valid=Number.isFinite(w.price)&&w.price>=0&&Number.isFinite(w.allowance)&&w.allowance>0&&Number.isFinite(w.overage)&&w.overage>=0&&Number.isFinite(w.unlock)&&w.unlock>=0;
    if(!valid)throw Error('Complete your work quote with valid non-negative prices and a positive minute allowance.');
    if(w.term===1||(input.mode!=='visit'&&input.horizon==='year'))offers.push({provider:w.provider,type:'electric',name:'Your work-benefit quote',estimated:true,...subscription(rides,w.price,(r,c)=>w.unlock+(w.provider==='santander'?Math.max(0,Math.ceil((r.minutes-w.allowance)/60))*w.overage:(r.minutes-c)*w.overage),w.provider==='santander'?Infinity:w.allowance),application:true,explanation:w.provider==='santander'?'Uses your net monthly quote for unlimited electric rides within the entered per-ride allowance. Extra time is billed in started 60-minute blocks. Confirm the quoted plan includes e-bikes.':'Uses your net monthly quote and pooled monthly allowance. Confirm employer terms before joining.'});
  }
  const order=(a,b)=>a.cost-b.cost || Number(a.estimated)-Number(b.estimated)||a.purchases.length-b.purchases.length;
  offers.sort(order);
  const results=Object.keys(input.available).filter(k=>input.available[k]).map(provider=>{
    const all=offers.filter(o=>o.provider===provider).sort(order);
    const best=all[0];
    const base=all.find(o=>o.type===best?.type&&(o.name==='Pay as you go'||o.name==='Single rides'));
    return {provider,best,offers:all,baseline:base?.cost??best?.cost};
  }).filter(r=>r.best).sort((a,b)=>order(a.best,b.best));
  return {rides,results,days:input.mode==='visit'?input.visitDays:input.horizon==='year'?365:30};
}
