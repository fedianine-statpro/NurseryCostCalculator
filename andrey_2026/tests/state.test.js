import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {CONFIG} from '../js/config.js';
import assert from 'node:assert/strict';
import {freshState,transition as t,validateSave,loadSave,saveGame,journalSteps,objective} from '../js/state.js';
import {sceneSteps,sceneDefinition} from '../js/quest.js';
import {DECISIONS,SCRIPT} from '../js/script.js';
import {findPath,approachPath} from '../js/path.js';
import {through,prepared,route} from './helpers.js';
test('sound and voices start enabled, old defaults upgrade once, and later preferences persist',()=>{
 const fresh=freshState();assert.equal(fresh.settings.muted,false);assert.equal(fresh.settings.voices,true);
 const legacy=structuredClone(fresh);delete legacy.settings.audioDefaultsVersion;legacy.settings.muted=true;legacy.settings.voices=false;legacy.settings.music=.1;
 const upgraded=validateSave(legacy);assert.equal(upgraded.settings.muted,false);assert.equal(upgraded.settings.voices,true);assert.equal(upgraded.settings.music,.1);
 upgraded.settings.muted=true;upgraded.settings.voices=false;const loaded=validateSave(JSON.parse(JSON.stringify(upgraded)));assert.equal(loaded.settings.muted,true);assert.equal(loaded.settings.voices,false);
});

