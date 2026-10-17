import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
import {freshState} from '../js/state.js';
import {DECISIONS,SCRIPT} from '../js/script.js';
import {CONFIG} from '../js/config.js';
import {PORTRAITS} from '../js/portraits.js';
import {PHOTO_NAME} from '../js/quest.js';
import {browserSession,pause} from './browser-session.mjs';
import {createDriver,loadGame,inspect} from './v4-driver.mjs';
mkdirSync('test-results',{recursive:true});
const session=await browserSession(9341),{run,call,until,errors,failedRequests,requests}=session,visitedChoices=new Set(),screens=new Set();
async function shot(name){const img=await call('Page.captureScreenshot',{format:'png'});writeFileSync('test-results/v4-'+name+'.png',Buffer.from(img.data,'base64'));}
async function resume(){await call('Page.reload');await until('!!window.questDebug');await run('document.querySelector("#start").click()');await pause(30);}
try{
 for(let variant=0;variant<3;variant++){
  await loadGame(session,freshState());const boundaryReloads=new Set();
  const driver=createDriver(session,{choiceIndex:variant,cameraFirst:variant===1,arishaFirst:variant!==0,onPage:async p=>{
   const scene=p.state.activeScene;
   if(!screens.has(scene.id)){screens.add(scene.id);await shot(scene.id);}
   if(scene.choice){const decision=({bounty:'bounty_reaction',raid:'raid_tactics',camera:'cover_story',alex:'alex_cover',anya:'anya_reply',alisa:'alisa_hat',arisha:'arisha_capture',claim:'final_favour'})[scene.id];if(decision)visitedChoices.add(decision+':'+scene.choice);}
   // Real reloads at semantic boundaries and within a selected branch.
   const checkpoint=variant===0&&['alex','anya','alisa','arisha','capture','claim','reunion'].includes(scene.id)&&scene.index===0?'start-'+scene.id:variant===0&&scene.id==='camera'&&p.state.cameraOwned?'camera-granted':variant===0&&scene.id==='capture'&&p.state.photoTaken?'evidence-granted':variant===0&&scene.id==='claim'&&p.state.hatClaimed?'hat-granted':variant===0&&scene.id==='reunion'&&p.state.reunionDone?'reunion-complete':variant===0&&scene.id==='reunion'&&p.state.hatEquipped?'hat-equipped':variant===1&&scene.choice&&scene.index===sceneStepsOpening(scene.id,p.state)+2?'branch-'+scene.id:null;
   if(checkpoint&&!boundaryReloads.has(checkpoint)){boundaryReloads.add(checkpoint);const before=structuredClone(p.state.activeScene);await resume();assert.deepEqual((await inspect(session)).state.activeScene,before);}
   if(scene.id==='claim'){assert.equal(p.state.reunionDone,false);assert.equal(p.state.letterRead,false);}
  }});
  // Family conversations must not collapse into a shared generic interaction.
  const done=await driver.drive();assert.equal(done.state.letterRead,true);assert.equal(done.state.hatClaimed,true);assert.equal(done.state.hatEquipped,true);assert.equal(done.state.witnessRecorded,true);assert.equal(done.state.reunionDone,true);
  const texts=driver.trace.map(p=>p.text);
  for(const [id,choices]of Object.entries(DECISIONS)){const c=choices[variant];for(const line of c.lines)assert.ok(texts.includes(line.slice(line.indexOf('|')+1).replaceAll('{handle}','freakybat')),id+': '+line);for(const other of choices.filter(o=>o!==c))assert.equal(texts.includes(other.lines[0].split('|').slice(1).join('|')),false,id+' leaked unchosen branch');}
  for(const line of SCRIPT.callbacks[done.state.coverStory])assert.ok(texts.includes(line.split('|').slice(1).join('|')));
  assert.ok(driver.trace.findIndex(p=>p.scene==='reunion')>driver.trace.findIndex(p=>p.scene==='claim'));
  if(variant===1)assert.ok(driver.trace.findIndex(p=>p.scene==='alex')<driver.trace.findIndex(p=>p.scene==='raid'));
  else assert.ok(driver.trace.findIndex(p=>p.scene==='raid')<driver.trace.findIndex(p=>p.scene==='camera'));
  if(variant)assert.ok(driver.trace.findIndex(p=>p.scene==='arisha')<driver.trace.findIndex(p=>p.scene==='alisa'));
  const slots=await run('[...document.querySelectorAll(".slot[aria-label]")].map(n=>n.getAttribute("aria-label"))');assert.equal(slots.length,3);assert.equal(slots.filter(s=>s.includes('Party Hat')).length,1);assert.ok(slots.includes(PHOTO_NAME));
  await resume();assert.equal((await inspect(session)).state.letterRead,true);console.log('PASS full route',variant+1,done.state.coverStory,driver.clicks,'actions; saved dialogue and reward boundaries');
 }
 assert.equal(visitedChoices.size,24);
 const stablePhoto=await run(`(()=>{const w=questDebug.world,hat=w.playerHat.visible,head=w.actors.Anya.userData.head.rotation.x;w.playerHat.visible=false;const before=w.photo('family');w.playerHat.visible=true;w.actors.Anya.userData.head.rotation.x=.4;const after=w.photo('family');w.playerHat.visible=hat;w.actors.Anya.userData.head.rotation.x=head;return before===after;})()`);assert.equal(stablePhoto,true,'Evidence artwork must remain unchanged by equipment or live conversation poses');console.log('PASS evidence photograph remains unchanged after equipping the hat');
 // Every map destination must be reachable on the real built collision map.
 const paths=await run(`(async()=>{const {TARGETS}=await import('./js/map-data.js');const w=questDebug.world;return Object.keys(TARGETS).map(id=>{const ok=w.approach(id,()=>{});w.stop();return{id,ok};});})()`);assert.ok(paths.every(p=>p.ok),JSON.stringify(paths));console.log('PASS all',paths.length,'destinations reachable');
 const art=await run(`(async()=>{const {PORTRAITS}=await import('./js/portraits.js');for(const p of Object.values(PORTRAITS)){const img=new Image();img.src=p;await img.decode();if(img.naturalWidth!==img.naturalHeight)throw Error(p);}return Object.keys(PORTRAITS).length;})()`);assert.equal(art,14);
 // Optional conversations are sought out; no ambient narration remains.
 await run('document.querySelector("[data-tab=targets]").click()');await run(`[...document.querySelectorAll('.target')].find(n=>n.textContent.startsWith('Igor')).click()`);
 let optional=createDriver(session);await optional.drive(p=>p.state.seenOptional.includes('football')&&!p.state.activeScene);assert.equal(optional.trace[0].speaker,'Igor');console.log('PASS optional football does not create a match or reward');
 const memory=await run(`(()=>{const w=questDebug.world;w.tick(0);const start=w.renderer.info.memory.geometries;for(let n=0;n<5;n++)w.photo('family');w.tick(0);return{start,end:w.renderer.info.memory.geometries,calls:w.renderer.info.render.calls};})()`);assert.ok(memory.end<=memory.start+3,JSON.stringify(memory));console.log('PASS photo GPU cleanup',memory);
 for(const [width,height,label]of [[1440,960,'desktop'],[1280,720,'laptop'],[390,844,'phone'],[844,390,'landscape']]){
  await call('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<951});await pause(150);
  const box=await run('({overflow:document.documentElement.scrollWidth>innerWidth,height:document.documentElement.scrollHeight,world:document.querySelector("#world").getBoundingClientRect().height})');assert.equal(box.overflow,false);assert.ok(box.height<=height+1);assert.ok(box.world>height*.35,JSON.stringify(box));await shot(label);
 }
 await call('Emulation.setDeviceMetricsOverride',{width:1440,height:960,deviceScaleFactor:1,mobile:false});
 for(const id of ['bank','house','park','photo','tower']){await run(`questDebug.world.focusOn('${id}');questDebug.world.focus.copy(questDebug.world.desiredFocus);questDebug.world.tick(.05)`);await shot('world-'+id);}
 assert.ok(requests.filter(u=>u.startsWith('http')).every(u=>new URL(u).origin==='http://127.0.0.1:8000'));assert.deepEqual(failedRequests,[]);assert.deepEqual(errors,[]);
 writeFileSync('test-results/v4-verification.json',JSON.stringify({branches:visitedChoices.size,routes:3,reachable:paths.length,portraits:art,memory,browserErrors:errors,failedRequests},null,2));
 console.log('PASS 24 branches, three callbacks, both preparation and family orders, reloads, 14 assets, four layouts, static assets and no browser errors.');
}finally{await session.close();}
function sceneStepsOpening(id,s){return ({bounty:SCRIPT.bounty_intro,raid:SCRIPT.raid_recruit,camera:SCRIPT.camera_plan,alex:SCRIPT.alex_rehearsal,anya:SCRIPT.anya_conversation,alisa:SCRIPT.alisa_conversation,arisha:SCRIPT.arisha_conversation,claim:SCRIPT.bounty_claim})[id]?.length??-100;}

