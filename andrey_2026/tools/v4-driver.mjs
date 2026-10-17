import {DECISIONS} from '../js/script.js';
import {sceneSteps} from '../js/quest.js';
import {pause} from './browser-session.mjs';
export async function loadGame(session,state,width=1280,height=900){
 const {call,run,until}=session;await call('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<951});
 const seed=await call('Page.addScriptToEvaluateOnNewDocument',{source:`localStorage.setItem('freakybat-birthday-v1',${JSON.stringify(JSON.stringify(state))})`});
 await call('Page.navigate',{url:'http://127.0.0.1:8000/birthday/'});await until('!!window.questDebug','v4 game startup');
 await call('Page.removeScriptToEvaluateOnNewDocument',{identifier:seed.identifier});await call('Runtime.evaluate',{expression:`document.querySelector('#start').click()`,userGesture:true});
}
export const inspect=session=>session.run(`(()=>({state:questDebug.state,busy:questDebug.busy||!!questDebug.world.sequence||!!questDebug.world.walk.length,modal:document.querySelector('#modal').open,letter:!!document.querySelector('#modal[open] .letter'),canContinue:!document.querySelector('#continueHint').hidden,text:document.querySelector('.speaker-text')?.textContent??document.querySelector('.scene-caption')?.textContent??'',speaker:document.querySelector('.speaker-name')?.textContent??'',buttons:[...document.querySelectorAll('#actions button')].map(n=>({label:n.textContent,primary:n.classList.contains('primary')}))}))()`);
export function createDriver(session,{choiceIndex=0,cameraFirst=false,arishaFirst=false,pace=false,onPage=null}={}){
 const trace=[],seen=new Set();let clicks=0,readingSeconds=0;
 const click=label=>session.run(`(()=>{const b=[...document.querySelectorAll('#actions button')].find(b=>b.textContent===${JSON.stringify(label)});if(!b)throw Error('Missing action: '+${JSON.stringify(label)});b.click();})()`);
 async function step(){
  const p=await inspect(session);if(p.modal){if(p.letter){if(pace)await pause(40000);await session.run('document.querySelector("#closeModal").click()');}else{if(pace)await pause(2500);await session.run('document.querySelector("#closeModal").click()');}await pause(25);return p;}
  if(p.busy){if(!pace)await session.run('for(let i=0;i<240;i++)questDebug.world.tick(.05)');await pause(pace?100:20);return p;}
  if(p.state.letterRead&&!p.state.activeScene)return p;
  const scene=p.state.activeScene;
  if(scene){const key=scene.id+':'+scene.index+':'+scene.choice;if(!seen.has(key)){seen.add(key);trace.push({scene:scene.id,index:scene.index,text:p.text,speaker:p.speaker,choice:scene.choice});if(onPage)await onPage(p);if(pace){const seconds=Math.max(.9,p.text.split(/\s+/).length/180*60+.35);readingSeconds+=seconds;await pause(seconds*1000);}}
   const node=sceneSteps(scene.id,p.state,scene.choice)[scene.index];if(node&&typeof node==='object'){await click(DECISIONS[node.decision][choiceIndex].label);clicks++;return p;}
  }
  if(p.canContinue){await session.run(`document.querySelector('#dialogue').click()`);clicks++;await pause(pace?30:10);return p;}
  let action;
  if(!action&&cameraFirst&&!p.state.cameraOwned)action=p.buttons.find(b=>b.label==='Collect the camera first');
  if(!action&&arishaFirst&&p.state.anyaTalked&&!p.state.arishaTalked)action=p.buttons.find(b=>b.label==='Speak to Arisha first');
  action??=p.buttons.find(b=>b.primary)??p.buttons[0];if(!action)throw Error('No usable action at '+JSON.stringify(p));
  if(pace&&!scene)await pause(900);await click(action.label);clicks++;await pause(pace?30:10);return p;
 }
 async function drive(stop=(p)=>p.state.letterRead&&!p.state.activeScene,max=1800){for(let i=0;i<max;i++){const p=await inspect(session);if(stop(p))return p;await step();}throw Error('Walkthrough did not reach requested boundary');}
 return {step,drive,trace,get clicks(){return clicks;},get readingSeconds(){return readingSeconds;}};
}

