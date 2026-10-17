import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {SCRIPT,HINTS} from '../js/script.js';
import {CONFIG} from '../js/config.js';
import {recordingId} from '../js/voice-plan.js';
import {browserSession} from './browser-session.mjs';
const out='recording-scripts/Victor-Recording-Guide';
const text=line=>line.slice(line.indexOf('|')+1);
const make=(line,title,cue,direction)=>({text:text(line),title,cue,direction});
const clips=[
 make(SCRIPT.bounty_intro[5],'The announcement',SCRIPT.bounty_intro[4],'A small, rueful admission. You meant well; do not sound devastated.'),
 make(SCRIPT.bounty_intro[7],'Read the poster',SCRIPT.bounty_intro[6],'Read it as a confidently written announcement. Separate the four short sentences. Say 195 as “one hundred and ninety-five”; do not say “quote” or “unquote”.'),
 make(SCRIPT.bounty_intro[9],'Partyhat covered it',SCRIPT.bounty_intro[8],'A perfectly reasonable explanation, as far as you are concerned. Lightly stress “partyhat”; let the joke stand.'),
 make(SCRIPT.bounty_plan[4],'The banker accepts Toldo',SCRIPT.bounty_plan[3],'Start a sensible objection and leave the thought unfinished. The banker interrupts after “him”; do not add words.'),
 make(SCRIPT.reunion_victor[0],'Happy birthday',SCRIPT.reunion_family.at(-1),'Warm and direct, addressed to your friend. This is a real birthday wish.'),
 make(SCRIPT.callbacks.money[0],'Money callback — question','Earlier, Andrey claimed: “Someone else can pay.”','Friendly teasing. You are checking whether his invented identity is still in effect.'),
 make(SCRIPT.callbacks.money[2],'Money callback — welcome back',SCRIPT.callbacks.money[1],'Quietly amused and affectionate. His insistence on paying tells you the real Andrey is back.'),
 make(SCRIPT.callbacks.outdoors[0],'Outdoors callback — question','Earlier, Andrey claimed: “I’d rather stay indoors this weekend.”','A gentle challenge, with a small smile in your voice.'),
 make(SCRIPT.callbacks.outdoors[2],'Outdoors callback — follow-up',SCRIPT.callbacks.outdoors[1],'Friendly suspicion about the word “short”. Keep it quick and natural.'),
 make(SCRIPT.callbacks.camera[0],'Camera callback — question','Earlier, Andrey claimed: “A phone is just as good as a DSLR.”','You know his love of photography. Curious, amused disbelief. Speak DSLR as the letters D-S-L-R.'),
 make(SCRIPT.callbacks.camera[2],'Camera callback — follow-up',SCRIPT.callbacks.camera[1],'A brief, genuinely sceptical question. Do not add a laugh or another word.'),
 make(HINTS.opening,'Early-visit hint','The player has wandered away before visiting the bank.','A useful invitation, mildly embarrassed about the poster. Keep it conversational.'),
 {text:CONFIG.letter.join(' '),paragraphs:CONFIG.letter,title:'Victor’s birthday letter',cue:'After the family reunion and quest completion. This is the sincere final message.',direction:'Use your own voice, speaking to Andrey. Slow down a little and leave room between paragraphs. No comic delivery or punchline. Read the final “Victor” as a quiet sign-off.'}
].map((c,i)=>({...c,number:i+1,id:recordingId('Victor',c.text),filename:recordingId('Victor',c.text)+'.mp3'}));
const manifest=JSON.parse(readFileSync('recording-scripts/lines.json','utf8')).filter(l=>l.speaker==='Victor');
assert.equal(clips.length,13);assert.deepEqual(clips.map(c=>c.id).sort(),manifest.map(c=>c.id).sort());
for(const c of clips)assert.equal(c.text,manifest.find(m=>m.id===c.id).text);
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const intro=[
 ['h1','Victor — voice recording guide'],
 ['sub','Please Stop Farming Me · Canonical story v4'],
 ['p','Record 13 clips: 12 short lines and one continuous birthday letter. This packet includes every Victor line currently used by the game, including all three possible ending callbacks.'],
 ['h2','Sound like yourself'],
 ['p','Speak as a familiar friend talking to Andrey: relaxed, quick, warm and occasionally amused. Keep the jokes understated. Use your natural accent and your usual pronunciation of everyone’s names. Do not imitate the temporary browser voice.'],
 ['h2','Before you start'],
 ['p','Choose a quiet room with soft furnishings. Keep the phone or microphone at a consistent distance, slightly to one side of your mouth. Make a short test and listen for room noise, distortion and breath hitting the microphone.'],
 ['p','Record without music, reverb or voice effects. Leave about a second of silence before and after each raw take so it can be trimmed later. Keep the microphone position and recording level consistent.'],
 ['h2','What to read'],
 ['p','Read only the text marked RECORD. Cues, delivery notes, clip numbers and filenames are instructions, not spoken dialogue. Keep the wording exactly as printed. Record two natural takes of each short line if convenient; one strong take is enough for the letter.'],
 ['h2','How to send the recordings'],
 ['p','Option A: record each clip separately and use the filename printed below it. The game uses MP3 files; keep a WAV or original phone-recording master if available.'],
 ['p','Option B: make one continuous recording in clip order. Say the clip number, pause, then read the line. Leave a clear gap between takes. Send the original file; clips can be split and prepared afterwards.'],
 ['note','Record all callback lines (clips 6–11). Only one of the three pairs plays in a particular playthrough, depending on the player’s earlier choice.'],
 ['note','Pronunciation: “Freakybat” = “Freaky bat”; “partyhat” = “party hat”; DSLR = D-S-L-R. Clip 2’s 195 is “one hundred and ninety-five”.'],
 ['p','Use the take boxes to mark your preferred performance. The filename matters when exporting individual clips, not while you are reading.']
];
const pages=[
 {title:'Start here',blocks:intro},
 {title:'At the bank',clips:clips.slice(0,3),lead:'Andrey’s birthday poster has accidentally advertised him as a boss encounter. You wrote it; the banker is taking the wording literally.'},
 {title:'The alias and the family reunion',clips:clips.slice(3,7),lead:'Clip 4 is the objection at the bank. Later, at the shore, clip 5 is your birthday wish. Clips 6–7 are the money cover-story callback.'},
 {title:'The other ending callbacks',clips:clips.slice(7,11),lead:'Clips 8–9 are the outdoors callback; 10–11 are the camera callback. Record both pairs, even though the player hears only one callback pair in a particular playthrough.'},
 {title:'Early-visit hint and checklist',clips:clips.slice(11,12),checklist:true,lead:'This line directs the player to the bank if they visit somewhere else before the story begins.'},
 {title:'The birthday letter',clips:clips.slice(12),lead:'Record this entire page’s RECORD text as one continuous clip. The paragraph breaks are breathing space, not separate files.'}
];
function cue(c){const i=c.cue.indexOf('|');return i<0?c.cue:c.cue.slice(0,i)+': '+c.cue.slice(i+1);}
const card=c=>'<article class="clip" data-recording-id="'+c.id+'"><h2>'+String(c.number).padStart(2,'0')+' · '+esc(c.title)+'</h2><p class="cue">CUE — '+esc(cue(c))+'</p><p class="record-label">RECORD</p>'+ (c.paragraphs?'<div class="letter">'+c.paragraphs.map(p=>'<p>'+esc(p)+'</p>').join('')+'</div>':'<blockquote>'+esc(c.text)+'</blockquote>')+'<p class="direction">'+esc(c.direction)+'</p><p class="filename">'+esc(c.filename)+'</p><p class="takes">[ ] Take 1 &nbsp; [ ] Take 2 &nbsp; Preferred: __________</p></article>';
const html='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><link rel="icon" href="../assets/favicon.svg"><title>Victor — voice recording guide</title><style>'+
'@page{size:A4;margin:16mm}*{box-sizing:border-box}body{margin:0;background:#e8e9e5;color:#282b25;font:14px/1.45 Arial,sans-serif}.page{width:210mm;min-height:297mm;margin:20px auto;padding:16mm;background:#fff;display:flex;flex-direction:column;box-shadow:0 3px 20px #0002}.page>header{color:#68725e;border-bottom:2px solid #bdab7b;padding-bottom:8px;font-size:11px;letter-spacing:1px}h1{font-size:28px;line-height:1.15;color:#34432e;margin:18px 0 10px}h2{font-size:16px;color:#42513a;margin:17px 0 6px}p{margin:0 0 10px}.sub{color:#6d725f;font-size:14px}.lead{color:#555e4c;margin:8px 0 16px}.note{padding:9px 12px;background:#f3f2e9;border-left:3px solid #b4a274;font-size:12px}.clip{break-inside:avoid;margin:0 0 9px;padding:0 0 8px;border-bottom:1px solid #d9ddcf}.clip h2{margin-top:10px}.cue{font-size:12px;color:#656b5e;margin-bottom:7px}.record-label{font-size:9px;font-weight:bold;letter-spacing:1.5px;color:#526246;margin-bottom:3px}blockquote{font-size:21px;line-height:1.3;font-weight:bold;border-left:3px solid #b4a274;padding:5px 0 5px 12px;margin:0 0 8px}.direction{font-size:12px;color:#4e5845;margin-bottom:6px}.filename{font:11px Consolas,monospace;color:#5d6256;margin-bottom:5px}.takes{font-size:11px;color:#6c7266;margin-bottom:0}.letter{font:18px/1.5 Georgia,serif;margin:7px 0 20px}.letter p{margin-bottom:17px}.page>footer{margin-top:auto;padding-top:12px;color:#737969;font-size:10px}.end{font-size:12px;color:#536046}@media print{body{background:#fff}.page{width:auto;min-height:264mm;padding:0;margin:0;box-shadow:none;break-after:page}.page:last-child{break-after:auto}}'+
'</style></head><body>'+pages.map((p,i)=>'<section class="page"><header>FREAKYBAT · PLEASE STOP FARMING ME · VICTOR</header>'+(p.blocks?p.blocks.map(([style,t])=>style==='h1'?'<h1>'+esc(t)+'</h1>':style==='h2'?'<h2>'+esc(t)+'</h2>':'<p class="'+style+'">'+esc(t)+'</p>').join(''):'<h1>'+esc(p.title)+'</h1><p class="lead">'+esc(p.lead)+'</p>'+p.clips.map(card).join('')+(p.checklist?'<h2>Recording checklist</h2><p class="cue">Tick each clip when you have a usable take. Clip 13 is on the next page.</p>'+clips.map(c=>'<p class="filename">[ ] '+String(c.number).padStart(2,'0')+' · '+esc(c.filename)+'</p>').join('')+'<p class="direction">Send the original recordings and note your preferred takes. Individual game clips will go in assets/voices/victor/; the game author can prepare and connect them.</p>':''))+(i===pages.length-1?'<p class="end">End here. Leave a little silence after the sign-off. No extra joke or line.</p>':'')+'<footer>Story v4 · 13 clips · Read only RECORD text · '+(i+1)+' / '+pages.length+'</footer></section>').join('')+'</body></html>';
writeFileSync(out+'.html',html);
// A small dependency-free Word package; all dialogue comes from the same clip data as the PDF.
const p=(style,t)=>'<w:p><w:pPr><w:pStyle w:val="'+style+'"/></w:pPr><w:r><w:t xml:space="preserve">'+esc(t)+'</w:t></w:r></w:p>';
let body='';
for(const [i,page]of pages.entries()){
 if(i)body+='<w:p><w:r><w:br w:type="page"/></w:r></w:p>';
 body+=p('Header','FREAKYBAT · PLEASE STOP FARMING ME · VICTOR');
 if(page.blocks)for(const [style,t]of page.blocks)body+=p(({h1:'Title',h2:'Heading2',sub:'Subtitle',p:'Normal',note:'Note'})[style],t);
 else{body+=p('Title',page.title)+p('Cue',page.lead);for(const c of page.clips){body+=p('Heading2',String(c.number).padStart(2,'0')+' · '+c.title)+p('Cue','CUE — '+cue(c))+p('Label','RECORD');for(const t of c.paragraphs??[c.text])body+=p(c.paragraphs?'Letter':'Dialogue',t);body+=p('Note',c.direction)+p('Code',c.filename)+p('Cue','[ ] Take 1   [ ] Take 2   Preferred: __________');}}
 if(page.checklist){body+=p('Heading2','Recording checklist')+p('Cue','Tick each clip when you have a usable take. Clip 13 is on the next page.');for(const c of clips)body+=p('Code','[ ] '+String(c.number).padStart(2,'0')+' · '+c.filename);body+=p('Note','Send the original recordings and note your preferred takes. The game author can prepare and connect the individual clips.');}
 if(i===pages.length-1)body+=p('Note','End here. Leave a little silence after the sign-off. No extra joke or line.');
 body+=p('Footer','Story v4 · 13 clips · Read only RECORD text · '+(i+1)+' / '+pages.length);
}
const document='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'+body+'<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="900" w:right="900" w:bottom="900" w:left="900"/></w:sectPr></w:body></w:document>';
const style=(id,size,color,bold=false,extra='')=>'<w:style w:type="paragraph" w:styleId="'+id+'"><w:name w:val="'+id+'"/><w:basedOn w:val="Normal"/><w:pPr><w:spacing w:after="'+(id==='Dialogue'?120:80)+'"/>'+extra+'</w:pPr><w:rPr><w:color w:val="'+color+'"/><w:sz w:val="'+size+'"/>'+(bold?'<w:b/>':'')+'</w:rPr></w:style>';
const styles='<?xml version="1.0" encoding="UTF-8"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:sz w:val="21"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="100" w:line="260" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>'+style('Title',44,'34432E',true,'<w:keepNext/>')+style('Heading2',25,'42513A',true,'<w:keepNext/>')+style('Subtitle',24,'6D725F')+style('Header',17,'68725E')+style('Cue',18,'656B5E')+style('Label',16,'526246',true,'<w:keepNext/>')+style('Dialogue',29,'282B25',true)+style('Letter',26,'282B25')+style('Note',19,'4E5845')+style('Code',18,'5D6256')+style('Footer',16,'737969')+'</w:styles>';
const files={
 '[Content_Types].xml':'<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>',
 '_rels/.rels':'<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>',
 'word/document.xml':document,'word/styles.xml':styles,
 'word/_rels/document.xml.rels':'<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>'
};
function crc32(bytes){let crc=0xffffffff;for(const b of bytes){crc^=b;for(let n=0;n<8;n++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}return (crc^0xffffffff)>>>0;}
const local=[],central=[];let offset=0;
for(const [name,content]of Object.entries(files)){
 const n=Buffer.from(name),b=Buffer.from(content),crc=crc32(b),h=Buffer.alloc(30);h.writeUInt32LE(0x04034b50);h.writeUInt16LE(20,4);h.writeUInt16LE(0x800,6);h.writeUInt32LE(crc,14);h.writeUInt32LE(b.length,18);h.writeUInt32LE(b.length,22);h.writeUInt16LE(n.length,26);local.push(h,n,b);
 const c=Buffer.alloc(46);c.writeUInt32LE(0x02014b50);c.writeUInt16LE(20,4);c.writeUInt16LE(20,6);c.writeUInt16LE(0x800,8);c.writeUInt32LE(crc,16);c.writeUInt32LE(b.length,20);c.writeUInt32LE(b.length,24);c.writeUInt16LE(n.length,28);c.writeUInt32LE(offset,42);central.push(c,n);offset+=h.length+n.length+b.length;
}
const directory=Buffer.concat(central),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50);end.writeUInt16LE(Object.keys(files).length,8);end.writeUInt16LE(Object.keys(files).length,10);end.writeUInt32LE(directory.length,12);end.writeUInt32LE(offset,16);writeFileSync(out+'.docx',Buffer.concat([...local,directory,end]));
const session=await browserSession(9346);
try{
 await session.call('Emulation.setDeviceMetricsOverride',{width:1000,height:1400,deviceScaleFactor:1,mobile:false});
 await session.call('Page.navigate',{url:'http://127.0.0.1:8000/birthday/'+out+'.html'});await session.until('document.querySelectorAll(".clip").length===13');
 const pdf=await session.call('Page.printToPDF',{printBackground:true,preferCSSPageSize:true});const bytes=Buffer.from(pdf.data,'base64');writeFileSync(out+'.pdf',bytes);
 const pageCount=[...bytes.toString('latin1').matchAll(/\/Type\s*\/Page\b/g)].length;assert.equal(pageCount,pages.length,'Unexpected PDF overflow');
 for(const i of [0,1,2,3,4,5]){const box=await session.run(`(()=>{const r=document.querySelectorAll('.page')[${i}].getBoundingClientRect();return{x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:r.height,scale:1};})()`);const screen=await session.call('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:box});writeFileSync('test-results/victor-guide-page-'+(i+1)+'.png',Buffer.from(screen.data,'base64'));}
 console.log('Created PDF ('+pageCount+' pages), Word and printable HTML; all 13 current Victor clips match the recording manifest.');
}finally{await session.close();}



