import {CONFIG} from './config.js';
import {MAP_WIDTH,MAP_HEIGHT,discoveryIds,questTarget} from './map-data.js';
export const STORY_VERSION=4;
export const defaultSettings=()=>({audioDefaultsVersion:2,muted:false,music:.24,effects:.5,voiceVolume:1,voiceChoices:{},largeText:false,voices:false,reducedMotion:globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches??false});
export const SCENE_IDS=['bounty','raid','camera','alex','anya','alisa','arisha','capture','claim','reunion','meditation','football','after_party'];
export function stageOf(s){return !s.bountyStarted?0:s.cameraOwned&&!s.alexTalked?2:!s.raidJoined||!s.cameraOwned?1:!s.anyaTalked?3:!s.alisaTalked||!s.arishaTalked?4:!s.photoTaken?5:!s.hatClaimed?6:!s.reunionDone?7:!s.letterRead?8:9;}
export function freshState(settings=defaultSettings(),handle='freakybat'){return {saveVersion:CONFIG.saveVersion,storyVersion:STORY_VERSION,handle,started:false,stage:0,playerPosition:{x:9,z:13},facing:Math.PI,bountyStarted:false,raidJoined:false,cameraOwned:false,coverStory:null,alexTalked:false,anyaTalked:false,alisaTalked:false,arishaTalked:false,photoTaken:false,witnessRecorded:false,hatClaimed:false,hatEquipped:false,reunionDone:false,letterRead:false,seenOptional:[],discoveries:[],choices:{},activeScene:null,settings:{...defaultSettings(),...settings}};}
export function familyReady(s){return s.raidJoined&&s.cameraOwned&&s.alexTalked&&s.anyaTalked&&s.alisaTalked&&s.arishaTalked;}
export function transition(state,event,value){
 const s=structuredClone(state);
 switch(event){
 case 'start':s.started=true;break;
 case 'bounty':if(s.started)s.bountyStarted=true;break;
 case 'raid':if(s.bountyStarted)s.raidJoined=true;break;
 case 'cover':if(s.bountyStarted&&['money','outdoors','camera'].includes(value))s.coverStory=value;break;
 case 'camera':if(s.bountyStarted&&s.coverStory)s.cameraOwned=true;break;
 case 'alex':if(s.cameraOwned)s.alexTalked=true;break;
 case 'anya':if(s.raidJoined&&s.cameraOwned&&s.alexTalked)s.anyaTalked=true;break;
 case 'alisa':case 'arisha':if(s.anyaTalked)s[event+'Talked']=true;break;
 case 'photo':if(familyReady(s)){s.photoTaken=true;s.witnessRecorded=true;}break;
 case 'hat':if(s.photoTaken&&s.witnessRecorded)s.hatClaimed=true;break;
 case 'equip':if(s.hatClaimed)s.hatEquipped=true;break;
 case 'reunion':if(s.hatClaimed&&s.hatEquipped)s.reunionDone=true;break;
 case 'letter':if(s.reunionDone)s.letterRead=true;break;
 case 'optional':if(['meditation','football','after_party'].includes(value)&&!s.seenOptional.includes(value))s.seenOptional.push(value);break;
 case 'discover':if(discoveryIds.includes(value)&&!s.discoveries.includes(value))s.discoveries.push(value);break;
 }
 s.stage=stageOf(s);return s;
}
export function journalSteps(s){
 const steps=[{text:'Read the bounty at the Bank of Birthdays.',done:s.bountyStarted,target:'bank'}];
 if(s.bountyStarted)steps.push({text:'Register as Toldo at the park entrance.',done:s.raidJoined,target:'park'},{text:'Get my camera from Danya in the south village.',done:s.cameraOwned,target:'house'});
 if(s.cameraOwned)steps.push({text:'Let Alex test my cover story.',done:s.alexTalked,target:'alex'});
 if(s.raidJoined&&s.cameraOwned&&s.alexTalked)steps.push({text:'Meet Anya at the shore.',done:s.anyaTalked,target:'photo'});
 if(s.anyaTalked)steps.push({text:'Speak to Alisa.',done:s.alisaTalked,target:'alisa'},{text:'Speak to Arisha.',done:s.arishaTalked,target:'arisha'});
 if(familyReady(s))steps.push({text:'Take the family photograph and record the witness statement.',done:s.photoTaken,target:'photo'});
 if(s.photoTaken)steps.push({text:'Return to the bank. Remind the banker what he actually asked for.',done:s.hatClaimed,target:'bank'});
 if(s.hatClaimed)steps.push({text:'Return to Anya and the girls at the shore. I promised.',done:s.reunionDone,target:'photo'});
 if(s.reunionDone)steps.push({text:'Read Victor’s birthday message.',done:s.letterRead,target:null});
 return steps;
}
export function objective(s){if(s.reunionDone)return s.letterRead?'Quest complete. Happy birthday, Freakybat.':'Victor has a birthday message for you.';const target=questTarget(s);return journalSteps(s).find(row=>!row.done&&row.target===target)?.text??'Explore the village.';}
function settingsOf(data){const s={...defaultSettings(),...data};if(data?.audioDefaultsVersion!==2){if(!data?.audioDefaultsVersion)s.muted=false;s.voices=false;}s.audioDefaultsVersion=2;for(const k of ['muted','largeText','reducedMotion','voices'])s[k]=!!s[k];for(const k of ['music','effects','voiceVolume'])s[k]=Math.max(0,Math.min(1,Number(s[k])||0));s.voiceChoices=s.voiceChoices&&typeof s.voiceChoices==='object'&&!Array.isArray(s.voiceChoices)?Object.fromEntries(Object.entries(s.voiceChoices).filter(([name,id])=>(Object.hasOwn(CONFIG.appearances,name)||['Robot','Narrator'].includes(name))&&typeof id==='string'&&id.length<300)):{};return s;}
export function validateSave(data){
 if(!data||typeof data!=='object'||Array.isArray(data))return null;
 if(data.storyVersion!==STORY_VERSION||data.saveVersion!==CONFIG.saveVersion){
  if(!Number.isInteger(data.saveVersion)||data.saveVersion<1||data.saveVersion>4)return null;
  return {...freshState(settingsOf(data.settings),data.handle==='toldo'?'toldo':'freakybat'),migrated:true};
 }
 const s={...freshState(),...data,settings:settingsOf(data.settings)};
 const flags=['started','bountyStarted','raidJoined','cameraOwned','alexTalked','anyaTalked','alisaTalked','arishaTalked','photoTaken','witnessRecorded','hatClaimed','hatEquipped','reunionDone','letterRead'];
 if(flags.some(k=>typeof s[k]!=='boolean'))return null;
 if(s.bountyStarted&&!s.started||s.raidJoined&&!s.bountyStarted||s.cameraOwned&&(!s.bountyStarted||!['money','outdoors','camera'].includes(s.coverStory))||s.alexTalked&&!s.cameraOwned||s.anyaTalked&&(!s.alexTalked||!s.raidJoined)||s.alisaTalked&&!s.anyaTalked||s.arishaTalked&&!s.anyaTalked||s.photoTaken&&!familyReady(s)||s.witnessRecorded!==s.photoTaken||s.hatClaimed&&!s.photoTaken||s.hatEquipped&&!s.hatClaimed||s.reunionDone&&!s.hatEquipped||s.letterRead&&!s.reunionDone)return null;
 s.handle=s.handle==='toldo'?'toldo':'freakybat';s.stage=stageOf(s);
 s.seenOptional=Array.isArray(s.seenOptional)?[...new Set(s.seenOptional.filter(v=>['meditation','football','after_party'].includes(v)))]:[];
 s.discoveries=Array.isArray(s.discoveries)?[...new Set(s.discoveries.filter(v=>discoveryIds.includes(v)))]:[];
 s.choices=s.choices&&typeof s.choices==='object'&&!Array.isArray(s.choices)?Object.fromEntries(Object.entries(s.choices).filter(([,v])=>['a','b','c','money','outdoors','camera'].includes(v))):{};
 if(s.activeScene&&(!SCENE_IDS.includes(s.activeScene.id)||!Number.isInteger(s.activeScene.index)||s.activeScene.index<0||s.activeScene.index>150||s.activeScene.choice!==null&&!['a','b','c','money','outdoors','camera'].includes(s.activeScene.choice)))s.activeScene=null;
 if(!s.playerPosition||!Number.isFinite(s.playerPosition.x)||!Number.isFinite(s.playerPosition.z)||s.playerPosition.x<0||s.playerPosition.x>=MAP_WIDTH||s.playerPosition.z<0||s.playerPosition.z>=MAP_HEIGHT)s.playerPosition={x:9,z:13};
 s.facing=Number.isFinite(s.facing)?s.facing:0;return s;
}
export function loadSave(storage){try{return validateSave(JSON.parse((storage??globalThis.localStorage).getItem(CONFIG.saveKey)));}catch{return null;}}
export function saveGame(s,storage){try{(storage??globalThis.localStorage).setItem(CONFIG.saveKey,JSON.stringify(s));return true;}catch{return false;}}


