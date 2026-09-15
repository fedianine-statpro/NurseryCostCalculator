import {reducer,permitted,readSave,writeSave,TEST_SAVE_KEY,SAVE_KEY,initialState} from './state.js';
import {Story} from './story.js';
import {bridgeFixture} from './dev-fixture.js';
import {Renderer,ImageLoader,prygPosition} from './render.js';
import {setupInput} from './input.js';
import {Dialogue} from './dialogue.js';
import {GameAudio} from './audio.js';

const $=id=>document.getElementById(id);
const game=$('game'),canvas=$('scene');
function fit() {
  const available=Math.min(innerWidth/640,innerHeight/400);
  const scale=available;
  game.style.width=`${640*scale}px`;game.style.height=`${400*scale}px`;
}
addEventListener('resize',fit);fit();
const testMode=new URLSearchParams(location.search).get('test')==='bridge';
const saveKey=testMode?TEST_SAVE_KEY:SAVE_KEY;
const fresh=settings=>{const s=testMode?bridgeFixture(settings):initialState();if(settings)s.settings={...s.settings,...settings};return s;};
let state=null,loadedSave=null,storage,renderer,dialogue,audio,scene,allScenes,story;
let started=false,looking=false,selectedItem=null,last=0,elapsed=0,walk=null,action=null;
let imageLoader,loadingScene=false;
const visual={position:null,walking:false,direction:'right',action:null,speaker:null};
try{storage=window.localStorage;}catch{storage={getItem(){throw Error('Storage unavailable');},setItem(){throw Error('Storage unavailable');}};}

