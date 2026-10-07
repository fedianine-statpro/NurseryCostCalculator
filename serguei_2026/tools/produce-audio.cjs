/* Offline production only. Real CC0 instrument/foley recordings; no runtime synthesis.
 * node tools/produce-audio.cjs <source-cache-directory> <ffmpeg.exe>
 * Source cache contains the downloads documented in assets/audio/LICENSES.md. */
const fs=require('fs'),path=require('path'),cp=require('child_process'),crypto=require('crypto');
const root=path.resolve(__dirname,'..'),work=path.resolve(process.argv[2]||path.join(process.env.TEMP,'sergey-sound-production'));
const ffmpeg=process.argv[3]||path.join(process.env.TEMP,'sergey-audio-tools/node_modules/ffmpeg-static/ffmpeg.exe');
const rate=44100,raw=path.join(work,'masters');fs.mkdirSync(raw,{recursive:true});
let seed=195570;function random(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;}
const note=n=>{const m=/^([A-G])(#?)(\d)$/.exec(n);return (Number(m[3])+1)*12+{C:0,D:2,E:4,F:5,G:7,A:9,B:11}[m[1]]+(m[2]?1:0);};
const instruments={piano:[],guitar:[],harp:[],pizz:[],strings:[],wood:[],hand:[]};
const originalSources=[];
function ff(args){return cp.execFileSync(ffmpeg,['-hide_banner','-y',...args],{maxBuffer:160*1024*1024,stdio:['ignore','pipe','pipe']});}
async function download(url,file){
  fs.mkdirSync(path.dirname(file),{recursive:true});if(fs.existsSync(file))return;
  const response=await fetch(url);if(!response.ok)throw new Error(`${response.status}: ${url}`);fs.writeFileSync(file,Buffer.from(await response.arrayBuffer()));
}
function decode(file,filter=''){
  const data=ff(['-i',file,...(filter?['-af',filter]:[]),'-ar',String(rate),'-ac','2','-f','f32le','pipe:1']);
  return new Float32Array(data.buffer.slice(data.byteOffset,data.byteOffset+data.byteLength));
}
function peak(data){let value=0;for(const sample of data)value=Math.max(value,Math.abs(sample));return value;}
function sample(file,midi,instrument){
  const data=decode(file,instrument==='piano'?'highpass=f=45,lowpass=f=3900':instrument==='strings'?'highpass=f=100,lowpass=f=5000':'highpass=f=45,lowpass=f=7000');
  const p=peak(data);let onset=0;while(onset<data.length/2-1&&Math.max(Math.abs(data[onset*2]),Math.abs(data[onset*2+1]))<p*0.003)onset++;
  const trimmed=data.slice(Math.max(0,onset-220)*2);for(let i=0;i<trimmed.length;i++)trimmed[i]*=0.65/p;
  instruments[instrument].push({data:trimmed,midi,file});
}
function writeWav(file,data){
  const b=Buffer.alloc(44+data.length*4);b.write('RIFF');b.writeUInt32LE(b.length-8,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(3,20);b.writeUInt16LE(2,22);b.writeUInt32LE(rate,24);b.writeUInt32LE(rate*8,28);b.writeUInt16LE(8,32);b.writeUInt16LE(32,34);b.write('data',36);b.writeUInt32LE(data.length*4,40);
  Buffer.from(data.buffer,data.byteOffset,data.byteLength).copy(b,44);fs.writeFileSync(file,b);
}
function add(target,instrument,pitch,at,duration,velocity,pan=0){
  const midi=typeof pitch==='number'?pitch:note(pitch),list=instruments[instrument];
  const distance=Math.min(...list.map(s=>Math.abs(s.midi-midi))),choices=list.filter(s=>Math.abs(s.midi-midi)===distance),source=choices[Math.floor(random()*choices.length)];
  const playback=2**((midi-source.midi)/12),count=Math.min(Math.ceil(duration*rate),Math.floor((source.data.length/2-1)/playback));
  const frames=target.length/2,start=Math.round(at*rate),left=Math.cos((pan+1)*Math.PI/4),right=Math.sin((pan+1)*Math.PI/4);
  const attack=instrument==='strings'?0.5:0.006,release=instrument==='strings'?0.7:Math.min(0.32,duration*0.25);
  for(let i=0;i<count;i++){
    const position=i*playback,k=Math.floor(position)*2,fraction=position-Math.floor(position);
    const env=Math.min(1,i/(attack*rate))*Math.min(1,(count-i)/(release*rate));
    const destination=((start+i)%frames+frames)%frames*2;
    target[destination]+=(source.data[k]*(1-fraction)+source.data[k+2]*fraction)*velocity*env*left;
    target[destination+1]+=(source.data[k+1]*(1-fraction)+source.data[k+3]*fraction)*velocity*env*right;
  }
}
function roomReverb(data,wet=0.1){
  const dry=new Float32Array(data),frames=data.length/2;
  for(const [time,gain] of [[.037,.26],[.061,.23],[.103,.18],[.149,.14],[.223,.12],[.307,.10],[.443,.08],[.601,.06],[.827,.04],[1.119,.03]]){
    const delay=Math.round(time*rate);
    for(let i=0;i<frames;i++){const dest=(i+delay)%frames;data[dest*2]+=dry[i*2+1]*gain*wet;data[dest*2+1]+=dry[i*2]*gain*wet;}
  }
}
function info(file){
  const result=cp.spawnSync(ffmpeg,['-hide_banner','-i',file,'-af','loudnorm=I=-23:TP=-4:LRA=11:print_format=json','-f','null','NUL'],{encoding:'utf8',maxBuffer:4*1024*1024});
  if(result.status!==0)throw new Error(result.stderr);
  return JSON.parse(result.stderr.match(/\{\s*"input_i"[\s\S]*?\}/)[0]);
}
const report={method:'Original deterministic scores rendered offline from recorded CC0 instruments, edited CC0 foley and field recordings. No oscillator beds or runtime synthesizer.',seed:195570,files:[]};
function encode(id,data,destination,target=-23,cap=-5,loop=false){
  const file=path.join(raw,id+'.wav');writeWav(file,data);
  const measured=info(file),inputI=Number(measured.input_i),inputPeak=Number(measured.input_tp),gain=Math.min(Number.isFinite(inputI)?target-inputI:0,cap-inputPeak);
  ff(['-i',file,'-af',`volume=${gain.toFixed(4)}dB`,'-ar',String(rate),'-c:a',destination.endsWith('.ogg')?'libvorbis':'pcm_s16le',...(destination.endsWith('.ogg')?['-q:a','3']:[]),path.join(root,destination)]);
  const final=decode(path.join(root,destination)),edge=Math.max(Math.abs(final[0]-final[final.length-2]),Math.abs(final[1]-final[final.length-1]));
  const result={id,src:destination,duration:final.length/2/rate,peakDb:20*Math.log10(peak(final)),loop,edgeStep:loop?edge:undefined,integratedLUFS:Number.isFinite(inputI)?inputI+gain:null,sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(root,destination))).digest('hex')};
  report.files.push(result);console.log(`${id}: ${result.duration.toFixed(2)}s, ${result.integratedLUFS===null?'short one-shot':result.integratedLUFS.toFixed(1)+' LUFS'}, ${result.peakDb.toFixed(1)} dBFS`);
}
async function loadInstruments(){
  const tree=JSON.parse(fs.readFileSync(path.join(work,'vsco-tree.json'),'utf8')),sha=tree.sha;
  const chosen=tree.tree.filter(entry=>
    /Keys\/Upright Nr1\/UR1_(C3|G3|C4|G4|C5)_pp_RR[12]\.wav$/.test(entry.path)||
    /Strings\/Harp\/KSHarp_(D4|A4|B3|C3|G3|F4|E3)_mf\.wav$/.test(entry.path)||
    /Strings\/Cello Section\/pizzT\/pizzT_(D2|A2|E3|C3)_v1_RR[12]\.wav$/.test(entry.path)||
    /Strings\/Violin Section\/susVib\/VlnEns_susVib_(D3|F#3|A3|C4|G4)_v1\.wav$/.test(entry.path)||
    /Percussion\/(Claves1_Hit_v1_rr[12]_Sum|Conga-Tap1_v1_rr[12]_Sum)\.wav$/.test(entry.path));
  const queue=chosen.slice();await Promise.all(Array.from({length:4},async()=>{while(queue.length){const entry=queue.shift();const url=`https://raw.githubusercontent.com/sgossner/VSCO-2-CE/${sha}/${entry.path.split('/').map(encodeURIComponent).join('/')}`;await download(url,path.join(work,'vsco',entry.path));originalSources.push({library:'VSCO 2 CE',path:entry.path,url,licence:'CC0-1.0'});}}));
  await download(`https://raw.githubusercontent.com/sgossner/VSCO-2-CE/${sha}/LICENSE`,path.join(work,'vsco','LICENSE'));
  for(const entry of chosen){
    const file=path.join(work,'vsco',entry.path),name=path.basename(entry.path);let instrument,pitch;
    if(name.startsWith('UR1_')){instrument='piano';pitch=name.split('_')[1];}
    else if(name.startsWith('KSHarp_')){instrument='harp';pitch=name.split('_')[1];}
    else if(name.startsWith('pizzT_')){instrument='pizz';pitch=name.split('_')[1];}
    else if(name.startsWith('VlnEns_')){instrument='strings';pitch=name.split('_')[2];}
    else{instrument=name.startsWith('Claves')?'wood':'hand';pitch='C4';}
    sample(file,note(pitch),instrument);
  }
  const guitar=path.join(work,'SpanishClassicalGuitar-SFZ+FLAC-20190618','samples');
  for(const file of fs.readdirSync(guitar).filter(file=>/^[A-G]#?[2345]\.flac$/.test(file)))sample(path.join(guitar,file),note(path.basename(file,'.flac')),'guitar');
  fs.writeFileSync(path.join(work,'downloaded-instruments.json'),JSON.stringify(originalSources,null,2));
}
const themes=[
  ['archive-theme',64,4,16,'piano','guitar',.10],['childhood-theme',72,4,20,'harp','guitar',.07],
  ['ledger-theme',68,4,20,'piano','pizz',.025],['army-theme',64,4,16,'guitar',null,.07],
  ['wedding-theme',66,3,24,'piano','guitar',.13],['cuba-theme',76,4,24,'guitar','hand',.055],
  ['canada-sparse',64,4,20,'piano',null,.07],['home-theme',64,4,20,'guitar','piano',.10],
  ['finale-theme',64,4,20,'piano','guitar',.15]
];
const harmonies=[['D3','A3','F#4'],['D3','A3','E4'],['G3','B3','D4'],['G3','A3','D4'],['B2','F#3','D4'],['G3','B3','D4'],['A2','E3','C#4'],['D3','A3','F#4']];
function compose([id,bpm,beats,bars,lead,accompaniment,reverb]){
  const beat=60/bpm,total=beats*bars*beat,data=new Float32Array(Math.round(total*rate)*2),events=[];
  const play=(instrument,pitch,bar,position,duration,velocity,pan=0)=>{
    const time=(bar*beats+position)*beat+0.025+(random()-.5)*.025;
    const loud=velocity*(.88+random()*.22);add(data,instrument,pitch,time,duration*beat,loud,pan);
    events.push({instrument,pitch,time:+time.toFixed(3),seconds:+(duration*beat).toFixed(3),velocity:+loud.toFixed(3)});
  };
  if(id==='canada-sparse'){
    for(const [bar,pitch]of [[0,'D4'],[4,'F#4'],[9,'D4'],[13,'A3'],[17,'D4']])play('piano',pitch,bar,.3,3,.24,0);
  }else{
    for(let bar=0;bar<bars;bar++){
      const chord=harmonies[Math.floor(bar/2)%8],section=bar%8;
      if(accompaniment==='guitar'){
        play('guitar',chord[0],bar,.1,2.6,.105,-.2);
        if(section!==7)play('guitar',chord[1],bar,beats===3?1.35:2.2,1.6,.09,.12);
        if(id==='wedding-theme'&&bar%2===0)play('guitar',chord[2],bar,2.1,.9,.065,.15);
      }
      if(accompaniment==='piano'&&bar%2===0){play('piano',chord[0],bar,.15,3.2,.10,-.22);play('piano',chord[1],bar,.19,2.8,.06,.15);}
      if(accompaniment==='pizz'){
        play('pizz',chord[0],bar,.1,.7,.09,-.2);
        if(section<6)play('pizz',chord[1],bar,2.15,.6,.065,.1);
      }
      if(id==='army-theme'&&bar%2===0)play('guitar',chord[0],bar,.1,3,.085,-.1);
      if(id==='cuba-theme'){
        if(section<6){play('guitar',chord[0],bar,.1,1.8,.12,-.2);play('guitar',chord[1],bar,1.75,1.5,.08,.15);play('guitar',chord[2],bar,3.25,.7,.06,.1);}
        if(bar%2===0){play('hand','C4',bar,1.4,.35,.025,0);play('hand','C4',bar,3.35,.3,.018,.1);}
      }
      if(id==='childhood-theme'&&bar%4===2)play('wood','C4',bar,2.5,.25,.022,-.15);
      if(id==='finale-theme'&&bar%4===0){play('strings',chord[1],bar,.3,4,.045,.1);play('piano',chord[0],bar,.1,3,.1,-.2);}
      // Shared theme once per eight-bar phrase, followed by breathing room and a small answer.
      const phrase=[['D4',0,.2],['A4',0,beats*.62],['F#4',1,.15],['E4',1,beats*.65],['D4',2,.2],['B3',3,.2],['A3',3,beats*.40],['D4',3,beats*.78]];
      if(section<4)for(const[pitch,b,p]of phrase)if(b===section)play(lead,pitch,bar,p,pitch==='D4'?1.6:.85,id==='army-theme'?.22:.20,.06);
      if(section===5){play(lead,'F#4',bar,.7,1.3,.12,.08);play(lead,'E4',bar,beats*.73,.9,.10,.06);}
      if(section===6)play(lead,'D4',bar,1.15,1.7,.13,.02);
    }
  }
  roomReverb(data,reverb);encode(id,data,`assets/audio/music/${id}.ogg`,id==='canada-sparse'?-27:-23,-6,true);
  fs.writeFileSync(path.join(raw,id+'-score.json'),JSON.stringify({id,bpm,beats,bars,duration:total,motif:'D4 A4 F#4 E4 / D4 B3 A3 D4',events},null,2));
}
function resample(data,speed){const result=new Float32Array(Math.floor(data.length/2/speed)*2);for(let i=0;i<result.length/2;i++){const p=i*speed,k=Math.floor(p)*2,f=p-Math.floor(p);result[i*2]=data[k]*(1-f)+(data[k+2]||0)*f;result[i*2+1]=data[k+1]*(1-f)+(data[k+3]||0)*f;}return result;}
function edit(file,duration,{start=0,speed=1,filter='',relative=1}={}){
  const selected=resample(decode(file,filter),speed).slice(Math.round(start*rate)*2,Math.round((start+duration)*rate)*2);
  const data=new Float32Array(Math.round(duration*rate)*2);data.set(selected);
  const p=peak(data);if(p===0)throw new Error('Silent source '+file);
  for(let i=0;i<data.length/2;i++){const fade=Math.min(1,i/Math.round(.004*rate),(data.length/2-i)/Math.round(.045*rate));data[i*2]*=fade*relative/p;data[i*2+1]*=fade*relative/p;}
  return data;
}
function foley(){
  const rpg=name=>path.join(work,'kenney-rpg','OGG',name+'.ogg'),impact=name=>path.join(work,'impact','Audio',name+'.ogg');
  const definitions=[
    ['page-a',rpg('bookFlip1'),.65,{}],['page-b',rpg('bookFlip2'),.62,{speed:.94}],
    ['folder-a',rpg('bookOpen'),.75,{filter:'lowpass=f=6500'}],['folder-b',rpg('bookOpen'),.8,{speed:.90,filter:'lowpass=f=5200'}],
    ['document-slide',rpg('bookFlip3'),.6,{speed:.85,filter:'highpass=f=180,lowpass=f=6200'}],
    ['photo-place',rpg('handleSmallLeather'),.35,{filter:'highpass=f=200,lowpass=f=4500'}],
    ['chess-place',impact('impactWood_light_000'),.25,{filter:'highpass=f=150,lowpass=f=2300'}],
    ['stamp-a',impact('impactSoft_medium_000'),.30,{filter:'highpass=f=100,lowpass=f=3000'}],
    ['stamp-b',impact('impactSoft_medium_001'),.30,{filter:'highpass=f=100,lowpass=f=3000'}],
    ['stamp-official',impact('impactSoft_heavy_000'),.4,{filter:'highpass=f=100,lowpass=f=2600'}],
    ['flower-folder',rpg('handleSmallLeather2'),.65,{speed:.9,filter:'highpass=f=100,lowpass=f=6200'}],
    ['ledger-drop',rpg('bookPlace1'),.30,{speed:.88,filter:'highpass=f=85,lowpass=f=2600'}],
    ['pencil-correction',path.join(work,'pencil','flac','pencil_write.flac'),.6,{start:.08,filter:'highpass=f=300,lowpass=f=7200'}],
    ['measure-tape',rpg('beltHandle2'),.8,{speed:.9,filter:'highpass=f=120,lowpass=f=4800'}],
    ['water-plop',path.join(work,'splash.wav'),.35,{start:.55,filter:'highpass=f=130,lowpass=f=5000'}],
    ['recorder-start',rpg('metalClick'),.2,{filter:'highpass=f=250,lowpass=f=2000'}],
    ['recorder-stop',rpg('metalLatch'),.2,{filter:'highpass=f=250,lowpass=f=2000'}]
  ];
  report.effects=[];
  for(const[id,file,duration,options]of definitions){
    const data=edit(file,duration,options),layers=[];
    if(id.startsWith('folder-')){
      const paper=edit(rpg(id==='folder-a'?'bookFlip1':'bookFlip2'),.55,{relative:.27,filter:'highpass=f=160,lowpass=f=5500'}),offset=Math.round(.11*rate)*2;
      for(let i=0;i<paper.length&&i+offset<data.length;i++)data[i+offset]+=paper[i];layers.push({original:'kenney-rpg/OGG/'+(id==='folder-a'?'bookFlip1':'bookFlip2')+'.ogg',offset:.11,gain:.27});
    }
    encode(id,data,`assets/audio/effects/${id}.wav`,-29,-12);report.effects.push({id,original:path.relative(work,file),options,layers});
  }
  const warm=new Float32Array(Math.round(1.4*rate)*2);
  add(warm,'guitar','D4',.025,1.3,.13,-.1);add(warm,'piano','F#4',.10,1.2,.07,.1);add(warm,'piano','A4',.12,1.15,.05,.05);
  // One-shot resolution has a normal tail, not a wrapping loop.
  for(let i=0;i<warm.length/2;i++){const fade=Math.min(1,(warm.length/2-i)/(.18*rate));warm[i*2]*=fade;warm[i*2+1]*=fade;}
  encode('irina-resolution',warm,'assets/audio/effects/irina-resolution.wav',-27,-12);
}
function ambientLoop(file,start,duration,filter,crossfade=2){
  let decoded=decode(file,filter);const startFrame=Math.round(start*rate),frames=Math.round((duration+crossfade)*rate),fade=Math.round(crossfade*rate);
  if(decoded.length/2<startFrame+frames){
    // First make the short field recording itself seamless, then extend that cycle.
    const cycle=decoded.slice(fade*2);
    for(let i=0;i<fade;i++){const theta=i/(fade-1)*Math.PI/2,pos=(cycle.length/2-fade+i)*2;for(let c=0;c<2;c++)cycle[pos+c]=cycle[pos+c]*Math.cos(theta)+decoded[i*2+c]*Math.sin(theta);}
    decoded=cycle;
  }
  const source=new Float32Array(frames*2);for(let i=0;i<frames;i++){const pos=(startFrame+i)%(decoded.length/2);source[i*2]=decoded[pos*2];source[i*2+1]=decoded[pos*2+1];}
  const out=source.slice(fade*2); // Join the preceding tail to the lead-in; loop has no fade to silence.
  for(let i=0;i<fade;i++){const theta=i/(fade-1)*Math.PI/2,pos=(out.length/2-fade+i)*2;for(let c=0;c<2;c++)out[pos+c]=out[pos+c]*Math.cos(theta)+source[i*2+c]*Math.sin(theta);}
  return out;
}
function ambience(){
  const room=ambientLoop(path.join(work,'quiet-room-source.mp3'),.1,60,'highpass=f=120,lowpass=f=2000',2);
  encode('quiet-room',room,'assets/audio/ambience/quiet-room.ogg',-36,-14,true);
  const lake=ambientLoop(path.join(work,'river.mp3'),45,60,'highpass=f=100,lowpass=f=5000',3);
  encode('lake-air',lake,'assets/audio/ambience/lake-air.ogg',-31,-14,true);
}
(async()=>{
  await loadInstruments();
  for(const theme of themes)compose(theme);
  foley();ambience();
  fs.writeFileSync(path.join(root,'assets/audio/production-report.json'),JSON.stringify(report,null,2)+'\n');
  console.log(`Produced ${report.files.length} local assets. Lossless sources and scores: ${raw}`);
})().catch(error=>{console.error(error.stderr?.toString()||error);process.exitCode=1;});
