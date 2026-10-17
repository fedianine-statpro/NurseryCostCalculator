import {portraitURL,CharacterVoice} from './dialogue.js';
import {CONFIG,REWARD} from './config.js';
import {freshState,loadSave,saveGame,transition,objective,journalSteps,familyReady} from './state.js';
import {World,TARGETS} from './world.js';
import {AudioEngine} from './audio.js';
import {iconURL,classicURL} from './art.js';
import {DECISIONS,HINTS} from './script.js';
import {sceneDefinition,sceneSteps,PHOTO_NAME,PHOTO_DESCRIPTION,WITNESS} from './quest.js';
import {questTarget,targetAction,discoveryIds,regionAt} from './map-data.js';
import {VOICE_PROFILES} from './voice-plan.js';
const $=q=>document.querySelector(q);
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
let state=loadSave()??freshState(),world,busy=false,tab='inventory',toastUntil=0,modalReturn=null,voiceListCleanup=null,transient=[],transientIndex=0,inMemoryWarned=false,continuationReady=false;
const audio=new AudioEngine(state.settings),voice=new CharacterVoice();voice.onSpeaking=active=>audio.duck(active);
function toast(text){$('#toast').textContent=text;$('#toast').style.display='block';toastUntil=performance.now()+3800;}
function persist(){if(world){state.playerPosition={x:world.player.position.x,z:world.player.position.z};state.facing=world.player.rotation.y;}if(!saveGame(state)&&!inMemoryWarned){inMemoryWarned=true;toast('Saving is unavailable. You can still finish this session.');}}
function commit(event,value){if(world){state.playerPosition={x:world.player.position.x,z:world.player.position.z};state.facing=world.player.rotation.y;}state=transition(state,event,value);world?.sync(state);persist();renderSide();renderObjective();}
function settingsApply(){voice.enabled=!!state.settings.voices;voice.muted=state.settings.muted;voice.volume=state.settings.voiceVolume;voice.choices=state.settings.voiceChoices;if(!voice.enabled||voice.muted)voice.stop();document.body.classList.toggle('large',state.settings.largeText);audio.settings=state.settings;audio.apply();if(world)world.reduced=state.settings.reducedMotion;$('#muteButton').textContent=state.settings.muted?'Sound: off':'Sound: on';}
function button(label,fn,primary=false){const n=el('button',label,primary?'primary':undefined);n.onclick=()=>{if(busy){toast('Let the scene finish.');return;}fn();};return n;}
function actions(items){continuationReady=false;$('#continueHint').hidden=true;$('#client').classList.remove('dialogue-ready');if(world){world.dialogueActive=!!(state.activeScene||transient.length);world.dialogueReady=false;}$('#chat').classList.toggle('choices',items.length>2);$('#actions').replaceChildren(...items.map(([label,fn,primary])=>button(label,fn,primary)));}
function caption(text){voice.stop();world?.setSpeaker(null);$('#chat').classList.add('compact');$('#dialogue').replaceChildren(el('p',text,'scene-caption'));}
function say(raw){
 voice.stop();const split=raw.indexOf('|'),speaker=split<0?'Game':raw.slice(0,split),text=(split<0?raw:raw.slice(split+1)).replaceAll('{handle}',state.handle);
 if(speaker==='Game'){caption(text);return;}
 const name=speaker==='Andrey'?state.handle:speaker==='Robot'?'Photographer':speaker;
 $('#chat').classList.remove('compact');world?.setSpeaker(speaker);
 const img=el('img',undefined,'speaker-portrait');img.src=portraitURL(speaker);img.alt=name+' portrait';img.onerror=()=>{img.onerror=null;img.src=portraitURL(speaker,true);};
 const copy=el('div',undefined,'speaker-copy');copy.append(el('div',name,'speaker-name'),el('p',text,'speaker-text'));
 $('#dialogue').replaceChildren(img,copy);voice.speak(speaker,text);
}
function startScene(id){world.stop();world.stand();transient=[];state.activeScene={id,index:0,choice:null};persist();renderScene();}
async function renderScene(){
 const scene=state.activeScene;if(!scene)return menu();
 const steps=sceneSteps(scene.id,state,scene.choice),line=steps[scene.index];
 if(line===undefined){const def=sceneDefinition(scene.id,state);state.activeScene=null;commit(def.event,def.event==='optional'?scene.id:undefined);if(def.next){startScene(def.next);return;}if(state.reunionDone){completion();return;}menu();return;}
 if(typeof line==='object'){
  caption('Choose your reply.');const options=DECISIONS[line.decision];
  actions(options.map(c=>[c.label,()=>{scene.choice=c.id;state.choices[line.decision]=c.id;if(line.decision==='cover_story')commit('cover',c.id);state.activeScene.choice=c.id;state.activeScene.index++;persist();renderScene();}]));return;
 }
 try{
  if(scene.id==='camera'&&line==='Game|You receive your camera.')commit('camera');
  if(scene.id==='claim'&&line==='Game|You receive a partyhat.'){commit('hat');audio.effect('paper');toast(REWARD.name+' added to your inventory. Take it back to the family.');}
  if(scene.id==='reunion'&&line==='Alisa|There.'&&!state.hatEquipped){commit('equip');audio.effect('fanfare');world.celebrate();}
  if(line==='Game|Photograph taken.'&&scene.effectAt!==scene.index){
   busy=true;caption('Photograph taken.');actions([]);document.body.classList.add('animating');await world.animate('family',.8);audio.effect('shutter');document.body.classList.remove('animating');
   await new Promise(resolve=>showPhoto(false,resolve));state.activeScene.effectAt=scene.index;persist();busy=false;
  }
  if(scene.id==='capture'&&line==='Game|You receive: Freakybat, Captured.')commit('photo');
  if(scene.id==='reunion'&&line.startsWith('Game|Quest complete:'))commit('reunion');
  say(line);offerContinue();
 }catch(error){busy=false;document.body.classList.remove('animating');console.error(error);caption('The scene paused. Your progress is saved.');actions([['Continue conversation',renderScene,true]]);}
}
function offerContinue(){actions([]);continuationReady=true;$('#continueHint').hidden=false;$('#client').classList.add('dialogue-ready');world.dialogueReady=true;world.canvas.style.cursor='pointer';}
function advance(){if(busy||$('#modal').open||$('#welcome').open)return;if(state.activeScene){const s=state.activeScene,node=sceneSteps(s.id,state,s.choice)[s.index];if(node&&typeof node==='object'){document.querySelector('#actions button')?.focus();return;}if(!continuationReady)return;state.activeScene.index++;persist();renderScene();}else if(transient.length&&continuationReady){transientIndex++;showHint();}}
function hint(lines){world.stop();world.stand();transient=Array.isArray(lines)?lines:[lines];transientIndex=0;showHint();}
function showHint(){if(transientIndex>=transient.length){transient=[];menu();return;}say(transient[transientIndex]);offerContinue();}
function renderObjective(){if(!world)return;world.markTarget(questTarget(state));$('#objective').textContent=objective(state);$('#playerName').textContent=state.handle;}
function closePanel(){document.body.classList.remove('panel-open');document.querySelectorAll('[data-panel]').forEach(n=>{n.classList.remove('active');n.setAttribute('aria-expanded','false');});}
function openPanel(name){tab=name;renderSide();document.body.classList.add('panel-open');document.querySelectorAll('[data-panel]').forEach(n=>{n.classList.toggle('active',n.dataset.panel===name);n.setAttribute('aria-expanded',String(n.dataset.panel===name));});}
function near(id,fn){closePanel();world.stand();transient=[];world.stop();caption('Walking to '+TARGETS[id].name+'…');actions([['Cancel walk',()=>{world.stop();menu();}]]);if(world.approach(id,()=>{persist();fn();})===false)menu();}
function menu(){
 if(busy||state.activeScene)return;if(state.cameraOwned&&!state.alexTalked){startScene('alex');return;}voice.stop();world.setSpeaker(null);transient=[];renderObjective();renderSide();
 if(state.reunionDone){completion();return;}
 caption(objective(state));const id=questTarget(state),choices=[[targetAction(id,state),()=>near(id,()=>interact(id)),true]];
 if(state.bountyStarted&&!state.raidJoined&&!state.cameraOwned)choices.push(['Collect the camera first',()=>near('house',()=>interact('house'))]);
 if(state.anyaTalked&&!state.alisaTalked&&!state.arishaTalked)choices.push(['Speak to Arisha first',()=>near('arisha',()=>interact('arisha'))]);
 actions(choices);
}
function familyInteraction(id){
 if(state.hatClaimed&&!state.reunionDone)return startScene('reunion');
 if(state.reunionDone)return hint(HINTS.birthday);
 if(!state.cameraOwned)return hint(HINTS.familyCamera);
 if(!state.alexTalked)return startScene('alex');
 if(!state.raidJoined)return hint(HINTS.familyRegister);
 if(state.photoTaken)return hint(HINTS.bank);
 if(!state.anyaTalked)return id==='photo'?startScene('anya'):hint(HINTS.anyaFirst);
 if(id==='alisa'&&!state.alisaTalked)return startScene('alisa');
 if(id==='arisha'&&!state.arishaTalked)return startScene('arisha');
 if(familyReady(state))return startScene('capture');
 return hint(!state.alisaTalked&&!state.arishaTalked?HINTS.girls:!state.alisaTalked?HINTS.alisa:HINTS.arisha);
}
function interact(id){
 if(!state.bountyStarted&&id!=='bank')return hint(HINTS.opening);
 if(id==='bank')return !state.bountyStarted?startScene('bounty'):state.photoTaken&&!state.hatClaimed?startScene('claim'):hint(state.hatClaimed?HINTS.claimed:HINTS.proof);
 if(id==='house'){if(!state.cameraOwned)return startScene('camera');if(!state.alexTalked)return startScene('alex');if(state.letterRead&&!state.seenOptional.includes('after_party'))return startScene('after_party');return hint(!state.raidJoined?HINTS.register:state.reunionDone?'Danya|Happy birthday, Andrey.':HINTS.shore);}
 if(id==='alex')return state.cameraOwned&&!state.alexTalked?startScene('alex'):hint('Alex|'+objective(state));
 if(id==='park'){if(!state.raidJoined)return startScene('raid');if(state.hatClaimed)return hint(HINTS.keeperDone);if(!state.photoTaken&&!state.seenOptional.includes('meditation'))return startScene('meditation');return hint(!state.cameraOwned?HINTS.keeperCamera:HINTS.keeperShore);}
 if(['photo','alisa','arisha'].includes(id))return familyInteraction(id);
 if(id==='football')return !state.seenOptional.includes('football')?startScene('football'):toast('A grass pitch, a well-used ball, and two carefully marked goalposts.');
 if(id==='picnic'){if(state.hatClaimed&&!state.reunionDone)return startScene('reunion');if(state.reunionDone)return completion();return toast('A birthday table laid for the whole family. There will be time to sit together.');}
 if(id==='bench'){world.sit();caption('The lake, the wind in the reeds, and a moment to sit.');actions([['Get up',()=>{world.stand();menu();},true]]);return;}
 if(TARGETS[id].discovery){commit('discover',id);busy=true;actions([]);caption(discoveryNotes[id]);world.animate('discover-'+id,1.5).then(()=>{busy=false;caption(discoveryNotes[id]);actions([['Continue exploring',menu,true]]);});return;}
 toast(({fries:'Centerpoint Fries. Hot food, wooden tables, and room for old friends.',sign:'Santee · Base camp. Home with Anya, Alisa, and Arisha.',moped:'Mykonos. Anya and Andrey shared a moped; the rest of us had our own.',penguin:'South Africa. Yes, the penguins belong there.'})[id]??objective(state));
}
function target(id,secondary=false){if(busy||state.activeScene||transient.length){toast('Continue the conversation below first.');return;}if(secondary){caption(TARGETS[id].name);actions([[targetAction(id,state),()=>near(id,()=>interact(id)),true],['Back to quest',menu]]);}else near(id,()=>interact(id));}
const discoveryNotes={oak:'An old oak, with enough shade for everyone.',well:'Clear water. A very long way down.',harbor:'A little boat rocks against the landing.',tower:'The lake opens out beyond the village.',garden:'Beans, carrots, and someone’s carefully tended lunch.',stones:'Seven old stones in a quiet clearing.',cove:'Reeds move in the breeze. Nothing needs doing here.',lookout:'The village is still there, across the water.'};
function modal(content,onClose=null){voice.stop();modalReturn=onClose;$('#modalContent').replaceChildren(content);if(!$('#modal').open)$('#modal').showModal();}
function closeModal(){voice.stop();voiceListCleanup?.();voiceListCleanup=null;$('#modal').close();const done=modalReturn;modalReturn=null;audio.mode='village';if(done)done();else if(!busy&&!state.activeScene&&!transient.length&&state.started)menu();}
function letter(){if(!state.reunionDone)return;world.stop();audio.mode='letter';const wrap=el('div'),paper=el('article',undefined,'letter');paper.setAttribute('aria-label','Victor’s birthday letter');CONFIG.letter.forEach((text,i)=>paper.append(el(i===0?'h2':'p',text)));wrap.append(paper);
 if(state.settings.voices)wrap.append(button('Listen to Victor’s message',()=>{if(state.settings.muted){toast('Turn sound on to hear the message.');return;}voice.speak('Victor',CONFIG.letter.join(' '));}));
 const back=el('button','Back to the family','primary');back.onclick=closeModal;wrap.append(back);modal(wrap,()=>{commit('letter');completion();});
}
function showPhoto(download=true,onClose=null){const wrap=el('div');wrap.append(el('h2',PHOTO_NAME));const img=el('img',undefined,'photo');img.src=world.photo('family');img.alt='Andrey with Anya, Alisa, and Arisha at the lakeshore.';wrap.append(img,el('p',PHOTO_DESCRIPTION,'photo-caption'));if(state.witnessRecorded)wrap.append(el('p',WITNESS,'witness-statement'));const controls=el('div',undefined,'modal-actions'),back=el('button','Back','primary');back.onclick=closeModal;controls.append(back);if(download){const a=el('a','Save our photo');a.href=img.src;a.download='freakybat-captured.png';controls.append(a);}wrap.append(controls);modal(wrap,onClose);}
function completion(){caption('');const card=el('div',undefined,'completion'),img=el('img',undefined,'reward-icon');img.src=iconURL(CONFIG.reward);img.alt=REWARD.name;card.append(el('h2','Quest complete'),img,el('p','Please Stop Farming Me'),el('p','1 partyhat · 1 quest point · No further favours accepted.'));$('#dialogue').replaceChildren(card);actions([['Victor’s birthday message',letter,!state.letterRead],['Our photograph',()=>showPhoto(true)],['Explore the village',()=>{caption('Happy birthday, Freakybat.');actions([['Back to the party',completion,true]]);openPanel('targets');}],['Play again',replay]]);}
function replay(){const wrap=el('div');wrap.append(el('h2','Another birthday expedition?'),el('p','This restarts the story. Sound, voice, and text preferences stay.'));const controls=el('div',undefined,'modal-actions');controls.append(button('Keep this party',closeModal),button('Start again',()=>{world.stop();state=freshState(state.settings,state.handle);saveGame(state);location.reload();}));wrap.append(controls);modal(wrap);}
function settings(){
 const wrap=el('div');wrap.append(el('h2','Settings'));
 for(const [label,type,key]of [['Sound enabled','checkbox','muted'],['Music','range','music'],['Effects & ambience','range','effects'],['Voice volume','range','voiceVolume'],['Character voices','checkbox','voices'],['Larger text','checkbox','largeText'],['Reduced motion','checkbox','reducedMotion']]){
  const row=el('label',undefined,'setting');row.append(el('span',label));const input=el('input');input.type=type;
  if(type==='range'){input.min=0;input.max=1;input.step=.05;input.value=state.settings[key];}else input.checked=key==='muted'?!state.settings.muted:state.settings[key];
  input.setAttribute('aria-label',label);input.addEventListener('input',()=>{state.settings[key]=type==='range'?Number(input.value):key==='muted'?!input.checked:input.checked;audio.start();settingsApply();persist();});row.append(input);wrap.append(row);
 }
 wrap.append(el('p','Text remains visible with sound off.','side-note'));
 const details=el('details'),summary=el('summary','Choose character voices');details.append(summary);const list=el('div');details.append(list);wrap.append(details);
 const refresh=()=>{const available=voice.available();list.replaceChildren(el('p',available.length?available.length+' English voices available on this device.':'This device uses its default voice. Pitch and pace still vary by character.','side-note'));for(const name of Object.keys(VOICE_PROFILES).filter(n=>!['Rock','Narrator','Vendor'].includes(n))){
  const row=el('div',undefined,'voice-setting'),select=el('select');select.setAttribute('aria-label',name+' voice');const automatic=el('option','Automatic');automatic.value='';select.append(automatic);for(const v of available){const option=el('option',v.name+' · '+v.lang);option.value=v.voiceURI;select.append(option);}select.value=state.settings.voiceChoices?.[name]??'';
  select.onchange=()=>{state.settings.voiceChoices??={};state.settings.voiceChoices[name]=select.value;settingsApply();persist();};
  const preview=el('button','Play');preview.setAttribute('aria-label','Preview '+name+' voice');preview.onclick=()=>{state.settings.muted=false;state.settings.voices=true;audio.start();settingsApply();persist();voice.speak(name,'Happy birthday, Andrey.');};row.append(el('span',name==='Robot'?'Robot':name),select,preview);list.append(row);
 }};refresh();globalThis.speechSynthesis?.addEventListener('voiceschanged',refresh);voiceListCleanup?.();voiceListCleanup=()=>globalThis.speechSynthesis?.removeEventListener('voiceschanged',refresh);
 wrap.append(el('p','Camera: drag to rotate; scroll or pinch to zoom. Q/E rotate, +/− zoom, C centres.','side-note'));if(state.started)wrap.append(button('Play again',replay));modal(wrap);
}
function inventory(){const items=[];if(state.cameraOwned)items.push(['camera','Your DSLR camera',()=>target('photo')]);if(state.photoTaken)items.push(['photo',PHOTO_NAME,()=>showPhoto(true)]);if(state.hatClaimed)items.push([CONFIG.reward,REWARD.name+(state.hatEquipped?' · Equipped':' · Take it to Alisa'),()=>{const wrap=el('div'),img=el('img',undefined,'reward-icon');img.src=iconURL(CONFIG.reward);img.alt=REWARD.name;wrap.append(el('h2',REWARD.name),img,el('p',state.hatEquipped?'Equipped. Alisa did the honours.':'Yours. Take it back to the family at the shore.'),el('p',REWARD.examine));modal(wrap);}]);return items;}
function renderSide(){
 if(!world)return;const root=$('#sideContent');root.replaceChildren();document.querySelectorAll('[data-tab]').forEach(n=>n.classList.toggle('active',n.dataset.tab===tab));
 if(tab==='inventory'){root.append(el('h3',state.hatEquipped?'Inventory · Hat equipped':'Inventory'));const grid=el('div',undefined,'inventory'),items=inventory();for(let i=0;i<28;i++){const item=items[i];if(!item){const slot=el('div',undefined,'slot');slot.setAttribute('aria-hidden','true');grid.append(slot);continue;}const n=button('',()=>{if(state.activeScene){toast('Finish this exchange first.');return;}item[2]();});n.className='slot'+(item[0]===CONFIG.reward?' reward-slot':'');n.title=item[1];n.setAttribute('aria-label',item[1]);const img=el('img');img.src=iconURL(item[0]);img.alt='';n.append(img);if(item[0]===CONFIG.reward&&state.hatEquipped)n.append(el('span','E','equipped-badge'));grid.append(n);}root.append(grid,el('p','28 inventory slots.','side-note'));}
 else if(tab==='journal'){root.append(el('h3','Please Stop Farming Me'));for(const step of journalSteps(state))root.append(el('p',(step.done?'✓ ':'→ ')+step.text,'journal-step '+(step.done?'done':'current')));if(state.coverStory)root.append(el('p','Cover story: '+({money:'Someone else can pay.',outdoors:'Staying indoors this weekend.',camera:'A phone is just as good as a DSLR.'})[state.coverStory],'side-note'));if(state.witnessRecorded){root.append(el('h3','Witness statement'),el('p',WITNESS,'side-note'));}root.append(el('p',state.discoveries.length+' / '+discoveryIds.length+' quiet places discovered','discovery-count'));for(const id of state.discoveries)root.append(el('p','✓ '+TARGETS[id].name,'journal-step done'));root.append(button('Continue quest',()=>{closePanel();if(state.activeScene)renderScene();else menu();}));}
 else{root.append(el('h3','Village & lakeshore'));const map=el('canvas',undefined,'world-map');map.width=map.height=360;map.setAttribute('aria-label','Map. Yellow: current quest. White: you. Green: discovered.');world.drawMap(map);root.append(map,el('p','Yellow: quest · White: you · Green: discovered','map-key'));for(const [id,t]of Object.entries(TARGETS).sort((a,b)=>Math.hypot(a[1].x-world.player.position.x,a[1].z-world.player.position.z)-Math.hypot(b[1].x-world.player.position.x,b[1].z-world.player.position.z))){const n=button(t.name,()=>target(id));n.dataset.target=id;n.className='target'+(id===questTarget(state)?' quest-target':'');n.append(el('small',(t.district??'Explore')+' · '+Math.round(Math.hypot(t.x-world.player.position.x,t.z-world.player.position.z))+' steps','target-detail'));n.title=targetAction(id,state);root.append(n);}}
}
$('#settingsButton').onclick=settings;$('#welcomeSettings').onclick=settings;$('#closeModal').onclick=closeModal;
$('#mobileSettings').onclick=()=>{closePanel();settings();};$('#closePanel').onclick=closePanel;
document.querySelectorAll('[data-panel]').forEach(n=>{n.setAttribute('aria-controls','sidebar');n.setAttribute('aria-expanded','false');n.onclick=()=>{if(document.body.classList.contains('panel-open')&&tab===n.dataset.panel)closePanel();else openPanel(n.dataset.panel);};});
$('#minimap').onclick=()=>openPanel('targets');$('#minimap').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openPanel('targets');}};
$('#modal').addEventListener('cancel',e=>{e.preventDefault();closeModal();});
$('#classic').onclick=()=>{const wrap=el('div'),img=el('img',undefined,'classic-portrait');img.src=classicURL();img.alt='Classic adventurer';wrap.append(el('h2','Before the polygons'),img);modal(wrap);};
$('#muteButton').onclick=()=>{state.settings.muted=!state.settings.muted;audio.start();settingsApply();persist();};
$('#handle').value=state.handle;$('#handle').onchange=e=>$('#start').textContent='Log in as '+e.target.value;
document.querySelectorAll('[data-tab]').forEach(n=>n.onclick=()=>{tab=n.dataset.tab;renderSide();});
document.addEventListener('keydown',e=>{if(!$('#modal').open&&!$('#welcome').open&&(state.activeScene||transient.length)&&e.repeat&&(e.key===' '||e.key==='Enter')){e.preventDefault();return;}if($('#modal').open||$('#welcome').open||['INPUT','SELECT','BUTTON','A'].includes(document.activeElement.tagName))return;if((e.key==='Enter'||e.key===' ')&&(state.activeScene||transient.length)){e.preventDefault();advance();}if(e.key==='Escape'){closePanel();if(!busy&&!state.activeScene){world.stop();world.stand();menu();}}if(!busy){if(e.key.toLowerCase()==='q')world.yaw-=.2;if(e.key.toLowerCase()==='e')world.yaw+=.2;if(e.key==='+'||e.key==='=')world.setZoom(world.zoom-1);if(e.key==='-')world.setZoom(world.zoom+1);if(e.key.toLowerCase()==='c')world.focusOn(world.player.position);}});