function persist() {if(!writeSave(storage,state,saveKey))$('storage-status').textContent='Сохранение недоступно — можно продолжать играть.';else $('storage-status').textContent='';}
function commit(event) {state=reducer(state,event);persist();updateInventory();$('hover-label').textContent=status();}
function updateInventory(){for(const item of ['rod','bell','ladle'])$(`inventory-${item}`).hidden=!state.inventory.includes(item);}
function status() {
  if(!state)return '';
  if(selectedItem)return `${{rod:'Удочка',bell:'Колокол',ladle:'Половник'}[selectedItem]}: выберите, к чему применить`;
  const f=state.flags;
  if(f.finaleStarted)return f.finaleComplete?'С днём рождения, Наталья!':'Вся семья за одним столом';
  if(state.scene!=='gate')return scene.name;
  if(!f.keyReturned)return f.rangerRescued?'Лесничий вернулся с ключом':'До озера можно дойти по лесной тропе';
  if(f.prygDeparted)return 'Прыг уже на другом берегу';
  if(f.bridgeOpen)return 'Пора попрощаться с Прыгом';
  if(f.signed)return 'Покажите смотрителю отпечаток';
  if(f.prygInked)return 'Теперь — на чистую страницу';
  if(f.bookDown&&f.padDown)return 'Всё готово для двух прыжков';
  if(permitted(state))return 'Книгу и подушку — поближе к Прыгу';
  return 'Поговорите со смотрителем';
}
function busy() {return !started||loadingScene||action||dialogue?.active||!$('settings').hidden||!$('start').hidden||!$('finish').hidden;}
function cancelWalk() {if(walk){walk.resolve(false);walk=null;}visual.walking=false;}
function walkTo(x,y) {
  cancelWalk();const b=scene.walkBounds;x=Math.max(b[0],Math.min(b[2],x));y=Math.max(b[1],Math.min(b[3],y));
  if(state.scene==='home'&&x<315)y=Math.max(y,282);
  return new Promise(resolve=>{const route=state.scene==='home'&&x<315&&visual.position.x>=315?[{x:330,y:292},{x,y}]:[{x,y}];walk={...route.shift(),route,resolve};visual.walking=true;});
}
async function approach(id) {return walkTo(...({keeper:[498,245],ranger:[547,255],book:[497,254],pad:[490,253],gate:[425,245],pryg:[350,260]}[id]||[477,255]));}
function animate(type,duration,onComplete) {
  if(action)return;
  cancelWalk();$('context').hidden=true;
  const destination=({retrieve_bell:[322,247],kick_box:[273,304],take_ladle:[245,292],hang_bell:[188,251],signal:[188,251],rescue:[365,274]})[type];
  action={type,duration,elapsed:0,progress:0,from:state.scene==='gate'?[...prygPosition(state,scene)]:[0,0],destination,onComplete};
  visual.action=action;$('skip').hidden=false;
  if(type==='open_gate')audio.sfx('open');else if(type.startsWith('jump')||type==='depart'||type==='wrong_book')audio.sfx('jump');
}
function talk(block,onComplete,options) {$('context').hidden=true;dialogue.show(block,onComplete,options);}
function permission() {if(!state.flags.keyReturned){story.keeper();return;}if(!permitted(state))talk('signature',()=>commit({type:'permission'}));else talk('signature_hint');}
function signedSequence() {
  if(state.flags.bridgeOpen){farewell();return;}
  const open=()=>animate('open_gate',.7,()=>{commit({type:'open_gate'});farewell();});
  if(state.seenBlocks.includes('gate/signed'))open();
  else talk('signed',()=>{commit({type:'signed_dialogue'});open();});
}
function farewell() {if(state.flags.prygDeparted){if(!testMode)beginFinale();return;}talk('farewell',()=>animate('depart',3.5,()=>{commit({type:'depart'});if(testMode)finishScreen();else beginFinale();}));}
function inspect(id) {if(!state.flags.keyReturned&&['pad','keeper','ranger'].includes(id)){story.keeper();return;}talk(({river:'river',desk:'desk',mug:'mug',book:state.flags.signed?'print':'desk',pad:'signature_hint',keeper:'signature_hint',ranger:'signature_hint',pryg:'pryg',friends:'pryg',gate:state.flags.keyReturned?'river':'gate_locked',path:'gate_hint'})[id]||'pryg');}
async function lower(id) {
  if(busy())return;
  if(state.flags.signed){inspect('book');return;}
  if(!permitted(state)){if(await approach('keeper'))permission();return;}
  if(state.flags[id==='book'?'bookDown':'padDown'])return;
  if(await approach(id))animate(id==='book'?'lower_book':'lower_pad',.65,()=>commit({type:id==='book'?'lower_book':'lower_pad'}));
}
function jump(target) {
  if(busy())return;
  if(state.flags.signed){signedSequence();return;}
  if(!permitted(state)){permission();return;}
  if(!state.flags.bookDown||!state.flags.padDown){talk('signature_hint');return;}
  if(target==='pad') {
    if(state.flags.prygInked){talk('signature_hint');return;}
    animate('jump_pad',.65,()=>commit({type:'jump_pad'}));
  }else if(!state.flags.prygInked) {
    animate('wrong_book',.65,()=>talk('signature_hint'));
  }else animate('jump_book',.65,()=>{commit({type:'jump_book'});signedSequence();});
}
function showContext(z,p) {
  cancelWalk();const el=$('context');el.replaceChildren();
  const title=document.createElement('strong');title.textContent=z.label;el.append(title);
  const options=[['Осмотреть',()=>inspect(z.id)]];
  if(z.id==='book'&&!state.flags.signed) options.push([state.flags.bookDown?'Прыгнуть в книгу':'Положить книгу на землю',()=>state.flags.bookDown?jump('book'):lower('book')]);
  if(z.id==='book'&&state.flags.signed&&!state.flags.bridgeOpen)options.push(['Показать отпечаток',signedSequence]);
  if(z.id==='pad'&&!state.flags.signed) options.push([state.flags.padDown?'Прыгнуть на подушку':'Положить подушку на землю',()=>state.flags.padDown?jump('pad'):lower('pad')]);
  if(z.id==='pryg') {options.push(['Поднять Прыга',()=>talk('lift_pryg')]);if(state.flags.bridgeOpen)options.push(['Попрощаться',farewell]);else if(state.flags.signed)options.push(['Показать отпечаток',signedSequence]);else options.push(['Прыгнуть на подушку',()=>jump('pad')],['Прыгнуть в книгу',()=>jump('book')]);}
  if(z.id==='gate'&&!state.flags.bridgeOpen)options.push(['Открыть калитку',()=>state.flags.signed?signedSequence():permission()]);
  for(const [label,fn] of options){const button=document.createElement('button');button.textContent=label;button.onclick=()=>{el.hidden=true;fn();};el.append(button);}
  el.hidden=false;const r=game.getBoundingClientRect();el.style.left=`${Math.max(8,Math.min(p.x*r.width/640,r.width-el.offsetWidth-8))}px`;el.style.top=`${Math.max(r.height*.07,Math.min((p.y+24)*r.height/400,r.height*.86-el.offsetHeight))}px`;el.querySelector('button').focus();
}
async function click(z,p) {
  if(action?.type==='dance'){action.elapsed=action.duration;return;}
  if(busy())return;
  $('context').hidden=true;
  if(state.flags.finaleStarted){story.finale();return;}
  if(!z){cancelLook();await walkTo(p.x,p.y);return;}
  if(selectedItem){const item=selectedItem;cancelWalk();cancelLook();story.apply(item,z);return;}
  if(z.id==='path'&&!testMode&&!looking){travel();return;}
  if(state.scene!=='gate'){cancelWalk();if(z.cursor==='speech'&&!looking){const r=z.rect;if(!await walkTo(r[0]+r[2]/2,r[1]+r[3]+10))return;}story.click(z,p,looking);return;}
  if(looking){cancelWalk();inspect(z.id);return;}
  if(z.id==='keeper'){if(await approach(z.id))story.keeper();}
  else if(z.id==='ranger'){if(await approach(z.id))talk('signature_hint');}
  else if(['book','pad','pryg','gate'].includes(z.id))showContext(z,p);
  else{cancelWalk();inspect(z.id);}
}
function cancelLook(){looking=false;selectedItem=null;$('look').setAttribute('aria-pressed','false');for(const item of ['rod','bell','ladle'])$(`inventory-${item}`).setAttribute('aria-pressed','false');}
function settingsUI() {for(const k of ['voice','music','sfx'])$(`${k}-volume`).value=state.settings[k];$('muted').checked=state.settings.muted;$('reduced-motion').checked=state.settings.reducedMotion;updateSoundLabel();}
function updateSoundLabel() {$('sound').textContent=state?.settings.muted?'Звук: выкл.':'Звук: вкл.';$('sound').setAttribute('aria-label',state?.settings.muted?'Включить звук':'Выключить звук');}
function changeSettings(value) {commit({type:'settings',value});audio.update(state.settings);settingsUI();}
async function startGame(s) {
  if(loadingScene)return;if(!imageLoader.ready(s.scene,s.flags.finaleStarted)){loadingScene=true;await imageLoader.ensure(s.scene,s.flags.finaleStarted);loadingScene=false;}
  cancelWalk();dialogue.close();state=s;started=true;loadedSave=s;visual.position={...state.position};visual.action=null;action=null;
  setScene();$('skip').hidden=true;$('start').hidden=true;$('finish').hidden=true;$('context').hidden=true;cancelLook();settingsUI();persist();updateInventory();audio.update(state.settings);await audio.unlock();
  if(testMode&&state.flags.prygDeparted)finishScreen();
  else if(state.flags.prygDeparted&&!testMode)beginFinale();
  else if(state.scene==='gate'&&state.flags.signed)signedSequence();
  else if(!testMode)story.entered();
}
function newGame() {
  if((started||loadedSave)&&!confirm('Начать заново? Текущее сохранение будет заменено.'))return;
  const settings=state?.settings||loadedSave?.settings||initialState().settings;
  startGame(fresh({...settings,muted:$('start').hidden?settings.muted:$('start-muted').checked}));
}
function frame(now) {
  const dt=Math.min(.05,(now-last)/1000||0);last=now;
  if(!document.hidden){elapsed+=dt;
    if(started&&walk) {
      const p=visual.position,dx=walk.x-p.x,dy=walk.y-p.y,distance=Math.hypot(dx,dy),step=state.settings.reducedMotion?distance:180*dt;
      visual.direction=Math.abs(dx)>Math.abs(dy)?dx<0?'left':'right':dy<0?'up':'down';
      if(distance<=step||distance<.5){p.x=walk.x;p.y=walk.y;if(walk.route.length)Object.assign(walk,walk.route.shift());else{const done=walk.resolve;walk=null;visual.walking=false;commit({type:'position',...p});done(true);}}else{p.x+=dx/distance*step;p.y+=dy/distance*step;}
    }
    if(action){
      const dest=action.destination,pos=visual.position,dx=dest?dest[0]-pos.x:0,dy=dest?dest[1]-pos.y:0,distance=Math.hypot(dx,dy);
      const skip=state.settings.reducedMotion||action.elapsed>=action.duration;
      if(dest&&distance>1&&!skip){const step=Math.min(distance,180*dt);pos.x+=dx/distance*step;pos.y+=dy/distance*step;visual.walking=true;visual.direction=dx<0?'left':'right';}
      else {
        if(dest){pos.x=dest[0];pos.y=dest[1];action.destination=null;commit({type:'position',...pos});}
        visual.walking=false;
        if(!action.started){action.started=true;if(action.type==='signal')audio.signal();}
        action.elapsed+=dt;action.progress=state.settings.reducedMotion?1:Math.min(1,action.elapsed/action.duration);
        if(action.progress===1){const done=action.onComplete;action=null;visual.action=null;$('skip').hidden=true;done();}
      }
    }
  }
  renderer.draw(state||fresh(),visual,elapsed);requestAnimationFrame(frame);
}

