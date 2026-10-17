import {mkdirSync,writeFileSync} from 'node:fs';
import {SCRIPT,OPTIONAL,BENCH_LINES,DECISIONS,HINTS} from '../js/script.js';
import {CONFIG} from '../js/config.js';
import {VOICE_PROFILES,recordingId} from '../js/voice-plan.js';

const records=new Map();
function add(speaker,text,context){
 if(speaker==='Game'||!/[a-z]/i.test(text))return;
 if(speaker==='Partner'){for(const name of ['Anya','Alisa','Arisha'])add(name,text,context+' / '+name+' chosen');return;}
 if(text.includes('{hatExamine}')){for(const [kind,reward]of Object.entries(CONFIG.rewards))add(speaker,text.replaceAll('{hatExamine}',reward.examine),context+' / '+kind+' reward');return;}
 text=text.replaceAll('{handle}','freakybat');const id=recordingId(speaker,text);
 if(records.has(id)){records.get(id).contexts.add(context);return;}
 records.set(id,{id,speaker,text,contexts:new Set([context])});
}
function walk(value,path){if(typeof value==='string'){const split=value.indexOf('|');if(split>=0)add(value.slice(0,split),value.slice(split+1),path);}else if(value&&typeof value==='object')for(const [key,item]of Object.entries(value))walk(item,path+'.'+key);}
walk(SCRIPT,'SCRIPT');
walk(OPTIONAL,'OPTIONAL');walk(BENCH_LINES,'BENCH_LINES');walk(DECISIONS,'DECISIONS');walk(HINTS,'HINTS');
add('Victor',CONFIG.letter.join(' '),'Final letter — record as one continuous clip');
mkdirSync('recording-scripts',{recursive:true});mkdirSync('assets/voices',{recursive:true});
const manifest=[...records.values()].map(r=>({...r,contexts:[...r.contexts],file:`assets/voices/${r.speaker.toLowerCase()}/${r.id}.mp3`,silent:r.speaker==='Rock'}));
writeFileSync('recording-scripts/lines.json',JSON.stringify(manifest,null,2)+'\n');
for(const [speaker,profile]of Object.entries(VOICE_PROFILES)){
 const lines=manifest.filter(r=>r.speaker===speaker);
 const body=[`# ${speaker} — recording script`,'',profile.direction,'',`**${lines.length} unique ${lines.length===1?'line':'lines'}.** Read only the quoted dialogue. Context and filenames are instructions. Repeated lines need only one recording.`, '', 'Record clean, dry speech in English. Leave a little silence at each end; avoid background music. Keep a consistent microphone distance. You may keep WAV masters; export the game clips as MP3 with the exact filenames below.', '', 'Browser voices are a temporary preview. Your recording replaces a line when its ID is added to `js/recordings.js`. Missing clips continue to use browser speech.',''];
 if(speaker==='Rock')body.push('**No audio to record.** The rock stays silent. The ellipsis below is a visual pause.','');
 for(const [i,line]of lines.entries())body.push(`## ${i+1}. ${line.id}`,'',`Context: ${line.contexts.join('; ')}`,'',`File: \`${line.file}\``,'',...line.text.split('\n').map(t=>'> '+t),'');
 if(!lines.length)body.push('This character currently has no spoken lines. No recording is required.','');
 writeFileSync(`recording-scripts/${speaker}.md`,body.join('\n'));
}
writeFileSync('recording-scripts/README.md',[
 '# Character recording scripts','',
 'One document per character for Please Stop Farming Me, story version 4. The scripts include main scenes, all decision branches, optional interactions, hints, and Victor’s final letter. System messages and player choice labels are not spoken. Characters with no current lines need no recording.','',
 ...Object.keys(VOICE_PROFILES).map(name=>`- [${name}](${name}.md)`),'',
 '## Replace browser voices with your recordings','',
 '1. Record each quoted line separately. Keep the exact ID/filename. Victor’s letter is one continuous recording.',
 '2. Place exported clips in the indicated `assets/voices/<character>/` folder.',
 '3. Add each finished clip to `RECORDINGS` in `js/recordings.js`, using the ID as its key and the game-relative path as its value.',
 '4. Enable Sound and Character voices in game settings. Recorded clips take priority; unrecorded lines use browser voices.',
 '', 'Example (replace with a real ID from your document):','',
 '```js',"export const RECORDINGS = {", "  'victor-12345678': 'assets/voices/victor/victor-12345678.mp3',",'};','```','',
 'No backend or API key is needed. Upload the MP3 files with the rest of the static site to GitHub Pages. Browser voices depend on the player’s browser and installed voices; some systems use an online speech service. Text always remains visible.', '',
 'After dialogue changes, run `node tools/build-recording-scripts.mjs`. Unchanged lines keep their IDs. `lines.json` is the full checklist; it is not loaded by the game. The alternate toldo handle only occurs in unvoiced system messages.', ''
].join('\n'));
console.log(`Generated ${Object.keys(VOICE_PROFILES).length} character documents and ${manifest.length} unique lines.`);