test('both preparation orders and both daughter orders reach one complete family ending',()=>{
 for(const cover of ['money','outdoors','camera'])for(const cameraFirst of [false,true])for(const arishaFirst of [false,true]){
  let s=prepared(['start','bounty']);const camera=[['cover',cover],'camera','alex'];
  for(const e of cameraFirst?[...camera,'raid']:['raid',...camera])s=t(s,Array.isArray(e)?e[0]:e,Array.isArray(e)?e[1]:undefined);
  assert.equal(s.alexTalked,true);s=t(s,'anya');for(const e of arishaFirst?['arisha','alisa']:['alisa','arisha'])s=t(s,e);
  s=t(s,'photo');assert.equal(s.witnessRecorded,true);s=t(s,'hat');assert.equal(s.hatClaimed,true);assert.equal(s.hatEquipped,false);assert.equal(s.reunionDone,false);
  s=t(t(t(s,'equip'),'reunion'),'letter');assert.equal(s.stage,9);assert.equal(s.letterRead,true);assert.ok(validateSave(s));
 }
});
test('all 24 choices run exactly their selected branch and one shared continuation',()=>{
 assert.equal(Object.keys(DECISIONS).length,8);
 for(const [id,s]of [['bounty',freshState()],['raid',through('bounty')],['camera',through('bounty')],['alex',through('camera')],['anya',through('alex')],['alisa',through('anya')],['arisha',through('anya')],['claim',through('photo')]]){
  const def=sceneDefinition(id,s),options=DECISIONS[def.decision];assert.equal(options.length,3);
  for(const choice of options){const steps=sceneSteps(id,s,choice.id);assert.deepEqual(steps.slice(def.opening.length+1,def.opening.length+1+choice.lines.length),choice.lines);assert.deepEqual(steps.slice(-def.continuation.length),def.continuation);for(const other of options.filter(c=>c!==choice))assert.equal(steps.includes(other.lines[0]),false);}
 }
});
test('camera grant keeps rehearsal pending; both journal preparation tasks remain separate',()=>{
 let s=prepared(['start','bounty',['cover','outdoors'],'camera']);assert.equal(s.alexTalked,false);assert.equal(s.raidJoined,false);assert.match(objective(s),/Alex/);
 s=validateSave(JSON.parse(JSON.stringify(s)));assert.equal(s.cameraOwned,true);s=t(s,'alex');assert.match(objective(s),/Register/);
 const steps=journalSteps(s);assert.equal(steps.find(s=>s.target==='house').done,true);assert.equal(steps.find(s=>s.target==='park').done,false);
});
test('neither photograph nor witness can bypass a family conversation',()=>{
 for(const missing of ['anya','alisa','arisha']){let s=through('alex');for(const e of ['anya','alisa','arisha'].filter(e=>e!==missing))s=t(s,e);assert.equal(t(s,'photo').photoTaken,false);assert.equal(t(s,'hat').hatClaimed,false);}
});
test('reward, equipment, reunion and letter are separate idempotent boundaries',()=>{
 let s=through('photo');assert.equal(t(s,'equip').hatEquipped,false);assert.equal(t(s,'reunion').reunionDone,false);assert.equal(t(s,'letter').letterRead,false);
 s=t(s,'hat');assert.deepEqual(t(s,'hat'),s);assert.equal(s.hatEquipped,false);s=validateSave(s);assert.match(objective(s),/Return/);
 s=t(s,'equip');assert.deepEqual(t(s,'equip'),s);assert.equal(s.reunionDone,false);s=t(s,'reunion');assert.deepEqual(t(s,'reunion'),s);assert.equal(s.letterRead,false);assert.match(objective(s),/Victor/);
 s=t(s,'letter');assert.deepEqual(t(s,'letter'),s);
});
test('all semantic boundaries and selected scene cursors round-trip through storage',()=>{
 for(let i=0;i<=route.length;i++){const s=prepared(route.slice(0,i));assert.ok(validateSave(JSON.parse(JSON.stringify(s))));}
 let s=through('camera');s.activeScene={id:'alex',index:21,choice:'c'};s.choices.alex_cover='c';const loaded=validateSave(JSON.parse(JSON.stringify(s)));assert.deepEqual(loaded.activeScene,s.activeScene);assert.equal(loaded.choices.alex_cover,'c');
 const malformed={...through('photo'),arishaTalked:false};assert.equal(validateSave(malformed),null);
});
test('callbacks occur only at reunion, including the selected cover story',()=>{
 const claim=sceneSteps('claim',through('photo'),'a');
 for(const cover of ['money','outdoors','camera']){const s={...through('hat'),coverStory:cover},reunion=sceneSteps('reunion',s);for(const line of SCRIPT.callbacks[cover]){assert.ok(reunion.includes(line));assert.equal(claim.includes(line),false);}for(const other of Object.keys(SCRIPT.callbacks).filter(k=>k!==cover))assert.equal(reunion.includes(SCRIPT.callbacks[other][0]),false);}
});
test('old story saves start v4 while retaining preferences, never old rewards or story flags',()=>{
 const s=validateSave({saveVersion:1,stage:9,hatEquipped:true,rockAdopted:true,settings:{muted:false,music:.4,largeText:true,voiceChoices:{Victor:'v'}},handle:'toldo'});assert.equal(s.migrated,true);assert.equal(s.storyVersion,4);assert.equal(s.bountyStarted,false);assert.equal(s.hatClaimed,false);assert.equal(s.rockAdopted,undefined);assert.equal(s.settings.music,.4);assert.equal(s.settings.largeText,true);assert.equal(s.settings.voiceChoices.Victor,'v');
 assert.equal(validateSave({saveVersion:99}),null);assert.equal(loadSave({getItem(){return 'bad';}}),null);
});
test('blocked storage preserves an in-memory playthrough',()=>{assert.equal(saveGame(freshState(),{setItem(){throw Error('blocked');}}),false);assert.equal(loadSave({getItem(){throw Error('blocked');}}),null);});
test('pathfinding respects walls and approaches buildings from reachable cells',()=>{
 const blocked=new Set(['2,0','2,1','2,2','2,3']);const p=findPath({x:0,z:1},{x:4,z:1},blocked,6,6);assert.ok(p.length);assert.ok(p.some(c=>c.z===4));for(const c of p)assert.equal(blocked.has(c.x+','+c.z),false);assert.ok(approachPath({x:0,z:0},{x:2,z:1},blocked));
});
test('optional conversations and discoveries are single-use',()=>{let s=t(t(freshState(),'optional','football'),'optional','football');assert.deepEqual(s.seenOptional,['football']);s=t(t(s,'discover','well'),'discover','well');assert.deepEqual(s.discoveries,['well']);assert.deepEqual(t(s,'optional','mine'),s);});
test('Victor’s sincere letter matches the canonical manuscript exactly',()=>{const source=readFileSync(new URL('../Freakybat-Full-Story-v4.md',import.meta.url),'utf8');const paragraphs=[...source.matchAll(/^> (.+)$/gm)].map(m=>m[1].trim());assert.deepEqual(CONFIG.letter,paragraphs);assert.equal(JSON.stringify(SCRIPT).includes('Narrator|'),false);});

