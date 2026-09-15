export const SAVE_KEY = 'natalia-quest-v1';
export const TEST_SAVE_KEY = 'natalia-quest-v1-bridge-test';
const flagNames = ['gateBriefed','rescueBriefed','rodGranted','bellRetrieved','boxMovedOnce','boxHeld','ladleTaken','bellHung','rangerRescued','keyReturned','bookDown','padDown','prygInked','signed','bridgeOpen','ladleWashed','finaleComplete','prygDeparted'];
export function initialState() {
  return {version:1,scene:'gate',position:{x:90,y:285},flags:{...Object.fromEntries(flagNames.map(k=>[k,false])),signalSent:false,ropeThrown:false,finaleStarted:false,evening:false},inventory:[],seenBlocks:[],settings:{voice:1,music:.25,sfx:.6,muted:false,reducedMotion:false}};
}
export function permitted(s) {return s.seenBlocks.includes('gate/signature');}
export function reducer(s,e) {
  const f=s.flags; let change={};
  switch(e.type) {
    case 'seen': return s.seenBlocks.includes(e.block)?s:{...s,seenBlocks:[...s.seenBlocks,e.block]};
    case 'talk_gate': if(f.gateBriefed)return s;change.gateBriefed=true;break;
    case 'inspect_camp': if(f.rescueBriefed)return s;change.rescueBriefed=true;break;
    case 'grant_rod': if(f.rodGranted)return s;return {...s,flags:{...f,rodGranted:true},inventory:[...s.inventory,'rod']};
    case 'retrieve_bell': if(!s.inventory.includes('rod')||f.bellRetrieved)return s;return {...s,flags:{...f,bellRetrieved:true},inventory:[...s.inventory.filter(k=>k!=='rod'),'bell']};
    case 'kick_box': if(f.boxMovedOnce||f.ladleTaken)return s;change.boxMovedOnce=true;break;
    case 'hold_box': if(!f.boxMovedOnce||f.boxHeld||f.ladleTaken)return s;change.boxHeld=true;break;
    case 'take_ladle': if(!f.boxHeld||f.ladleTaken)return s;return {...s,flags:{...f,ladleTaken:true},inventory:[...s.inventory,'ladle']};
    case 'hang_bell': if(!s.inventory.includes('bell')||f.bellHung)return s;return {...s,flags:{...f,bellHung:true},inventory:s.inventory.filter(k=>k!=='bell')};
    case 'signal': if(!f.bellHung||!s.inventory.includes('ladle')||!f.rescueBriefed||f.signalSent||f.rangerRescued)return s;change.signalSent=true;break;
    case 'throw_rope': if(!f.signalSent||f.ropeThrown||f.rangerRescued)return s;change.ropeThrown=true;break;
    case 'rescue': if(!f.ropeThrown||!f.bellHung||!f.ladleTaken||f.rangerRescued)return s;change.rangerRescued=true;break;
    case 'return_key': if(!f.rangerRescued||f.keyReturned)return s;change.keyReturned=true;break;
    case 'begin_finale': if(!f.prygDeparted||f.finaleStarted)return s;return {...s,scene:'home',position:{x:360,y:280},flags:{...f,finaleStarted:true}};
    case 'wash_ladle': if(!f.finaleStarted||f.ladleWashed)return s;return {...s,flags:{...f,ladleWashed:true},inventory:s.inventory.filter(k=>k!=='ladle')};
    case 'evening': if(!f.finaleStarted||!s.seenBlocks.includes('finale/gift')||f.evening)return s;change.evening=true;break;
    case 'end_finale': if(!f.evening||!s.seenBlocks.includes('finale/greeting')||f.finaleComplete)return s;change.finaleComplete=true;break;
    case 'scene': if(!['gate','camp','shore','home'].includes(e.scene)||f.finaleStarted)return s;return {...s,scene:e.scene,position:Array.isArray(e.position)?{x:e.position[0],y:e.position[1]}:e.position||{x:330,y:280}};
    case 'permission': if(!f.keyReturned || permitted(s)) return s; return {...s,seenBlocks:[...s.seenBlocks,'gate/signature']};
    case 'lower_book': if(!f.keyReturned || !permitted(s) || f.signed || f.bookDown) return s; change.bookDown=true; break;
    case 'lower_pad': if(!f.keyReturned || !permitted(s) || f.signed || f.padDown) return s; change.padDown=true; break;
    case 'jump_pad': if(!f.bookDown || !f.padDown || f.prygInked || f.signed) return s; change.prygInked=true; break;
    case 'jump_book': if(!f.prygInked || !f.bookDown || !f.padDown || f.signed) return s; change.signed=true; break;
    case 'signed_dialogue': if(!f.signed || s.seenBlocks.includes('gate/signed')) return s; return {...s,seenBlocks:[...s.seenBlocks,'gate/signed']};
    case 'open_gate': if(!f.keyReturned || !f.signed || !s.seenBlocks.includes('gate/signed') || f.bridgeOpen) return s; change.bridgeOpen=true; break;
    case 'depart': if(!f.bridgeOpen || f.prygDeparted) return s; change.prygDeparted=true; break;
    case 'position': return {...s,position:{x:Math.max(45,Math.min(610,e.x)),y:Math.max(210,Math.min(315,e.y))}};
    case 'settings': return {...s,settings:{...s.settings,...e.value}};
    default:return s;
  }
  return {...s,flags:{...f,...change}};
}
export function validState(s,{fixture=false}={}) {
  if(!s || s.version!==1 || !['gate','home','shore','camp'].includes(s.scene) || (fixture && s.mode!=='bridge-test') || (!fixture && s.mode)) return false;
  if(!s.flags || flagNames.some(k=>typeof s.flags[k]!=='boolean')) return false;
  if(!s.position || !Number.isFinite(s.position.x) || !Number.isFinite(s.position.y) || s.position.x<45 || s.position.x>610 || s.position.y<210 || s.position.y>315) return false;
  if(!Array.isArray(s.inventory) || s.inventory.some(k=>!['rod','bell','ladle'].includes(k)) || new Set(s.inventory).size!==s.inventory.length) return false;
  if(!Array.isArray(s.seenBlocks) || s.seenBlocks.some(k=>typeof k!=='string')) return false;
  if(!s.settings || ['voice','music','sfx'].some(k=>!Number.isFinite(s.settings[k]) || s.settings[k]<0 || s.settings[k]>1) || ['muted','reducedMotion'].some(k=>typeof s.settings[k]!=='boolean')) return false;
  const f=s.flags;
  return !(f.rangerRescued && (!f.bellHung || !f.ladleTaken)) && !(f.keyReturned && !f.rangerRescued)
    && !(permitted(s) && !f.keyReturned) && !(s.seenBlocks.includes('gate/signed') && !f.signed)
    && !((f.bookDown || f.padDown) && (!f.keyReturned || !permitted(s)))
    && !(f.prygInked && (!f.bookDown || !f.padDown)) && !(f.signed && !f.prygInked)
    && !(f.bridgeOpen && (!f.signed || !f.keyReturned || !s.seenBlocks.includes('gate/signed')))
    && !(f.prygDeparted && !f.bridgeOpen)
    && !(f.signalSent && (!f.bellHung||!f.ladleTaken||!f.rescueBriefed)) && !(f.ropeThrown&&!f.signalSent)
    && !(f.finaleStarted&&(!f.prygDeparted||s.scene!=='home')) && !(f.ladleWashed&&!f.finaleStarted)
    && !(f.finaleComplete&&(!f.evening||!f.ladleWashed||!s.seenBlocks.includes('finale/greeting')))
    && !(s.inventory.includes('rod')&&(!f.rodGranted||f.bellRetrieved))
    && !(s.inventory.includes('bell')&&(!f.bellRetrieved||f.bellHung))
    && !(s.inventory.includes('ladle')&&(!f.ladleTaken||f.ladleWashed));
}
export function readSave(storage,key=SAVE_KEY,options={}) {
  let raw;
  try {raw=storage.getItem(key);}catch{return {state:null,error:'unavailable'};}
  if(!raw)return {state:null};
  try {const s=JSON.parse(raw);return validState(s,options)?{state:s}:{state:null,error:'invalid'};}catch{return {state:null,error:'invalid'};}
}
export function writeSave(storage,s,key=SAVE_KEY) {try {storage.setItem(key,JSON.stringify(s));return true;}catch{return false;}}
