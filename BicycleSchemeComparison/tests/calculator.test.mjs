import test from 'node:test';
import assert from 'node:assert/strict';
import { compareOffers, generateRides, optimizeBundles } from '../calculator.mjs';
const base={mode:'visit',visitDays:1,minutes:15,ridesPerDay:2,weekdays:[1,2,3,4,5],horizon:'month',start:'2026-11-06',bike:'electric',available:{santander:true,lime:true,forest:true},eligibility:[],resident:'none',origin:'first',forestFree:0};
const compare=changes=>compareOffers({...base,...changes});
const offer=(result,provider,name,type='electric')=>result.results.find(r=>r.provider===provider).offers.find(o=>o.name===name&&o.type===type);
test('Santander single ride 30/31-minute boundaries and pedal filter',()=>{
 assert.equal(offer(compare({ridesPerDay:1,minutes:30}),'santander','Single rides').cost,300);
 assert.equal(offer(compare({ridesPerDay:1,minutes:31}),'santander','Single rides').cost,600);
 assert.equal(offer(compare({ridesPerDay:1,minutes:31,bike:'any'}),'santander','Single rides','pedal').cost,330);
 assert.ok(compare({}).results.flatMap(r=>r.offers).every(o=>o.type==='electric'));
});
test('Santander e-bike and pedal membership overrun at 60/61 minutes',()=>{
 assert.equal(offer(compare({ridesPerDay:1,minutes:60}),'santander','Monthly Pass').cost,2100);
 assert.equal(offer(compare({ridesPerDay:1,minutes:61}),'santander','Monthly Pass').cost,2400);
 assert.equal(offer(compare({ridesPerDay:1,minutes:61,bike:'any'}),'santander','Monthly Pass','pedal').cost,2165);
});
test('Santander charges full annual purchase, with correct discounts',()=>{
 assert.equal(offer(compare({}),'santander','Annual Pass').cost,12200);
 assert.equal(offer(compare({eligibility:['nhs']}),'santander','Monthly Pass · discounted').cost,1200);
 assert.equal(offer(compare({eligibility:['sector']}),'santander','Annual Pass · discounted').cost,6200);
 const student=compare({eligibility:['student'],bike:'any',ridesPerDay:3});
 assert.equal(student.results.find(r=>r.provider==='santander').best.cost,175);
});
test('Prime and Flex boundaries',()=>{
 for(const [minutes,cost] of [[5,799],[6,869],[20,869],[21,885]])assert.equal(offer(compare({minutes,ridesPerDay:1}),'lime','LimePrime').cost,cost);
 for(const [minutes,cost] of [[10,799],[11,869],[30,869],[31,902]])assert.equal(offer(compare({minutes,ridesPerDay:1}),'forest','Forest Flex').cost,cost);
});
test('Forest free minutes affect PAYG only and cannot stack with subscriptions',()=>{
 const a=compare({forestFree:30}),b=compare({forestFree:0});
 assert.equal(offer(a,'forest','Pay as you go').cost,200);
 assert.equal(offer(a,'forest','Forest Flex').cost,offer(b,'forest','Forest Flex').cost);
 assert.equal(offer(compare({forestFree:30,eligibility:['student']}),'forest','Friends of the Forest').cost,100);
});
test('bundle expiry, overage, depletion, repurchase and unused minutes',()=>{
 const start=Date.parse('2026-11-06T09:00Z'), bundle={name:'test',minutes:30,days:1,price:300};
 const r=(time,minutes=10)=>({time,minutes});
 const payg=r=>100+r.minutes*31;
 assert.equal(optimizeBundles([r(start),r(start+1000)],[bundle],payg,31).cost,300);
 assert.equal(optimizeBundles([r(start),r(start+86400000)],[bundle],payg,31).cost,600);
 assert.equal(optimizeBundles([r(start,40)],[bundle],payg,31).cost,610);
 const repeated=optimizeBundles([r(start,30),r(start+1000,30)],[bundle],payg,31);
 assert.equal(repeated.cost,600);assert.equal(repeated.purchases.length,2);
 assert.equal(optimizeBundles([r(start,10)],[bundle],payg,31).unused,20);
});
test('bundle optimization agrees with an exhaustive small reference solver',()=>{
 const bundles=[{name:'small',minutes:20,days:1,price:199},{name:'big',minutes:50,days:3,price:399}];
 const pay=r=>100+r.minutes*31;
 function brute(rides,i=0){if(i===rides.length)return 0;let best=pay(rides[i])+brute(rides,i+1);for(const b of bundles){let left=b.minutes,j=i,extra=0;while(j<rides.length&&rides[j].time<rides[i].time+b.days*86400000&&left>0){extra+=Math.max(0,rides[j].minutes-left)*31;left=Math.max(0,left-rides[j].minutes);j++;}best=Math.min(best,b.price+extra+brute(rides,j));}return best;}
 for(let n=1;n<8;n++){const rides=Array.from({length:n},(_,i)=>({time:i*12*3600000,minutes:7+i*3}));assert.equal(optimizeBundles(rides,bundles,pay,31).cost,brute(rides));}
});
test('resident fares apply only to qualifying origins and do not stack',()=>{
 const r=compare({minutes:25,resident:'hackney'});
 assert.equal(offer(r,'lime','Hackney resident fare').cost,175+875);
 assert.equal(offer(compare({minutes:26,resident:'hackney',origin:'all'}),'lime','Hackney resident fare').cost,412);
 assert.equal(offer(compare({minutes:20,resident:'southwark',origin:'all'}),'lime','Southwark resident fare').cost,350);
 assert.ok(!compare({minutes:21,resident:'southwark'}).results.find(r=>r.provider==='lime').offers.some(o=>o.name==='Southwark resident fare'));
 assert.equal(offer(compare({minutes:25,resident:'hackney',origin:'all',eligibility:['student']}),'lime','Hackney resident fare').cost,350);
});
test('subscription calendar renewal and annual schedule',()=>{
 const r=compare({mode:'regular',horizon:'year',ridesPerDay:1,weekdays:[0,1,2,3,4,5,6]});
 assert.equal(r.rides.length,365);assert.equal(offer(r,'lime','LimePrime').purchases.length,12);
 assert.equal(generateRides({...base,mode:'regular',weekdays:[]}).length,0);
});
test('empty, invalid, edited-price and excluded-provider scenarios',()=>{
 assert.ok(compare({ridesPerDay:0}).results.every(r=>r.best.cost===0));
 assert.equal(compare({available:{santander:false,lime:false,forest:false}}).results.length,0);
 assert.throws(()=>compare({minutes:-1}));assert.throws(()=>compare({prices:{limeMinute:NaN}}));
 assert.equal(offer(compare({prices:{limeMinute:50}}),'lime','Pay as you go').cost,1700);
});
test('work quote is costed with its allowance and annual commitment gating',()=>{
 const work={enabled:true,provider:'forest',price:5000,allowance:1800,overage:33,unlock:0,term:1};
 assert.equal(offer(compare({work}),'forest','Your work-benefit quote').cost,5000);
 assert.ok(!compare({work:{...work,term:12}}).results.flatMap(r=>r.offers).some(o=>o.name==='Your work-benefit quote'));
 assert.ok(!compare({horizon:'year',work:{...work,term:12}}).results.flatMap(r=>r.offers).some(o=>o.name==='Your work-benefit quote'));
 const electric={...work,provider:'santander',price:3000,allowance:60,overage:300};
 assert.equal(offer(compare({minutes:61,work:electric}),'santander','Your work-benefit quote').cost,3600);
});
test('independent hand-calculated visitor and regular rider examples',()=>{
 const one=compare({ridesPerDay:1,minutes:15});
 assert.equal(one.results.find(r=>r.provider==='santander').best.cost,300);
 assert.equal(one.results.find(r=>r.provider==='forest').best.cost,299);
 const weekend=compare({visitDays:3,ridesPerDay:3,minutes:15,bike:'any'});
 assert.equal(weekend.results.find(r=>r.provider==='santander').best.cost,1050);
 const commute=compare({mode:'regular',bike:'any'});
 assert.equal(commute.rides.length,42);
 assert.equal(commute.results[0].provider,'santander');assert.equal(commute.results[0].best.cost,2000);
 const annual=compare({mode:'regular',horizon:'year',bike:'any',eligibility:['student']});
 assert.equal(annual.results[0].best.cost,9000);
});
