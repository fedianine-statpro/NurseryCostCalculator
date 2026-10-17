import {mkdirSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {freshState} from '../js/state.js';
import {browserSession} from './browser-session.mjs';
import {createDriver,loadGame} from './v4-driver.mjs';
const session=await browserSession(9342);mkdirSync('test-results',{recursive:true});
try{
 await loadGame(session,freshState());let lastScene='';
 const start=Date.now(),driver=createDriver(session,{pace:true,onPage:async p=>{if(p.state.activeScene.id!==lastScene){lastScene=p.state.activeScene.id;console.log('Reading',lastScene,Math.round((Date.now()-start)/1000)+'s');}}});
 const final=await driver.drive(undefined,16000);assert.equal(final.state.letterRead,true);
 const result={seconds:(Date.now()-start)/1000,readingWordsPerMinute:180,readingSeconds:driver.readingSeconds,actions:driver.clicks,route:'Registration first; money cover story; Alisa first; first reply in each decision',movement:'Real-time; no simulation acceleration',letterReadingSeconds:40,scope:'Scripted reading and decision delays, not a first-time human usability measurement.'};
 writeFileSync('test-results/timing-v4.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
}finally{await session.close();}

