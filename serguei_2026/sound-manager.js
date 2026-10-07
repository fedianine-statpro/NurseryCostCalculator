/* Local assets only. One owner for background sources, cues and family players. */
window.createArchiveSound = (manifest) => {
  'use strict';
  const key = 'sergey-archive-sound-v1';
  const defaults = {masterMuted:false,music:false,effects:true,recordings:true,musicVolume:0.22,effectsVolume:0.18,recordingVolume:0.85};
  let preferences = {...defaults};
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    for (const name of Object.keys(defaults)) {
      if (typeof saved?.[name] === typeof defaults[name]) preferences[name] = typeof defaults[name] === 'number' ? Math.max(0,Math.min(1,saved[name])) : saved[name];
    }
    // Apply the new default once to existing browsers; later explicit choices persist.
    if(saved?.musicDefaultVersion!==2){
      preferences.music=false;
      localStorage.setItem(key,JSON.stringify({...preferences,musicDefaultVersion:2}));
    }
  } catch (_) { /* Storage is optional. */ }
  let context, unlocked=false, foreground=null, scene=null, epoch=0, blocked=false;
  let lastEffect=-Infinity, variant=0, effectRequest=0;
  const cache=new Map(), failures=new Set(), players=new Map(), listeners=new Set(), timers=new Set();
  const layers={music:{current:null,outgoing:null,request:0,pending:null},ambient:{current:null,outgoing:null,request:0,pending:null}};
  const effects=new Set();
  const offsets=new Map();
  const quiet=new Set(['kindness','canada-start','canada-search','canada-persistence','canada-callback','apartment']);
  const clamp=value=>Math.max(0,Math.min(1,Number(value)||0));
  const persist=()=>{try{localStorage.setItem(key,JSON.stringify({...preferences,musicDefaultVersion:2}));}catch(_){}};
  function state() {
    return {preferences:{...preferences},unlocked,blocked,hidden:document.hidden,scene:scene?.id,foreground:foreground?.dataset.clip||null,
      playingMusic:context?.state==='running' && !document.hidden && !foreground && layers.music.current?.gain.gain.value>0.001 ? layers.music.current.id : null,
      availableMusic:Object.values(manifest.assets).some(asset=>asset.layer==='music' && asset.ready),
      failedAssets:[...failures],musicSources:Number(Boolean(layers.music.current))+Number(Boolean(layers.music.outgoing)),ambientSources:Number(Boolean(layers.ambient.current))+Number(Boolean(layers.ambient.outgoing)),effectSources:effects.size};
  }
  function notify(){listeners.forEach(listener=>listener(state()));}
  function ensureContext(){
    if(!context){const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return null;context=new Audio();context.addEventListener('statechange',()=>{
      if(unlocked&&!document.hidden&&context.state!=='running')blocked=true;
      notify();
    });}
    return context;
  }
  async function unlock(){
    unlocked=true;blocked=false;
    try{const ctx=ensureContext();if(ctx && ctx.state!=='running')await ctx.resume();if(ctx && ctx.state!=='running')blocked=true;}catch(_){blocked=true;}
    syncBeds();applyRecordingMute();notify();
    return !blocked;
  }
  function asset(id){const entry=manifest.assets[id];return entry?.ready ? entry : null;}
  async function buffer(id){
    if(!asset(id)||failures.has(id)||!ensureContext())return null;
    if(!cache.has(id))cache.set(id,(async()=>{
      try{
        const controller=new AbortController(), timeout=setTimeout(()=>controller.abort(),12000);
        let response;
        try{response=await fetch(asset(id).src,{signal:controller.signal});}finally{clearTimeout(timeout);}
        if(!response.ok)throw new Error('Missing audio');
        const decoded=await context.decodeAudioData(await response.arrayBuffer());
        // Keep only three decoded background beds. Sources retain their own buffer references.
        const beds=[...cache.keys()].filter(key=>manifest.assets[key].layer!=='effects');
        beds.slice(0,Math.max(0,beds.length-3)).forEach(key=>cache.delete(key));
        return decoded;
      }catch(_){failures.add(id);notify();return null;}
    })());
    return cache.get(id);
  }
  function ramp(gain,value,seconds){
    const now=context.currentTime;
    gain.gain.cancelScheduledValues(now);gain.gain.setValueAtTime(gain.gain.value,now);gain.gain.linearRampToValueAtTime(value,now+seconds);
  }
  function stopVoice(voice,remember=false){
    if(!voice)return;
    if(remember)offsets.set(voice.id,(voice.offset+context.currentTime-voice.started)%voice.buffer.duration);
    clearTimeout(voice.stopTimer);try{voice.source.stop();}catch(_){}voice.source.disconnect();voice.gain.disconnect();
  }
  function stopLayer(layer,remember=false){
    layer.request++;layer.pending=null;stopVoice(layer.current,remember);stopVoice(layer.outgoing);layer.current=null;layer.outgoing=null;
  }
  function bedSpec(){return manifest.scenes[scene?.id]||manifest.chapters[String(scene?.chapter)]||{music:null,ambient:null};}
  function targetLevel(name){
    if(!unlocked||preferences.masterMuted||document.hidden||blocked)return 0;
    const spec=bedSpec();
    if(name==='music')return preferences.music && !foreground ? preferences.musicVolume*(spec.musicLevel??1) : 0;
    return preferences.effects ? preferences.effectsVolume*(spec.ambientLevel??0.35)*(foreground?0.08:1) : 0;
  }
  async function syncLayer(name){
    const layer=layers[name],spec=bedSpec(),id=spec[name];
    const enabled=unlocked&&!preferences.masterMuted&&!document.hidden&&!blocked&&(name==='music'?preferences.music:preferences.effects);
    if(!enabled){stopLayer(layer,true);return;}
    if(foreground&&layer.outgoing)ramp(layer.outgoing.gain,0,0.65);
    if(layer.current?.id===id){ramp(layer.current.gain,targetLevel(name),foreground?0.65:1.8);return;}
    if(id && layer.pending===id)return;
    // Retire at most one previous source. Rapid changes never accumulate crossfades.
    stopVoice(layer.outgoing);layer.outgoing=null;
    if(layer.current){
      const old=layer.current;layer.current=null;layer.outgoing=old;ramp(old.gain,0,1.4);
      old.stopTimer=setTimeout(()=>{if(layer.outgoing===old){stopVoice(old);layer.outgoing=null;notify();}},1450);
    }
    const request=++layer.request;layer.pending=id||null;
    if(!id||!asset(id)||failures.has(id)){layer.pending=null;notify();return;}
    const decoded=await buffer(id);
    if(request!==layer.request)return;
    if(!decoded){layer.pending=null;return;}
    layer.pending=null;
    const source=context.createBufferSource(),gain=context.createGain();
    source.buffer=decoded;source.loop=true;
    source.loopStart=asset(id).loopStart||0;source.loopEnd=asset(id).loopEnd||decoded.duration;
    gain.gain.value=0;source.connect(gain);gain.connect(context.destination);
    const offset=offsets.get(id)||0;
    layer.current={id,source,gain,buffer:decoded,started:context.currentTime,offset};source.start(0,offset);
    ramp(gain,targetLevel(name),foreground?0.65:1.8);notify();
  }
  function syncBeds(){syncLayer('music');syncLayer('ambient');}
  function cancelCues(){epoch++;effectRequest++;timers.forEach(clearTimeout);timers.clear();}
  function stopEffects(){effects.forEach(voice=>{try{voice.source.stop();}catch(_){}voice.source.disconnect();voice.gain.disconnect();});effects.clear();}
  async function cue(id,{delay=0,force=false}={}){
    if(!id||!unlocked||preferences.masterMuted||!preferences.effects||foreground||document.hidden||blocked||quiet.has(scene?.id))return;
    const token=epoch;
    if(delay){const timer=setTimeout(()=>{timers.delete(timer);if(token===epoch)cue(id,{force});},delay);timers.add(timer);return;}
    const now=performance.now();if(!force&&now-lastEffect<180)return;lastEffect=now;
    const request=++effectRequest;
    const variants=manifest.effects[id]||[id],selected=variants[variant++%variants.length];
    const decoded=await buffer(selected);
    if(token!==epoch||request!==effectRequest||!decoded||!unlocked||preferences.masterMuted||!preferences.effects||foreground||document.hidden||blocked||quiet.has(scene?.id))return;
    stopEffects(); // One tactile gesture at a time; no click pile-ups.
    const source=context.createBufferSource(),gain=context.createGain();source.buffer=decoded;
    gain.gain.value=preferences.effectsVolume*(asset(selected).level??1);source.connect(gain);gain.connect(context.destination);
    const voice={source,gain};effects.add(voice);source.onended=()=>{effects.delete(voice);source.disconnect();gain.disconnect();notify();};source.start();notify();
  }
  function changeScene(next){
    cancelCues();stopEffects();stopRecordings();scene=next;syncBeds();notify();
    if(next.id==='irina')(manifest.cues.irina||[]).forEach(([id,delay])=>cue(id,{delay}));
  }
  function reaction(next,result){
    cancelCues();stopEffects();stopRecordings();scene=next;syncBeds();
    const name=next.id==='irina'?'irina:reaction':next.id==='fishing'&&result.icon==='measure'?'fishing:measure':['fish-result','achievement'].includes(next.id)?`${next.id}:reaction`:next.id;
    if(manifest.cues[name])manifest.cues[name].forEach(([id,delay])=>cue(id,{delay}));
    else if(result.stamp)cue('stamp',{delay:100});
  }
  function navigate(from,to){
    if(quiet.has(from?.id)||quiet.has(to?.id)||to?.id==='family-message')return;
    cue(from?.id==='cover'?'folder':from?.id==='moscow'?'document':'page');
  }
  function inspect(item){
    cancelCues();stopEffects();stopRecordings();
    cue(item.icon==='flower'?'folder-scrape':'folder');
    if(item.icon==='chess')cue('chess',{delay:380});
  }
  function applyRecordingMute(){players.forEach((info,audio)=>{
    info.appliedMute=!unlocked||preferences.masterMuted||!preferences.recordings||info.userMuted;
    audio.muted=info.appliedMute;
  });}
  function registerRecording(audio,onState){
    const info={userMuted:false,appliedMute:true,onState};players.set(audio,info);
    audio.volume=preferences.recordingVolume;audio.muted=true;
    audio.addEventListener('volumechange',()=>{
      if(audio.muted!==info.appliedMute){info.userMuted=audio.muted;applyRecordingMute();}
    });
    audio.addEventListener('play',()=>{
      if(foreground && foreground!==audio)foreground.pause();
      foreground=audio;cancelCues();stopEffects();
      // Native Play is an explicit gesture; it never reverses an explicit master mute.
      if(!unlocked)unlock();
      applyRecordingMute();syncBeds();onState('playing',preferences.masterMuted||!preferences.recordings);notify();
    });
    function release(status){if(foreground===audio)foreground=null;syncBeds();onState(status);notify();}
    audio.addEventListener('pause',()=>release(audio.ended?'ended':'paused'));
    audio.addEventListener('ended',()=>release('ended'));
    audio.addEventListener('error',()=>release('error'));
    return ()=>{if(foreground===audio){audio.pause();foreground=null;}players.delete(audio);};
  }
  function stopRecordings(){
    players.forEach((info,audio)=>{audio.pause();});foreground=null;
  }
  function leaveRecordings(){stopRecordings();players.clear();}
  function stopContained(container){players.forEach((info,audio)=>{if(container.contains(audio)){audio.pause();if(foreground===audio)foreground=null;}});syncBeds();notify();}
  function set(name,value){
    if(!(name in defaults))return;
    preferences[name]=typeof defaults[name]==='number'?clamp(value):Boolean(value);persist();
    if(name==='masterMuted'&&preferences.masterMuted){cancelCues();stopEffects();stopRecordings();}
    if(name==='effects'&&!value){cancelCues();stopEffects();}
    if(name==='recordings'&&!value)stopRecordings();
    if(name==='recordingVolume')players.forEach((info,audio)=>{audio.volume=preferences.recordingVolume;});
    applyRecordingMute();syncBeds();notify();
  }
  async function toggleMaster(){
    if(!unlocked||blocked){preferences.masterMuted=false;persist();await unlock();}
    else if(preferences.masterMuted){set('masterMuted',false);await unlock();}
    else set('masterMuted',true);
  }
  function startDefault(){
    if(preferences.masterMuted)return;
    const ctx=ensureContext();
    // Some browsers permit autoplay; others require a real user gesture.
    // Do not await resume() before a gesture: it may remain pending indefinitely.
    if(ctx?.state==='running'){unlock();return;}
    blocked=true;notify();
    function firstGesture(event){
      if(event.type==='keydown' && (event.ctrlKey||event.altKey||event.metaKey||event.key==='Tab'))return;
      // The explicit master control owns its gesture, so it cannot toggle twice.
      if(event.target.closest?.('#sound, #sound-panel, #sound-settings'))return;
      document.removeEventListener('pointerdown',firstGesture,true);
      document.removeEventListener('keydown',firstGesture,true);
      if(!preferences.masterMuted)unlock();
    }
    document.addEventListener('pointerdown',firstGesture,true);
    document.addEventListener('keydown',firstGesture,true);
  }
  document.addEventListener('visibilitychange',()=>{
    cancelCues();stopEffects();
    if(!document.hidden&&unlocked&&!preferences.masterMuted&&context?.state!=='running')unlock();
    else{syncBeds();notify();}
  });
  window.addEventListener('pagehide',()=>{cancelCues();stopEffects();stopRecordings();Object.values(layers).forEach(layer=>stopLayer(layer,true));});
  window.addEventListener('pageshow',event=>{if(event.persisted&&unlocked&&!preferences.masterMuted)unlock();});
  return {state,subscribe(listener){listeners.add(listener);listener(state());return()=>listeners.delete(listener);},set,unlock,startDefault,toggleMaster,changeScene,reaction,navigate,inspect,cue,registerRecording,leaveRecordings,stopRecordings,stopContained,
    isForeground:()=>Boolean(foreground)};
};