// Pointer gestures are tracked separately from clicks so orbiting, scrolling and pinch gestures never skip a line.
const dialoguePointers=new Map();let lastDialogueGesture=null;
const dialogueKey=()=>state.activeScene?state.activeScene.id+':'+state.activeScene.index+':'+state.activeScene.choice:'hint:'+transientIndex;
document.addEventListener('pointerdown',e=>{
 if(e.button!==0)return;
 const gesture={x:e.clientX,y:e.clientY,moved:dialoguePointers.size>0,ready:continuationReady,key:dialogueKey()};
 if(dialoguePointers.size)for(const p of dialoguePointers.values())p.moved=true;
 dialoguePointers.set(e.pointerId,gesture);
},true);
document.addEventListener('pointermove',e=>{const p=dialoguePointers.get(e.pointerId);if(p&&Math.hypot(e.clientX-p.x,e.clientY-p.y)>8)p.moved=true;},true);
for(const type of ['pointerup','pointercancel'])document.addEventListener(type,e=>{const p=dialoguePointers.get(e.pointerId);if(p){lastDialogueGesture={...p,moved:p.moved||type==='pointercancel',at:performance.now()};dialoguePointers.delete(e.pointerId);}},true);
document.addEventListener('click',e=>{
 if(!$('#client').contains(e.target)||!continuationReady||busy||$('#modal').open||$('#welcome').open)return;
 if(e.target.closest('button,a,input,select,textarea,label,summary,details,dialog,#sidebar,#mobileControls,[role="button"]'))return;
 if(e.detail>0&&lastDialogueGesture&&performance.now()-lastDialogueGesture.at<1000&&(!lastDialogueGesture.ready||lastDialogueGesture.moved||lastDialogueGesture.key!==dialogueKey()))return;
 e.preventDefault();e.stopImmediatePropagation();
 if(e.detail>1)return;
 advance();
},true);

