const {test}=require('node:test'),assert=require('node:assert/strict'),E=require('../engine.js');
const daily={start:'2026-11-04',from:1,to:5,days:[0,1,2,3,4,5,6]};
test('two daily rail trips can favour PAYG; more trips can favour the monthly Travelcard',()=>{
 const light=E.compare({...daily,trips:2}),frequent=E.compare({...daily,trips:4});
 assert.equal(light.winner,'payg');assert.equal(frequent.winner,'monthly');assert(frequent.payg>light.payg);assert.equal(frequent.monthly,light.monthly);
});
test('bus plus Tube commute adds bus fares to PAYG, not to the Travelcard',()=>{
 const rail=E.compare({...daily,trips:2}),mixed=E.compare({...daily,trips:2,extraBus:2});
 assert.equal(mixed.winner,'monthly');assert(mixed.payg>rail.payg);assert.equal(mixed.monthly,rail.monthly);
 assert.equal(mixed.records[0].cost,1280);
});
test('more rail trips alternate direction, including the evening inbound fare exception',()=>{
 const r=E.compare({start:'2026-11-02',days:[1],from:1,to:5,trips:3});
 assert.equal(r.records[0].cost,530+380+530);
});
test('zero bus journeys stays zero; no hidden default for mixed travel',()=>{
 assert.equal(E.compare({...daily,mode:'mixed',extraBus:0}).payg,E.compare(daily).payg);
});
test('bus journeys are included alongside National Rail too',()=>{
 const rail=E.compare({...daily,mode:'national'}),mixed=E.compare({...daily,mode:'national',extraBus:2});
 assert(mixed.payg>rail.payg);assert.equal(mixed.monthly,rail.monthly);
});
test('rail and bus costs share the rail daily cap',()=>{
 const r=E.compare({...daily,trips:8,extraBus:8});assert.equal(r.records[0].cost,1530);
});
