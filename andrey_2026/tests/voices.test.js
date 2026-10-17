import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SCRIPT,OPTIONAL,BENCH_LINES,DECISIONS,HINTS} from '../js/script.js';
import {CONFIG} from '../js/config.js';
import {VOICE_PROFILES,recordingId} from '../js/voice-plan.js';
import {CharacterVoice} from '../js/dialogue.js';

test('every scripted spoken line has a matching recording entry',()=>{
 const lines=JSON.parse(readFileSync(new URL('../recording-scripts/lines.json',import.meta.url),'utf8'));
 const ids=new Set(lines.map(line=>line.id));
 function check(value){if(typeof value==='string'){
  const [speaker,...copy]=value.split('|');if(speaker==='Game')return;
  if(speaker==='Partner'){for(const name of ['Anya','Alisa','Arisha'])check(name+'|'+copy.join('|'));return;}
  const text=copy.join('|');if(!/[a-z]/i.test(text))return;const variants=text.includes('{hatExamine}')?Object.values(CONFIG.rewards).map(r=>text.replaceAll('{hatExamine}',r.examine)):[text.replaceAll('{handle}','freakybat')];
  for(const variant of variants)assert.ok(ids.has(recordingId(speaker,variant)),speaker+': '+variant);
 }else if(value&&typeof value==='object')Object.values(value).forEach(check);}
 check(SCRIPT);check(OPTIONAL);check(BENCH_LINES);check(HINTS);for(const choices of Object.values(DECISIONS))for(const choice of choices)check(choice.lines);assert.equal(ids.size,lines.length);
});

test('characters remain distinct with one installed voice; rock stays silent',()=>{
 const oldSpeech=Object.getOwnPropertyDescriptor(globalThis,'speechSynthesis'),oldUtterance=Object.getOwnPropertyDescriptor(globalThis,'SpeechSynthesisUtterance');
 const spoken=[];let stops=0;
 Object.defineProperty(globalThis,'speechSynthesis',{configurable:true,value:{getVoices:()=>[{name:'Only voice',lang:'en-GB'}],cancel(){stops++;},speak(u){spoken.push(u);}}});
 Object.defineProperty(globalThis,'SpeechSynthesisUtterance',{configurable:true,value:class{constructor(text){this.text=text;}}});
 try{const voice=new CharacterVoice();voice.enabled=true;voice.muted=false;
  for(const name of Object.keys(VOICE_PROFILES))voice.speak(name,'Test line.');
  assert.equal(spoken.length,Object.keys(VOICE_PROFILES).length-1);
  assert.equal(new Set(spoken.map(u=>u.pitch+','+u.rate)).size,spoken.length);
  const count=spoken.length;voice.muted=true;voice.speak('Victor','Muted.');assert.equal(spoken.length,count);assert.ok(stops>0);
 }finally{
  if(oldSpeech)Object.defineProperty(globalThis,'speechSynthesis',oldSpeech);else delete globalThis.speechSynthesis;
  if(oldUtterance)Object.defineProperty(globalThis,'SpeechSynthesisUtterance',oldUtterance);else delete globalThis.SpeechSynthesisUtterance;
 }
});
