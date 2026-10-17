import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {through} from '../tests/helpers.js';
import {browserSession,pause} from './browser-session.mjs';
import {loadGame} from './v4-driver.mjs';
const session=await browserSession(9344),{run,call,until,errors,failedRequests}=session;mkdirSync('test-results',{recursive:true});
try{
 await loadGame(session,through('letter'));
 const result=await run(`(()=>{const w=questDebug.world,hat=w.playerHat.visible,head=w.actors.Anya.userData.head.rotation.x;w.playerHat.visible=false;const before=w.photo('family');w.playerHat.visible=true;w.actors.Anya.userData.head.rotation.x=.4;const after=w.photo('family');w.playerHat.visible=hat;w.actors.Anya.userData.head.rotation.x=head;w.tick(0);const start=w.renderer.info.memory.geometries;for(let i=0;i<10;i++)w.photo('family');w.tick(0);return{identical:before===after,start,end:w.renderer.info.memory.geometries,calls:w.renderer.info.render.calls};})()`);
 assert.equal(result.identical,true);assert.equal(result.start,result.end);
 for(const id of ['bank','house','park','photo','tower']){
  await run(`questDebug.world.focusOn('${id}');questDebug.world.focus.copy(questDebug.world.desiredFocus);questDebug.world.tick(.05)`);await pause(100);const image=await call('Page.captureScreenshot',{format:'png'});writeFileSync('test-results/v4-world-'+id+'.png',Buffer.from(image.data,'base64'));
 }
 await call('Emulation.setDeviceMetricsOverride',{width:1280,height:1600,deviceScaleFactor:1,mobile:false});await call('Page.navigate',{url:'http://127.0.0.1:8000/birthday/assets/portraits/'});await until('document.images.length===14&&[...document.images].every(i=>i.complete&&i.naturalWidth>0)');const gallery=await call('Page.captureScreenshot',{format:'png'});writeFileSync('test-results/v4-portrait-library.png',Buffer.from(gallery.data,'base64'));
 assert.deepEqual(errors,[]);assert.deepEqual(failedRequests,[]);writeFileSync('test-results/v4-art-check.json',JSON.stringify(result,null,2));console.log('PASS unchanged evidence artwork, ten renders with stable GPU geometry, five district views and 14 gallery assets.',result);
}finally{await session.close();}