$('#centerCamera').onclick=()=>world.focusOn(world.player.position);
document.addEventListener('visibilitychange',()=>{if(document.hidden){voice.stop();persist();audio.pause();}else audio.resume();});
window.addEventListener('pagehide',persist);
try{
 world=new World($('#world'),{onTarget:(id,secondary)=>{if(!state.activeScene&&!transient.length)target(id,secondary);},onGround:p=>{if(!busy&&!state.activeScene&&!transient.length){world.stand();if(!world.go(p))toast('Choose a clear patch of ground.');}},onArrive:toast});
 world.sync(state);world.focusOn(world.player.position);world.focus.copy(world.desiredFocus);world.tick(0);$('#loading').style.display='none';settingsApply();renderObjective();renderSide();
 if(state.migrated)$('#resumeNotice').textContent='A new story awaits. Your sound, voice, and text preferences have been kept.';
 else if(state.started){$('#start').textContent='Continue as '+state.handle;$('#resumeNotice').textContent='Your expedition is saved, including your current conversation.';}
 $('#welcome').showModal();$('#start').onclick=()=>{audio.start();if(!state.started){state.handle=$('#handle').value;commit('start');audio.effect('login');}$('#welcome').close();if(state.activeScene)renderScene();else menu();};
 let last=performance.now(),labelsAt=0,mapAt=0,saveAt=0;
 function loop(now){const dt=Math.min(.05,(now-last)/1000);last=now;if(!document.hidden&&!$('#modal').open&&!$('#welcome').open){world.tick(dt);audio.setEnvironment(regionAt(world.player.position.x,world.player.position.z),!!world.walk.length);audio.tick(dt);if(now-labelsAt>100){world.drawLabels($('#overheads'));labelsAt=now;}if(now-mapAt>250){world.drawMap($('#minimap'));const map=$('.world-map');if(map)world.drawMap(map);$('#regionName').textContent=regionAt(world.player.position.x,world.player.position.z);$('#location').textContent=regionAt(world.player.position.x,world.player.position.z);mapAt=now;}if(now-saveAt>1500&&state.started&&!busy){persist();saveAt=now;}}if(toastUntil&&now>toastUntil){$('#toast').style.display='none';toastUntil=0;}requestAnimationFrame(loop);}requestAnimationFrame(loop);
 window.questDebug={get state(){return structuredClone(state);},get world(){return world;},get busy(){return busy;},get sceneIndex(){return state.activeScene?.index??0;},get sitting(){return !!world.seated;}};
}catch(error){console.error(error);$('#loading').replaceChildren();const msg=el('div',undefined,'error');msg.append(el('p','The village could not start. This game needs WebGL and must be served over HTTP.'),button('Retry',()=>location.reload()));$('#loading').append(msg);}