function actionMenu(title,options,p={x:285,y:160}) {
  cancelWalk();const el=$('context');el.replaceChildren();const heading=document.createElement('strong');heading.textContent=title;el.append(heading);
  for(const [label,fn] of options){const b=document.createElement('button');b.textContent=label;b.onclick=()=>{if(busy())return;el.hidden=true;fn();};el.append(b);}
  el.hidden=false;const r=game.getBoundingClientRect();el.style.left=`${Math.max(8,Math.min(p.x*r.width/640,r.width-el.offsetWidth-8))}px`;el.style.top=`${Math.max(r.height*.07,Math.min((p.y+24)*r.height/400,r.height*.86-el.offsetHeight))}px`;el.querySelector('button')?.focus();
}
function setScene(){scene=allScenes[state.scene];renderer.scene=scene;visual.position={...state.position};audio?.setScene(state.flags.finaleStarted?'finale':state.scene);$('location-name').textContent=scene.name||'У подвесного моста';$('travel').hidden=testMode||state.flags.finaleStarted;}
function travel(){if(busy()||testMode||state.flags.finaleStarted)return;actionMenu('Лесная тропа',Object.entries({gate:'К мосту',camp:'В лагерь',shore:'На солнечную пристань',home:'К Линочке'}).filter(([id])=>id!==state.scene).map(([id,label])=>[label,async()=>{loadingScene=true;await imageLoader.ensure(id);loadingScene=false;cancelLook();commit({type:'scene',scene:id,position:allScenes[id].entry||{x:90,y:285}});setScene();story.entered();}]));}
async function beginFinale(){if(loadingScene)return;loadingScene=true;await imageLoader.ensure('home',true);loadingScene=false;if(!state.flags.finaleStarted)commit({type:'begin_finale'});setScene();story.finale();}
function finishScreen(greeting=false){
  $('finish').hidden=false;$('finish-title').textContent=testMode?'Каждому — свой берег':'С днём рождения, Наталья!';
  const line=dialogue.lines.find(l=>l.id==='finale_greeting_01');$('finish-text').textContent=testMode?'Прыг добрался до сородичей.':line.text;
  $('replay').textContent=testMode?'Повторить сцену':'Сыграть заново';$('stay').textContent=testMode?'Посмотреть на мост':'Остаться здесь';
  if(greeting){commit({type:'seen',block:'finale/greeting'});commit({type:'end_finale'});audio.playVoice(line.audio);}
  $('stay').focus();
}

