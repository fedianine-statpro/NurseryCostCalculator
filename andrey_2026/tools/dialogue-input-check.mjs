import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {freshState} from '../js/state.js';
import {through} from '../tests/helpers.js';
import {SCRIPT,DECISIONS} from '../js/script.js';
import {sceneDefinition} from '../js/quest.js';
import {browserSession,pause} from './browser-session.mjs';
import {loadGame,inspect} from './v4-driver.mjs';
const session=await browserSession(9345),{call,run,until,errors,failedRequests}=session;
mkdirSync('test-results',{recursive:true});
const point=selector=>run(`(()=>{const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return{x:r.left+r.width*.5,y:r.top+r.height*.5};})()`);
async function tap(selector){const p=await point(selector);await call('Input.dispatchMouseEvent',{type:'mousePressed',...p,button:'left',clickCount:1});await call('Input.dispatchMouseEvent',{type:'mouseReleased',...p,button:'left',clickCount:1});await pause(25);}
const index=async()=>(await inspect(session)).state.activeScene.index;
async function unchanged(fn){const before=await index();await fn();assert.equal(await index(),before);}
try{
 await call('Page.addScriptToEvaluateOnNewDocument',{source:`window.__speech=[];speechSynthesis.speak=u=>{window.__speech.push({text:u.text,pitch:u.pitch,rate:u.rate});};`});
 const state=freshState();state.started=true;state.activeScene={id:'bounty',index:1,choice:null};
 await loadGame(session,state);assert.equal((await inspect(session)).state.settings.muted,false);assert.equal((await inspect(session)).state.settings.voices,false);
 assert.equal(await run('window.__speech.length'),0);
 assert.equal(await run('!!document.querySelector("#chatLog")'),false);assert.equal(await run('document.querySelectorAll("#actions button").length'),0);
 assert.equal(await run('/Conversation\\s*[:·]\\s*\\d/.test(document.querySelector("#chat").textContent)'),false);
 for(const selector of ['.speaker-text','#world','header h1']){const before=await index();await tap(selector);assert.equal(await index(),before+1);assert.equal(await run('questDebug.world.walk.length'),0);}
 assert.equal(await run('document.querySelectorAll("#dialogue button").length'),0);
 await unchanged(async()=>{await tap('#settingsButton');assert.equal(await run('document.querySelector("#modal").open'),true);await tap('#world');await tap('#closeModal');});
 await unchanged(async()=>{await tap('#settingsButton');await run('document.querySelector("[aria-label=\\"Character voices\\"]").click()');await tap('#closeModal');});assert.equal((await inspect(session)).state.settings.voices,true);await tap('#dialogue');assert.equal(await run('window.__speech.length'),1);
 await unchanged(()=>tap('#muteButton'));assert.equal((await inspect(session)).state.settings.muted,true);
 await call('Page.reload');await until('!!window.questDebug');await run('document.querySelector("#start").click()');assert.equal((await inspect(session)).state.settings.muted,true);assert.equal(await run('window.__speech.length'),0);
 for(const key of [' ','Enter']){const before=await index();await run('document.activeElement.blur()');await call('Input.dispatchKeyEvent',{type:'keyDown',key,code:key===' '?'Space':'Enter',windowsVirtualKeyCode:key===' '?32:13});await call('Input.dispatchKeyEvent',{type:'keyUp',key,code:key===' '?'Space':'Enter',windowsVirtualKeyCode:key===' '?32:13});assert.equal(await index(),before+1);}
 await unchanged(async()=>{await run('document.activeElement.blur()');await call('Input.dispatchKeyEvent',{type:'keyDown',key:' ',code:'Space',windowsVirtualKeyCode:32,autoRepeat:true});await call('Input.dispatchKeyEvent',{type:'keyUp',key:' ',code:'Space',windowsVirtualKeyCode:32});});
 // Two clicks belonging to the same double-click advance only one line.
 let before=await index(),p=await point('.speaker-text');
 for(const clickCount of [1,2]){await call('Input.dispatchMouseEvent',{type:'mousePressed',...p,button:'left',clickCount});await call('Input.dispatchMouseEvent',{type:'mouseReleased',...p,button:'left',clickCount});}
 assert.equal(await index(),before+1);
 // Camera drags and pinch gestures retain their normal controls without consuming dialogue.
 before=await index();p=await point('#world');const yaw=await run('questDebug.world.yaw');
 await call('Input.dispatchMouseEvent',{type:'mousePressed',...p,button:'left',clickCount:1});await call('Input.dispatchMouseEvent',{type:'mouseMoved',x:p.x+80,y:p.y,buttons:1,button:'left'});await call('Input.dispatchMouseEvent',{type:'mouseReleased',x:p.x+80,y:p.y,button:'left',clickCount:1});assert.equal(await index(),before);assert.notEqual(await run('questDebug.world.yaw'),yaw);
 await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await call('Emulation.setTouchEmulationEnabled',{enabled:true});await pause(100);
 const zoom=await run('questDebug.world.zoom');await call('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:120,y:220,id:0},{x:240,y:220,id:1}]});await call('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:90,y:220,id:0},{x:270,y:220,id:1}]});await call('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await pause(50);assert.equal(await index(),before);assert.notEqual(await run('questDebug.world.zoom'),zoom);
 p=await point('.speaker-text');await call('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...p,id:0}]});await call('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await pause(100);assert.equal(await index(),before+1);
 const image=await call('Page.captureScreenshot',{format:'png'});writeFileSync('test-results/dialogue-tap-phone.png',Buffer.from(image.data,'base64'));
 console.log('PASS sound defaults on, voices off; opt-in speech works and saved mute persists; mouse, keyboard and touch advance; controls, double-click, drag and pinch are protected; no counter or Next button');
 // Clicking the background cannot choose a reply; the selected reply appears exactly once.
 const choice=freshState();choice.started=true;const at=sceneDefinition('bounty',choice).opening.length;choice.activeScene={id:'bounty',index:at,choice:null};await loadGame(session,choice);
 assert.equal((await inspect(session)).canContinue,false);await unchanged(()=>tap('#world'));assert.equal((await inspect(session)).state.activeScene.choice,null);
 await tap('#actions button:nth-child(2)');assert.equal(await index(),at+1);assert.equal((await inspect(session)).text,DECISIONS.bounty_reaction[1].lines[0].split('|')[1]);assert.equal((await inspect(session)).state.activeScene.choice,'b');
 await tap('#dialogue');assert.equal(await index(),at+2);
 // Photo presentation and closing it do not also consume its underlying dialogue line.
 const photo=through('arisha'),photoAt=SCRIPT.family_capture.indexOf('Game|Photograph taken.');photo.activeScene={id:'capture',index:photoAt,choice:null};await loadGame(session,photo);
 await run('for(let n=0;n<60;n++)questDebug.world.tick(.05)');await until('document.querySelector("#modal").open');await unchanged(()=>tap('#world'));await tap('#closeModal');await until('!document.querySelector("#continueHint").hidden');assert.equal(await index(),photoAt);
 assert.deepEqual(errors,[]);assert.deepEqual(failedRequests,[]);console.log('PASS explicit choices, no same-click branch skipping, and photo-modal protection; no browser errors');
}finally{await session.close();}


