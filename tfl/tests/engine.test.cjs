const {test}=require('node:test');
const assert=require('node:assert/strict');
const E=require('../engine.js'),F=require('../fares.js');
const all=[0,1,2,3,4,5,6];
test('adult three-day commute costs singles, not daily caps',()=>{
 const r=E.compare({start:'2026-11-02',days:[1,2,3]});
 assert.equal(r.days,14);assert.equal(r.payg,14*670);assert.equal(r.monthly,17170);assert.equal(r.winner,'payg');
});
test('weekly caps reset Monday and apply in partial weeks',()=>{
 const r=E.compare({start:'2026-11-02',days:all,trips:12});
 assert.equal(r.payg,4470*4+890*2);assert.equal(r.records[0].cost,890);
});
test('student season tickets do not discount PAYG',()=>{
 const a=E.compare({start:'2026-11-02'}),s=E.compare({start:'2026-11-02',profile:'student'});
 assert.equal(a.payg,s.payg);assert.equal(s.monthly,11990);assert.equal(s.weeklyTicket,3120);
});
test('bus prices use November fares and daily caps',()=>{
 const r=E.compare({mode:'bus',start:'2026-11-02',days:[1],trips:2});
 assert.equal(r.records[0].cost,370);assert.equal(r.monthly,10030);
 assert.equal(E.compare({mode:'bus',start:'2026-11-02',days:[1],trips:8}).records[0].cost,555);
});
test('outer-zone daily cap is not the cheaper outer-zone season price',()=>{
 const r=E.compare({start:'2026-11-02',from:3,to:4,trips:12,days:[1]});
 assert.equal(r.records[0].cost,1280);assert.equal(r.monthly,12870);
});
test('passing through Zone 1 changes the fare and Travelcard',()=>{
 const outer=E.compare({from:2,to:3}),central=E.compare({from:2,to:3,via1:true});
 assert.equal(outer.monthly,12870);assert.equal(central.monthly,20160);assert(central.payg>outer.payg);
});
test('child Zip has flat Tube singles and the child off-peak cap',()=>{
 const r=E.compare({start:'2026-11-02',profile:'zip11',out:600,back:1200,trips:8,days:[1],from:1,to:6});
 assert.equal(r.records[0].cost,190);assert.equal(r.monthly,15670);
 assert.equal(E.compare({start:'2026-11-02',profile:'zip11',days:[1]}).records[0].cost,200);
});
test('London-resident 16+ Zip has free bus travel',()=>{
 assert.equal(E.compare({mode:'bus',profile:'zip16',days:all}).payg,0);
 assert(E.compare({mode:'bus',profile:'zip16outside',days:all}).payg>0);
});
test('older passes charge morning journeys but not the return',()=>{
 const r=E.compare({start:'2026-11-02',profile:'older',days:[1]});assert.equal(r.records[0].cost,360);
 const free=E.compare({start:'2026-11-02',profile:'older',out:540,back:1050,days:[1]});assert.equal(free.payg,0);
 assert.equal(E.compare({start:'2026-11-02',mode:'bus',profile:'older',days:[1]}).records[0].cost,185);
});
test('disabled Freedom Pass is free on TfL at any time',()=>assert.equal(E.compare({profile:'disabled',days:all}).payg,0));
test('Disabled Persons Railcard has a reduced peak daily cap',()=>{
 const r=E.compare({start:'2026-11-02',railcard:'disabled',days:[1],trips:12});assert.equal(r.records[0].cost,590);
});
test('Young Visitor month is blocked instead of extending a 14-day discount',()=>assert(E.compare({profile:'visitor'}).blocked));
test('inbound evening peak, weekends and touch-in boundaries',()=>{
 assert.equal(E.peak(960,false,true),false);assert.equal(E.peak(960,false,false),true);assert.equal(E.peak(570,false,false),false);assert.equal(E.peak(390,false,false),true);assert.equal(E.peak(480,true,false),false);
});
test('bank holidays use off-peak rates on selected travel days',()=>{
 const r=E.compare({start:'2026-12-25',days:[5]});assert.equal(r.records[0].cost,620);assert.equal(r.records[0].holiday,true);
});
test('monthly period is calendar-based, not four weeks',()=>{
 const r=E.compare({start:'2026-11-04',days:all});assert.equal(r.calendarDays,30);assert.equal(r.end,'2026-12-04');
 assert.equal(E.compare({start:'2026-12-04'}).calendarDays,31);
});
test('discounted weekly tickets can beat both uncapped PAYG and monthly',()=>{
 const r=E.compare({start:'2026-11-02',profile:'student',days:all,away:10,trips:6});
 assert(r.flexible<=r.payg);assert(r.flexible<r.monthly);assert.equal(r.winner,'weekly');
 assert.equal(r.plan.reduce((n,p)=>n+p.cost,0),r.flexible);assert(r.plan.some(p=>p.type==='weekly'));
});
test('exact route fares override the generic single fare but keep caps',()=>{
 const r=E.compare({start:'2026-11-02',mode:'special',days:[1],custom:{enabled:true,out:1550,back:1550},from:1,to:6});
 assert.equal(r.records[0].cost,1630);assert(E.compare({mode:'special'}).blocked);
});
test('trams need a season ticket extending to zone 3',()=>{
 const r=E.compare({tram:true,mode:'mixed'});assert.equal(r.ticketHi,3);assert.equal(r.monthly,20160);assert.equal(r.weeklyCap,4470);
});
test('reject invalid inputs and impossible stacked discounts',()=>{
 for(const input of [{from:9},{trips:NaN},{start:'2026-02-30'},{railcard:'offpeak',profile:'zip16'},{days:[1,1]},{away:-1}])assert.throws(()=>E.compare(input));
});
test('all standard zone and profile combinations produce finite integer costs',()=>{
 for(const profile of Object.keys(F.profiles).filter(k=>k!=='visitor'))for(let from=1;from<=6;from++)for(let to=1;to<=6;to++){
  const r=E.compare({profile,from,to,days:all});for(const n of [r.payg,r.monthly,r.flexible])assert(Number.isInteger(n)&&n>=0,`${profile} ${from}-${to}`);
  assert(r.flexible<=r.payg);
 }
});