async function init() {
  if(location.protocol==='file:')throw Error('Откройте игру через HTTP: python -m http.server 8000 --directory site');
  const [manifest,dialogs,speakers,scenes]=await Promise.all(['assets','dialogue','speakers','scenes'].map(async name=>{const r=await fetch(`./data/${name}.json`);if(!r.ok)throw Error(`Не удалось загрузить ${name}`);return r.json();}));
  const saved=readSave(storage,saveKey,{fixture:testMode});loadedSave=saved.state;
  allScenes=scenes;scene=scenes.gate;imageLoader=new ImageLoader(manifest);
  await imageLoader.ensure('gate');if(loadedSave)await imageLoader.ensure(loadedSave.scene,loadedSave.flags.finaleStarted);
  renderer=new Renderer(canvas,imageLoader.images,manifest,scene);
  if(saved.error)$('save-notice').textContent=saved.error==='invalid'?'Сохранение не удалось прочитать. Начать заново?':'Сохранение недоступно. Можно играть без него.';
  $('continue').hidden=!loadedSave;$('start-muted').checked=loadedSave?.settings.muted||false;
  audio=new GameAudio(loadedSave?.settings||initialState().settings,blocked=>{$('enable-audio').hidden=!blocked;});
  const voices=await fetch('./data/voices.json');audio.available=new Set(await voices.json());
  dialogue=new Dialogue(dialogs.lines,speakers,renderer,audio,(speaker,line)=>{visual.speaker=speaker;visual.line=line;});
  story=new Story({state:()=>state,commit,talk,animate,context:actionMenu,travel,lines:dialogs.lines,audio,gatePuzzle:()=>state.flags.signed?signedSequence():permission(),finish:finishScreen});
  setupInput(canvas,()=>state,()=>scene,{click,looking:()=>looking,hover:label=>{$('hover-label').textContent=label||status();}});
  $('start-heading').textContent=testMode?'Тест сцены':'Добро пожаловать';$('start-description').textContent=testMode?'Ключ уже вернулся. Осталось помочь одному маленькому посетителю перейти мост.':'Лесной городок, знакомые лица и маленькое приключение по дороге к семейному ужину.';
  $('start-new').disabled=false;$('start-new').textContent=loadedSave?'Заново':'Начать';$('start-new').onclick=newGame;
  $('continue').onclick=()=>startGame({...loadedSave,settings:{...loadedSave.settings,muted:$('start-muted').checked}});
  $('replay').onclick=newGame;$('stay').onclick=()=>{$('finish').hidden=true;audio.stopVoice();};$('travel').onclick=travel;
  $('look').onclick=()=>{if(busy())return;const next=!looking;cancelLook();looking=next;$('look').setAttribute('aria-pressed',String(looking));$('context').hidden=true;};
  for(const item of ['rod','bell','ladle'])$(`inventory-${item}`).onclick=()=>{if(busy())return;if(selectedItem&&selectedItem!==item){const selected=selectedItem;cancelLook();story.apply(selected,{id:`inventory-${item}`});return;}const next=selectedItem?null:item;cancelLook();selectedItem=next;$(`inventory-${item}`).setAttribute('aria-pressed',String(!!next));$('hover-label').textContent=status();$('context').hidden=true;};
  $('hint').onclick=()=>{if(!busy()){cancelWalk();story.hint();}};
  $('menu-open').onclick=()=>{if(action)return;cancelWalk();dialogue.close();$('context').hidden=true;loadedSave=state;$('continue').hidden=false;$('start-new').textContent='Заново';$('start-muted').checked=state.settings.muted;$('start').hidden=false;};
  $('sound').onclick=async()=>{if(!state){$('start-muted').checked=!$('start-muted').checked;return;}changeSettings({muted:!state.settings.muted});await audio.unlock();};
  $('settings-open').onclick=()=>{if(!state)return;cancelWalk();$('context').hidden=true;settingsUI();$('settings').hidden=false;$('settings-close').focus();};
  $('settings-close').onclick=()=>{$('settings').hidden=true;$('settings-open').focus();};
  for(const k of ['voice','music','sfx'])$(`${k}-volume`).oninput=e=>changeSettings({[k]:Number(e.target.value)});
  $('muted').onchange=async e=>{changeSettings({muted:e.target.checked});await audio.unlock();};
  $('reduced-motion').onchange=e=>changeSettings({reducedMotion:e.target.checked});
  $('skip').onclick=()=>{if(action)action.elapsed=action.duration;};
  $('enable-audio').onclick=()=>audio.unlock();
  $('toolbar').addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;cancelLook();$('context').hidden=true;});
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){e.preventDefault();if(!$('settings').hidden)$('settings-close').click();else if(!$('context').hidden)$('context').hidden=true;else if(dialogue.active)dialogue.close();else{cancelLook();cancelWalk();}}
    if(e.key==='Tab') {const modal=!$('settings').hidden?$('settings'):dialogue.active?$('dialogue'):!$('start').hidden?$('start'):!$('finish').hidden?$('finish'):null;if(!modal)return;const buttons=[...modal.querySelectorAll('button:not([hidden]):not(:disabled), input')];const first=buttons[0],last=buttons.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
  });
  document.addEventListener('visibilitychange',()=>audio.visibility(document.hidden));
  window.addEventListener('blur',()=>audio.visibility(true));window.addEventListener('focus',()=>{if(started&&!document.hidden)audio.visibility(false);});
  requestAnimationFrame(frame);
  if(window.requestIdleCallback)requestIdleCallback(()=>imageLoader.preload(),{timeout:1800});else setTimeout(()=>imageLoader.preload(),500);
}
init().catch(error=>{$('save-notice').textContent=error.message;$('start-new').textContent='Не удалось открыть игру';console.error(error);});
