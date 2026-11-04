const {test}=require('node:test'),assert=require('node:assert/strict'),E=require('../engine.js');
const example={1:{rail:2,bus:2,from:1,to:5},2:{rail:0,bus:2},3:{rail:1,bus:2,tram:true,from:1,to:2}};
test('Monday rail/bus, Tuesday bus-only and Wednesday rail/tram have independent daily costs',()=>{
 const r=E.compare({start:'2026-11-02',week:example});
 assert.equal(r.records[0].cost,1280);assert.equal(r.records[1].cost,370);assert.equal(r.records[2].cost,730);assert.equal(r.records[3].cost,0);
 assert.equal(r.payg,11170);assert.equal(r.days,14);assert.equal(r.monthly,29340);assert.equal(r.weekSummary.length,3);
});
test('a repeated weekly plan matches the usual-day shortcut',()=>{
 for(const mode of ['tube','national','bus']) {
  const bus=mode==='bus';const s={start:'2026-11-04',mode,trips:2,extraBus:bus?0:2,days:[1,2,3,4,5],from:1,to:5};
  const usual=E.compare(s),week=E.compare({...s,week:Object.fromEntries(s.days.map(d=>[d,{rail:bus?0:2,bus:2,from:1,to:5}]))});
  assert.equal(week.payg,usual.payg);assert.equal(week.flexible,usual.flexible);assert.equal(week.monthly,usual.monthly);
 }
});
test('a bus-only week uses a bus pass even if the unused usual day has rail zones',()=>{
 const r=E.compare({week:{1:{rail:0,bus:2},2:{rail:0,bus:4}},from:1,to:6});
 assert.equal(r.busOnly,true);assert.equal(r.monthly,10030);assert.equal(r.records.find(x=>x.date==='2026-11-09').cost,370);
});
test('daily rail zones are priced independently and the pass covers their union',()=>{
 const r=E.compare({start:'2026-11-02',week:{1:{rail:2,bus:0,from:1,to:2},2:{rail:2,bus:0,from:2,to:6}}});
 assert.equal(r.records[0].cost,670);assert.equal(r.records[1].cost,760);assert.equal(r.monthly,31340);
});
test('trams on a bus-only day extend the rail Travelcard to Zone 3',()=>{
 const r=E.compare({week:{1:{rail:2,bus:0,from:1,to:2},2:{rail:0,bus:2,tram:true}}});
 assert.equal(r.ticketHi,3);assert.equal(r.monthly,20160);
});
test('individual days can have different touch-in times',()=>{
 const r=E.compare({start:'2026-11-02',week:{1:{rail:2,bus:0,from:1,to:5,out:600,back:1200},2:{rail:2,bus:0,from:1,to:5,out:480,back:1050}}});
 assert.equal(r.records[0].cost,760);assert.equal(r.records[1].cost,910);
});
test('days away skip the first selected dates across the whole weekly plan',()=>{
 const r=E.compare({start:'2026-11-02',week:example,away:2});assert.equal(r.records[0].cost,0);assert.equal(r.records[1].cost,0);assert.equal(r.records[2].cost,730);assert.equal(r.days,12);
});
test('free travel and student pricing continue to work with different days',()=>{
 assert.equal(E.compare({week:example,profile:'disabled'}).payg,0);
 const adult=E.compare({week:example}),student=E.compare({week:example,profile:'student'});assert.equal(adult.payg,student.payg);assert.equal(student.monthly,20510);
});
test('reject empty, malformed and invalid daily patterns',()=>{
 for(const week of [{},{1:{rail:0,bus:0}},{8:{rail:2,bus:0}},{1:{rail:-1,bus:0}},{1:{rail:2,bus:NaN}},{1:{rail:2,bus:0,from:7}},[]])assert.throws(()=>E.compare({week}));
});
