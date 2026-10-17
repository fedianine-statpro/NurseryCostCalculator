import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {freshState,transition} from '../js/state.js';
import {through} from '../tests/helpers.js';
import {sceneDefinition} from '../js/quest.js';
import {DECISIONS,SCRIPT,HINTS} from '../js/script.js';
import {TARGETS} from '../js/map-data.js';
import {browserSession,pause} from './browser-session.mjs';
import {createDriver,loadGame,inspect} from './v4-driver.mjs';
const session=await browserSession(9343),{run,call,until,errors,failedRequests}=session;mkdirSync('test-results',{recursive:true});
async function shot(name){const s=await call('Page.captureScreenshot',{format:'png'});writeFileSync('test-results/v4-ui-'+name+'.png',Buffer.from(s.data,'base64'));}
const scenarios=[['bounty',freshState()],['raid',through('bounty')],['camera',through('bounty')],['alex',through('camera')],['anya',through('alex')],['alisa',through('anya')],['arisha',through('anya')],['claim',through('photo')]];
try{
 for(const [id,state]of scenarios){const t=TARGETS[({bounty:'bank',raid:'park',camera:'house',alex:'alex',anya:'photo',alisa:'alisa',arisha:'arisha',claim:'bank'})[id]];state.playerPosition={x:t.x,z:t.z+2};state.started=true;const def=sceneDefinition(id,state);state.activeScene={id,index:def.opening.length,choice:null};await loadGame(session,state);
  for(const [width,height,label]of [[1280,720,'laptop'],[390,844,'phone'],[844,390,'landscape']]){
   await call('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<951});await pause(60);
   const p=await run(`(()=>{const chat=document.querySelector('#chat'),world=document.querySelector('#world').getBoundingClientRect(),buttons=[...document.querySelectorAll('#actions button')];return{count:buttons.length,overflow:document.documentElement.scrollWidth>innerWidth,screenHeight:document.documentElement.scrollHeight,worldHeight:world.height,buttons:buttons.map(n=>({text:n.textContent,width:n.getBoundingClientRect().width,scroll:n.scrollWidth,client:n.clientWidth}))};})()`);
   assert.equal(p.count,3,id);assert.equal(p.overflow,false,id);assert.ok(p.screenHeight<=height+1,JSON.stringify(p));assert.ok(p.worldHeight>=height*.35,JSON.stringify(p));assert.ok(p.buttons.every(b=>b.scroll<=b.client+1),JSON.stringify(p));
   if(['alex','anya','claim'].includes(id))await shot(id+'-choices-'+label);
  }
  // Enter on a choice must never bypass its required selection.
  const before=(await inspect(session)).state.activeScene;await run('document.activeElement.blur()');await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});await call('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});assert.equal((await inspect(session)).state.activeScene.index,before.index);assert.equal((await inspect(session)).state.activeScene.choice,null);
 }
 console.log('PASS all eight decision menus at laptop, phone and landscape sizes; Enter cannot bypass choices');
 let state=through('alex');state.activeScene={id:'anya',index:SCRIPT.anya_conversation.findIndex(l=>l.length===Math.max(...SCRIPT.anya_conversation.map(l=>l.length))),choice:null};state.settings.largeText=true;
 await loadGame(session,state,390,844);await until('document.querySelector(".speaker-portrait")?.complete');const portrait=await run(`(()=>{const p=document.querySelector('.speaker-portrait'),r=p.getBoundingClientRect(),c=document.querySelector('#chat').getBoundingClientRect();return{width:p.naturalWidth,shown:r.width,inside:r.left>=c.left&&r.right<=c.right,scroll:document.documentElement.scrollWidth>innerWidth};})()`);assert.ok(portrait.width>1000);assert.equal(portrait.inside,true);assert.equal(portrait.scroll,false);await shot('portrait-large-text');
 const beforeSettings=(await inspect(session)).state.activeScene;await run('document.querySelector("#mobileSettings").click()');assert.equal(await run('document.querySelectorAll(".voice-setting").length'),11);await run('document.querySelector("#closeModal").click()');assert.deepEqual((await inspect(session)).state.activeScene,beforeSettings);console.log('PASS portrait, large text, voice controls, and settings preserve current conversation');
 await run(`(async()=>{const {PORTRAITS}=await import('./js/portraits.js');PORTRAITS.Anya=PORTRAITS.Andrey='assets/portraits/missing-test.png';})()`);await run('document.querySelector("[data-tab=journal]").click()');await run(`[...document.querySelectorAll('#sideContent button')].find(b=>b.textContent==='Continue quest').click()`);await until(`document.querySelector('.speaker-portrait')?.src.startsWith('data:image/svg+xml')`,'missing portrait fallback');assert.ok((await inspect(session)).state.activeScene);console.log('PASS missing portrait falls back while keeping the active conversation');

 // Real projected pointer events exercise hit-testing and hover cursors.
 await loadGame(session,through('letter'));
 const point=await run(`(()=>{const w=questDebug.world;w.player.position.set(6,0,23);w.focusOn({x:6,z:25});w.focus.copy(w.desiredFocus);w.tick(.05);const p=w.player.position.clone().set(6,1,25);p.project(w.camera);const r=w.canvas.getBoundingClientRect();return{x:r.left+(p.x+1)*r.width/2,y:r.top+(1-p.y)*r.height/2};})()`);
 await call('Input.dispatchMouseEvent',{type:'mouseMoved',...point});assert.equal(await run('document.querySelector("#world").style.cursor'),'pointer');assert.match(await run('document.querySelector("#hoverHint").textContent'),/Look into well/);
 await call('Input.dispatchMouseEvent',{type:'mousePressed',...point,button:'left',clickCount:1});await call('Input.dispatchMouseEvent',{type:'mouseReleased',...point,button:'left',clickCount:1});for(let i=0;i<4;i++){await run('for(let n=0;n<100;n++)questDebug.world.tick(.05)');await pause(30);}assert.ok((await inspect(session)).state.discoveries.includes('well'));
 const centre=await run('(()=>{const r=document.querySelector("#world").getBoundingClientRect();return{x:r.left+r.width*.5,y:r.top+r.height*.6};})()'),yaw=await run('questDebug.world.yaw');
 await call('Input.dispatchMouseEvent',{type:'mousePressed',...centre,button:'left',clickCount:1});await call('Input.dispatchMouseEvent',{type:'mouseMoved',x:centre.x+70,y:centre.y,button:'left',buttons:1});await call('Input.dispatchMouseEvent',{type:'mouseReleased',x:centre.x+70,y:centre.y,button:'left',clickCount:1});assert.notEqual(await run('questDebug.world.yaw'),yaw);assert.equal(await run('questDebug.world.walk.length'),0);
 await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await pause(100);const zoom=await run('questDebug.world.zoom');await call('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:130,y:200,id:0},{x:240,y:200,id:1}]});await call('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:100,y:200,id:0},{x:270,y:200,id:1}]});await call('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.notEqual(await run('questDebug.world.zoom'),zoom);assert.equal(await run('questDebug.world.walk.length'),0);
 console.log('PASS real world hover/click, discovery, orbit and pinch without accidental walking');
 await loadGame(session,freshState());
 async function visit(id,predicate){await run('document.querySelector("[data-tab=targets]").click()');await run(`document.querySelector('[data-target="${id}"]').click()`);await createDriver(session).drive(predicate,100);}
 for(const id of ['house','alex','park','photo','alisa','arisha','football']){await visit(id,p=>p.text===HINTS.opening.split('|')[1]);assert.equal((await inspect(session)).state.bountyStarted,false);await run(`document.querySelector('#dialogue').click()`);}
 await loadGame(session,through('bounty'));await visit('bank',p=>p.text===HINTS.proof.split('|')[1]);assert.equal((await inspect(session)).state.activeScene,null);
 const cameraOnly=through('camera');cameraOnly.raidJoined=false;await loadGame(session,cameraOnly);await createDriver(session).drive(p=>p.state.alexTalked&&!p.state.activeScene);await visit('photo',p=>p.text===HINTS.familyRegister.split('|')[1]);
 const oneGirl=through('alisa');await loadGame(session,oneGirl);await visit('alisa',p=>p.text===HINTS.arisha.split('|')[1]);await run(`document.querySelector('#dialogue').click()`);await visit('arisha',p=>p.state.activeScene?.id==='arisha');
 console.log('PASS early visits, bank proof hint, independent registration and pending daughter routing');

 // Optional dialogue runs once, only after being sought out.
 let recruited=through('raid');await loadGame(session,recruited);await run('document.querySelector("[data-tab=targets]").click()');await run(`[...document.querySelectorAll('.target')].find(b=>b.textContent.startsWith('Keeper')).click()`);await createDriver(session).drive(p=>p.state.seenOptional.includes('meditation')&&!p.state.activeScene);
 await loadGame(session,through('letter'));await run('document.querySelector("[data-tab=targets]").click()');await run(`[...document.querySelectorAll('.target')].find(b=>b.textContent.startsWith('Danya')).click()`);const optional=createDriver(session);await optional.drive(p=>p.state.seenOptional.includes('after_party')&&!p.state.activeScene);assert.ok(optional.trace.some(p=>p.text==='"Andrey. Birthday. No weapons."'));
 // Old saves get an explicit new-story notice and preferences survive.
 await loadGame(session,{saveVersion:1,stage:9,hatEquipped:true,settings:{muted:false,largeText:true},handle:'toldo'});assert.equal((await inspect(session)).state.bountyStarted,false);assert.equal((await inspect(session)).state.settings.largeText,true);
 assert.deepEqual(errors,[]);assert.deepEqual(failedRequests.filter(url=>!url.endsWith('/assets/portraits/missing-test.png')),[]);console.log('PASS optional meditation, post-letter invitation and old-save migration; no browser errors.');
}finally{await session.close();}




