import {CONFIG} from './config.js';
import {VOICE_PROFILES,recordingId} from './voice-plan.js';
import {RECORDINGS} from './recordings.js';
import {customPortrait} from './portraits.js';

const hex=n=>'#'+n.toString(16).padStart(6,'0');
export function portraitURL(name,fallback=false){
 if(!fallback&&customPortrait(name))return customPortrait(name);
 const a=CONFIG.appearances[name]??{skin:0xc49c77,hair:0x65503b,shirt:0x77785d};
 let face=`<path fill="${hex(a.shirt)}" d="M9 128v-21q4-23 47-26l16 0q43 3 47 26v21z"/><path fill="${hex(a.skin)}" d="M53 70h22v24L64 104 53 94z"/><path fill="#000" opacity=".15" d="m53 77 22-6v13L53 90z"/><path fill="${hex(a.hair)}" d="M32 72V35Q34 9 63 10q32 0 33 27v41l-13 15H45z"/><path fill="${hex(a.skin)}" d="M39 37 52 25 80 29 90 41 85 73 74 85 55 84 43 72z"/><path fill="${hex(a.hair)}" d="M36 43V28l18-15 25 3 17 20-8 11-10-18-23 7-13 12z"/><path fill="#382c22" d="M47 48h12v3H47zm24 0h12v3H71z"/><path fill="#eee0bc" d="M48 53h10v5H48zm23 0h10v5H71z"/><path fill="#28281f" d="M53 53h4v5h-4zm19 0h4v5h-4z"/><path fill="#000" opacity=".17" d="m65 53-5 15h10z"/><path stroke="#714b37" stroke-width="2" d="M56 74h17"/>`;
 if(a.longHair)face=face.replace('M32 72V35','M28 110V35').replace('v41l-13 15H45z','v75l-18-5H39z');
 if(name==='Robot')face='<path fill="#777d70" d="M19 128v-32h90v32z"/><path fill="#9a9e87" d="M22 29h84v60H22z"/><path fill="#5e655a" d="m22 29 13-10h58l13 10zM22 89h84l-13 9H35z"/><path fill="#e5cf78" d="M34 45h19v15H34zm41 0h19v15H75z"/><path stroke="#343c34" stroke-width="4" d="M43 78h42M64 19V8"/>';
 if(name==='Rock')face='<path fill="#969789" d="m17 96-5-35 25-29 44 2 30 37-12 32-57 7z"/><path fill="#b2b3a0" d="m12 61 25-29 44 2-24 34z"/><path fill="#30352c" d="M43 77h5v5h-5zm29-2h5v5h-5z"/>';
 if(name==='Narrator'||name==='Game')face='<path fill="#bfa36c" d="M24 18h80v94H24z"/><path fill="#e7d5aa" d="M31 24h66v81H31z"/><path stroke="#8b7450" stroke-width="3" d="M43 42h42M43 53h42M43 64h29M43 86h42"/><path fill="#514c38" d="m77 85 9-44 19-26-7 32z"/>';
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" fill="#5b6047"/><path fill="#737456" d="M0 0h128L0 128z"/>${face}</svg>`;
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}

// Optional browser speech needs no server, account, or API key.
export class CharacterVoice{
 constructor(){this.enabled=false;this.muted=true;this.volume=1;this.choices={};this.current=null;this.last=null;this.clip=null;this.generation=0;}
 get speaking(){return !!(this.clip&&!this.clip.paused||this.current&&globalThis.speechSynthesis?.speaking);}
 stop(){this.generation++;globalThis.speechSynthesis?.cancel();if(this.clip){this.clip.pause();this.clip=null;}this.current=null;this.onSpeaking?.(false);}
 available(){return (globalThis.speechSynthesis?.getVoices()??[]).filter(v=>v.lang.toLowerCase().startsWith('en')).sort((a,b)=>a.voiceURI.localeCompare(b.voiceURI));}
 speak(name,text){this.last={name,text};this.stop();if(!this.enabled||this.muted||name==='Game'||name==='Rock'||!/[a-z]/i.test(text))return;
  const generation=this.generation,clip=RECORDINGS[recordingId(name,text)];
  if(clip){this.clip=new Audio(new URL('../'+clip,import.meta.url).href);this.clip.volume=this.volume;let failed=false;const fallback=()=>{if(!failed&&generation===this.generation){failed=true;this.clip?.pause();this.clip=null;this.synthesize(name,text);}};this.clip.addEventListener('playing',()=>{if(generation===this.generation)this.onSpeaking?.(true);},{once:true});this.clip.addEventListener('ended',()=>{if(generation===this.generation){this.clip=null;this.onSpeaking?.(false);}},{once:true});this.clip.addEventListener('error',fallback,{once:true});this.clip.play().catch(fallback);return;}
  this.synthesize(name,text);
 }
 synthesize(name,text){if(!globalThis.speechSynthesis)return;
  const utterance=new SpeechSynthesisUtterance(text),voices=this.available();
  const index=Object.keys(VOICE_PROFILES).indexOf(name),profile=VOICE_PROFILES[name]??{rate:1,pitch:1};utterance.voice=voices.find(v=>v.voiceURI===this.choices[name])??(voices.length?voices[Math.max(0,index)%voices.length]:null);
  utterance.lang=utterance.voice?.lang??'en-GB';utterance.rate=profile.rate;utterance.pitch=profile.pitch;utterance.volume=this.volume;
  const generation=this.generation;utterance.onstart=()=>{if(generation===this.generation)this.onSpeaking?.(true);};const finish=()=>{if(generation===this.generation){this.current=null;this.onSpeaking?.(false);}};utterance.onend=finish;utterance.onerror=finish;
  this.current=utterance;speechSynthesis.speak(utterance);
 }
 replay(){if(this.last)this.speak(this.last.name,this.last.text);}
}
