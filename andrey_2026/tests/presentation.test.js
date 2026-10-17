import {test} from 'node:test';
import assert from 'node:assert/strict';
import {MAP_WIDTH,MAP_HEIGHT,TARGETS,discoveryIds,targetAction,terrainAt} from '../js/map-data.js';
import {freshState,transition,validateSave} from '../js/state.js';
import {CharacterVoice} from '../js/dialogue.js';
import {RECORDINGS} from '../js/recordings.js';
import {recordingId} from '../js/voice-plan.js';

test('expanded map keeps targets in bounds and separates water from the crossing',()=>{
 assert.equal(MAP_WIDTH,64);assert.equal(MAP_HEIGHT,64);for(const t of Object.values(TARGETS)){assert.ok(t.x>=0&&t.x<64&&t.z>=0&&t.z<64);}assert.equal(terrainAt(31,15),'water');for(let x=26;x<=38;x++)assert.notEqual(terrainAt(x,25),'water');assert.match(targetAction('bench',freshState()),/Sit/);
});
test('required story locations occupy distinct districts with separate daughter interactions',()=>{
 const distance=(a,b)=>Math.hypot(TARGETS[a].x-TARGETS[b].x,TARGETS[a].z-TARGETS[b].z);
 assert.ok(distance('bank','house')>=18);assert.ok(distance('bank','photo')>=30);assert.ok(distance('house','park')>=15);
 assert.ok(distance('photo','alisa')>=3);assert.ok(distance('photo','arisha')>=3);
 assert.notEqual(TARGETS.bank.district,TARGETS.house.district);assert.notEqual(TARGETS.house.district,TARGETS.photo.district);
});
test('discoveries are unique, validated, and survive old and expanded saves',()=>{
 let s=freshState();s=transition(s,'discover','well');s=transition(s,'discover','well');s=transition(s,'discover','unknown');assert.deepEqual(s.discoveries,['well']);s.playerPosition={x:14,z:54};s.settings.voiceChoices={Victor:'voice-id',unexpected:'bad'};const loaded=validateSave(s);assert.deepEqual(loaded.discoveries,['well']);assert.deepEqual(loaded.playerPosition,{x:14,z:54});assert.deepEqual(loaded.settings.voiceChoices,{Victor:'voice-id'});delete s.discoveries;assert.deepEqual(validateSave(s).discoveries,[]);assert.equal(discoveryIds.length,8);
});
test('voice assignments survive late voice ordering and stale callbacks cannot change the new speaker',()=>{
 const oldSpeech=Object.getOwnPropertyDescriptor(globalThis,'speechSynthesis'),oldUtterance=Object.getOwnPropertyDescriptor(globalThis,'SpeechSynthesisUtterance'),spoken=[],events=[];
 const available=[{voiceURI:'z',name:'Zed',lang:'en-GB'},{voiceURI:'a',name:'Alice',lang:'en-US'}];
 Object.defineProperty(globalThis,'speechSynthesis',{configurable:true,value:{getVoices:()=>available,cancel(){},speak(u){spoken.push(u);}}});Object.defineProperty(globalThis,'SpeechSynthesisUtterance',{configurable:true,value:class{constructor(text){this.text=text;}}});
 try{const v=new CharacterVoice();v.enabled=true;v.muted=false;v.volume=.4;v.choices={Victor:'z'};v.onSpeaking=active=>events.push(active);v.speak('Victor','First');const first=spoken.at(-1);assert.equal(first.voice.voiceURI,'z');assert.equal(first.volume,.4);first.onstart();v.speak('Anya','Second');const second=spoken.at(-1);second.onstart();const count=events.length;first.onend();assert.equal(events.length,count);assert.equal(v.current,second);second.onend();assert.equal(v.current,null);assert.equal(events.at(-1),false);available.reverse();v.speak('Victor','Again');assert.equal(spoken.at(-1).voice.voiceURI,'z');}
 finally{if(oldSpeech)Object.defineProperty(globalThis,'speechSynthesis',oldSpeech);else delete globalThis.speechSynthesis;if(oldUtterance)Object.defineProperty(globalThis,'SpeechSynthesisUtterance',oldUtterance);else delete globalThis.SpeechSynthesisUtterance;}
});

test('failed recordings fall back once and cancelled recordings cannot start stale speech',async()=>{
 const names=['speechSynthesis','SpeechSynthesisUtterance','Audio'],old=names.map(n=>Object.getOwnPropertyDescriptor(globalThis,n)),spoken=[],clips=[],id=recordingId('Victor','Test recording.');
 class Clip{constructor(){this.events={};this.paused=true;clips.push(this);}addEventListener(name,fn){this.events[name]=fn;}play(){return Promise.reject(Error('Missing clip'));}pause(){this.paused=true;}}
 Object.defineProperty(globalThis,'speechSynthesis',{configurable:true,value:{getVoices:()=>[],cancel(){},speak(u){spoken.push(u);}}});Object.defineProperty(globalThis,'SpeechSynthesisUtterance',{configurable:true,value:class{constructor(text){this.text=text;}}});Object.defineProperty(globalThis,'Audio',{configurable:true,value:Clip});RECORDINGS[id]='assets/voices/missing-test.mp3';
 try{const v=new CharacterVoice();v.enabled=true;v.muted=false;v.speak('Victor','Test recording.');clips[0].events.error();await Promise.resolve();assert.equal(spoken.length,1);assert.equal(spoken[0].text,'Test recording.');v.speak('Victor','Test recording.');v.stop();await Promise.resolve();assert.equal(spoken.length,1);assert.equal(v.current,null);}
 finally{delete RECORDINGS[id];names.forEach((name,i)=>{if(old[i])Object.defineProperty(globalThis,name,old[i]);else delete globalThis[name];});}
});
