/* Run with Node + Playwright installed separately. No dependency is needed by the site.
 * Temporary sine fixtures exercise scheduling only; they are never soundtrack assets. */
const {chromium}=require(process.env.ARCHIVE_PLAYWRIGHT_PATH||'playwright');
const http=require('http'),fs=require('fs'),path=require('path'),assert=require('assert/strict');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.mp3':'audio/mpeg','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png'};
function fixture(){
  const rate=44100,count=rate*2,b=Buffer.alloc(44+count*2);b.write('RIFF');b.writeUInt32LE(b.length-8,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(rate,24);b.writeUInt32LE(rate*2,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(count*2,40);
  for(let i=0;i<count;i++)b.writeInt16LE(Math.round(Math.sin(2*Math.PI*220*i/rate)*700),44+i*2);return b;
}
const server=http.createServer((req,res)=>{
  const file=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]==='/'?'/index.html':req.url.split('?')[0]));
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  fs.readFile(file,(error,data)=>{
    if(error){res.writeHead(404).end();return;}
    const headers={'Content-Type':mime[path.extname(file)]||'application/octet-stream','Accept-Ranges':'bytes'};
    const range=/^bytes=(\d+)-(\d*)$/.exec(req.headers.range||'');
    if(range){const start=Number(range[1]),end=Math.min(data.length-1,range[2]?Number(range[2]):data.length-1);if(start> end){res.writeHead(416).end();return;}res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${data.length}`,'Content-Length':end-start+1}).end(data.subarray(start,end+1));}
    else res.writeHead(200,{...headers,'Content-Length':data.length}).end(data);
  });
});
let browser,passed=0;const check=(name,condition)=>{assert.ok(condition,name);passed++;console.log('PASS '+name);};
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const origin=`http://127.0.0.1:${server.address().port}`;
  browser=await chromium.launch({executablePath:process.env.ARCHIVE_CHROME||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  const context=await browser.newContext(),page=await context.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.message));
  const requests=[];
  await page.route(/\/assets\/audio\/(music|ambience|effects)\//,route=>{
    requests.push(route.request().url());
    if(route.request().url().includes('missing'))return route.fulfill({status:404,body:''});
    if(route.request().url().includes('slow'))return new Promise(resolve=>setTimeout(()=>route.fulfill({status:200,contentType:'audio/wav',body:fixture()}).then(resolve),650));
    return route.fulfill({status:200,contentType:'audio/wav',body:fixture()});
  });
  await page.addInitScript(()=>{
    const Native=window.AudioContext;window.__starts=[];
    window.AudioContext=class extends Native{
      get state(){return window.__blockResume?'suspended':super.state;}
      resume(){return window.__blockResume?Promise.reject(new Error('Test browser block')):super.resume();}
      createBufferSource(){const source=super.createBufferSource(),start=source.start.bind(source);source.start=(...args)=>{window.__starts.push({time:performance.now(),loop:source.loop});return start(...args);};return source;}
    };
    let factory;
    Object.defineProperty(window,'createArchiveSound',{configurable:true,get:()=>factory,set(value){factory=manifest=>{
      if(!window.__silentAssets)Object.values(manifest.assets).forEach(asset=>asset.ready=true);
      const sound=value(manifest);sound.set('music',true);window.__sound=sound;return sound;
    };}});
  });
  async function state(){return page.evaluate(()=>window.__sound.state());}
  async function scene(id){await page.evaluate(id=>window.__sound.changeScene(window.MAGAZINE.scenes.find(scene=>scene.id===id)),id);}
  async function load(id){
    await page.evaluate(id=>localStorage.setItem('sergey-magazine-progress-v1',JSON.stringify({sceneId:id,introSeen:true})),id);await page.reload();
    const resume=page.getByRole('button',{name:'Продолжить с места остановки',exact:true});if(await resume.count())await resume.click();
  }
  async function nativePlay(selector){
    await page.evaluate(selector=>{document.getElementById('test-play')?.remove();const button=document.createElement('button');button.id='test-play';button.textContent='Test native Play';button.onclick=()=>document.querySelector(selector).play().catch(()=>{});document.body.append(button);},selector);
    await page.locator('#test-play').click();
  }
  await page.goto(origin);
  check('browser-blocked initial visit waits for a gesture without soundtrack requests',!(await state()).unlocked&&requests.length===0);
  await page.locator('#sound').click();await page.waitForTimeout(450);
  check('explicit enable starts one music and one ambience bed',(await state()).musicSources===1&&(await state()).ambientSources===1);
  const before=await page.evaluate(()=>window.__starts.filter(x=>x.loop).length);
  await scene('inventory');await page.waitForTimeout(100);
  check('related pages do not restart their music bed',before===await page.evaluate(()=>window.__starts.filter(x=>x.loop).length));
  await scene('birth');await page.waitForTimeout(100);
  check('chapter changes crossfade with at most two music sources',(await state()).musicSources===2);
  for(const id of ['moscow','army','cuba','house','montage'])await scene(id);
  await page.waitForTimeout(200);
  check('rapid chapter changes do not accumulate music players',(await state()).musicSources<=2&&(await state()).ambientSources<=2);
  await page.waitForTimeout(1650);check('old crossfade source is retired',(await state()).musicSources===1);
  await page.locator('#sound-settings').click();
  await page.locator('[data-sound-setting="music"]').uncheck();
  check('music has an independent mute',(await state()).musicSources===0&&(await state()).preferences.effects);
  await page.locator('[data-sound-setting="effects"]').uncheck();check('ambience/effects have an independent mute',(await state()).ambientSources===0);
  await load('birth');await nativePlay('audio');await page.waitForFunction(()=>!document.querySelector('audio').paused);
  check('family recording plays with both background layers disabled',(await state()).foreground==='mira'&&!await page.locator('audio').evaluate(a=>a.muted));
  await page.locator('audio').evaluate(a=>{a.currentTime=5;a.volume=0.4;});await page.waitForFunction(()=>document.querySelector('audio').currentTime>=4.9);check('native seeking and volume remain usable',await page.locator('audio').evaluate(a=>a.currentTime>=4.9&&Math.abs(a.volume-0.4)<0.001));
  await page.locator('#sound').click();check('master mute silences and pauses family playback',await page.locator('audio').evaluate(a=>a.muted&&a.paused));
  await nativePlay('audio');await page.waitForTimeout(150);check('native Play does not undo explicit master mute',await page.locator('audio').evaluate(a=>a.muted)&&(await state()).preferences.masterMuted);
  await page.locator('#sound').click();await page.locator('#sound-settings').click();await page.locator('[data-sound-setting="music"]').check();await page.locator('[data-sound-setting="effects"]').check();
  await page.locator('audio').evaluate(a=>a.pause());await page.waitForTimeout(1950);
  await nativePlay('audio');await page.waitForTimeout(900);
  check('foreground smoothly fades music to silence',!(await state()).playingMusic&&(await state()).foreground==='mira');
  await page.locator('audio').evaluate(a=>a.pause());await page.waitForTimeout(1950);check('music restores gently after pause',Boolean((await state()).playingMusic));
  await load('family-message');await page.locator('.bonus-audio summary').click();await nativePlay('.audio-card audio');await page.waitForTimeout(150);await nativePlay('.bonus-audio audio');await page.waitForTimeout(150);
  check('only one family recording plays at a time',await page.locator('audio').evaluateAll(list=>list.filter(a=>!a.paused).length===1));
  await page.locator('.bonus-audio summary').click();await page.waitForFunction(()=>!window.__sound.state().foreground);check('closing the recording sleeve stops its recording',!(await state()).foreground);
  await nativePlay('.audio-card audio');await page.waitForTimeout(150);await page.getByRole('button',{name:'Закрыть юбилейный выпуск',exact:true}).click();check('leaving a scene stops its family recording',!(await state()).foreground&&await page.locator('audio').count()===0);
  await scene('kindness');await page.waitForTimeout(1650);check('kindness is silent',(await state()).musicSources===0&&(await state()).ambientSources===0);
  await scene('canada-search');await page.evaluate(()=>window.__sound.cue('stamp'));await page.waitForTimeout(100);check('job search has no music or comic cues',(await state()).musicSources===0&&(await state()).effectSources===0);
  await scene('prediction');await page.waitForTimeout(1700);const startCount=await page.evaluate(()=>window.__starts.filter(x=>!x.loop).length);
  await page.evaluate(()=>window.__sound.reaction(window.MAGAZINE.scenes.find(s=>s.id==='prediction'),{stamp:'yes'}));await page.waitForTimeout(900);
  const starts=await page.evaluate(count=>window.__starts.filter(x=>!x.loop).slice(count),startCount);
  check('accountant uses a comic pause and two timed tactile cues',starts.length===2&&starts[1].time-starts[0].time>=280);
  await page.evaluate(()=>{window.__sound.reaction(window.MAGAZINE.scenes.find(s=>s.id==='prediction'),{stamp:'yes'});window.__sound.changeScene(window.MAGAZINE.scenes.find(s=>s.id==='kindness'));});
  const cancelled=await page.evaluate(()=>window.__starts.filter(x=>!x.loop).length);await page.waitForTimeout(850);check('leaving cancels scheduled joke cues',cancelled===await page.evaluate(()=>window.__starts.filter(x=>!x.loop).length));
  await scene('cover');await page.evaluate(()=>{for(let i=0;i<30;i++)window.__sound.cue('page');});await page.waitForTimeout(100);check('rapid input produces at most one effect',(await state()).effectSources<=1);
  await scene('achievement');await page.waitForTimeout(250);const photoBefore=await page.evaluate(()=>window.__starts.filter(x=>!x.loop).length);await page.evaluate(()=>{const scene=window.MAGAZINE.scenes.find(s=>s.id==='achievement');window.__sound.reaction(scene,scene.reaction);});await page.waitForTimeout(250);check('classification photo movement has one tactile cue',photoBefore+1===await page.evaluate(()=>window.__starts.filter(x=>!x.loop).length));
  await page.evaluate(()=>{window.ARCHIVE_SOUND.assets['missing-bed']={layer:'music',src:'assets/audio/music/missing.ogg',ready:true};window.ARCHIVE_SOUND.scenes.army={music:'missing-bed',ambient:'quiet-room'};window.__sound.changeScene(window.MAGAZINE.scenes.find(s=>s.id==='army'));});await page.waitForTimeout(1800);
  check('missing audio fails silently without blocking the scene',(await state()).failedAssets.includes('missing-bed')&&(await state()).musicSources===0);
  await page.evaluate(()=>{window.ARCHIVE_SOUND.assets['slow-bed']={layer:'music',src:'assets/audio/music/slow.ogg',ready:true};window.ARCHIVE_SOUND.scenes.cuba={music:'slow-bed',ambient:'quiet-room'};window.__sound.changeScene(window.MAGAZINE.scenes.find(s=>s.id==='cuba'));window.__sound.set('masterMuted',true);});await page.waitForTimeout(900);
  check('late decode cannot start playback after mute',(await state()).musicSources===0&&(await state()).ambientSources===0);
  await page.locator('#sound').click();await scene('cover');await page.waitForTimeout(100);
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>window.__hidden});window.__hidden=true;document.dispatchEvent(new Event('visibilitychange'));});
  check('hidden-tab event pauses all background sources',(await state()).musicSources===0&&(await state()).ambientSources===0);
  await page.evaluate(()=>{window.__hidden=false;document.dispatchEvent(new Event('visibilitychange'));});await page.waitForTimeout(150);
  check('return-to-tab event starts one player per background layer',(await state()).musicSources===1&&(await state()).ambientSources===1);
  await page.reload();check('browser-blocked reload waits for a gesture',!(await state()).unlocked&&(await state()).musicSources===0);
  await page.evaluate(()=>window.__blockResume=true);await page.locator('#sound').click();check('blocked browser resume is reported accurately',(await state()).blocked&&await page.locator('#sound').getAttribute('aria-pressed')==='false');
  await page.evaluate(()=>window.__blockResume=false);await page.locator('#sound').click();await page.waitForTimeout(100);check('explicit retry recovers from browser restriction',!(await state()).blocked&&(await state()).unlocked);
  await load('birth');await nativePlay('audio');await page.waitForFunction(()=>{const a=document.querySelector('audio');return !a.paused&&a.readyState>=2&&Number.isFinite(a.duration);});await page.locator('audio').evaluate(a=>{a.currentTime=a.duration-0.15;});await page.waitForFunction(()=>document.querySelector('audio').ended,null,{timeout:10000});await page.waitForTimeout(2000);check('recording end releases priority and restores background',!(await state()).foreground&&Boolean((await state()).playingMusic));
  await page.locator('audio').evaluate(a=>{a.src='assets/audio/missing-recording.mp3';a.load();});await page.waitForTimeout(300);check('missing family recording has a readable fallback',await page.locator('.audio-status').textContent()==='Запись недоступна. Можно продолжать чтение.');
  check('saved progress remains in its original schema',Object.keys(await page.evaluate(()=>JSON.parse(localStorage.getItem('sergey-magazine-progress-v1')))).sort().join(',')==='introSeen,sceneId');
  await page.setViewportSize({width:320,height:850});await page.locator('#sound-settings').click();check('mobile settings fit viewport',await page.evaluate(()=>document.documentElement.scrollWidth<=320));
  await page.locator('[data-sound-setting="music"]').focus();await page.keyboard.press('Space');check('keyboard controls toggle settings',!(await state()).preferences.music);
  await page.keyboard.press('Escape');check('Escape closes settings and restores focus',await page.locator('#sound-panel').isHidden()&&await page.locator('#sound-settings').evaluate(e=>e===document.activeElement));
  check('no browser JavaScript errors',errors.length===0);
  // Explicitly exercise unavailable assets without test audio.
  const silent=await context.newPage();const silentRequests=[];silent.on('request',request=>{if(/\/audio\/(music|ambience|effects)\//.test(request.url()))silentRequests.push(request.url());});await silent.goto(origin);await silent.evaluate(()=>{for(const asset of Object.values(window.ARCHIVE_SOUND.assets))asset.ready=false;});await silent.locator('#sound').click();check('silent fallback remains navigable without requesting unavailable beds',await silent.locator('#scene h1').count()===1&&silentRequests.length===0);
  const actual=await context.newPage();await actual.addInitScript(()=>{localStorage.setItem('sergey-archive-sound-v1',JSON.stringify({music:true,musicDefaultVersion:2}));let factory;Object.defineProperty(window,'createArchiveSound',{configurable:true,get:()=>factory,set(value){factory=manifest=>{const sound=value(manifest);window.__actualSound=sound;return sound;};}});});let actualRequests=0;actual.on('request',r=>{if(/\/audio\/(music|ambience|effects)\//.test(r.url()))actualRequests++;});await actual.goto(origin);check('real assets are not downloaded before sound enablement',actualRequests===0);
  const decoded=await actual.evaluate(async()=>{const ctx=new AudioContext();const results=[];for(const [id,asset] of Object.entries(window.ARCHIVE_SOUND.assets)){const response=await fetch(asset.src);if(!response.ok)throw new Error(id+' unavailable');const buffer=await ctx.decodeAudioData(await response.arrayBuffer());let peak=0;for(let c=0;c<buffer.numberOfChannels;c++){const samples=buffer.getChannelData(c);for(const value of samples)peak=Math.max(peak,Math.abs(value));}results.push({id,duration:buffer.duration,peak,channels:buffer.numberOfChannels});}await ctx.close();return results;});check('all 29 real assets decode with finite duration, non-silent conservative peaks',decoded.length===29&&decoded.every(x=>x.duration>0&&x.peak>0&&x.peak<0.55));
  check('bookmark welcome assigns the opening archive audio scene',await actual.evaluate(()=>window.__actualSound.state().scene==='cover'));await actual.locator('#sound').click();await actual.waitForTimeout(2500);check('shipped music and ambience start actual background sources',await actual.evaluate(()=>window.__actualSound.state().musicSources===1&&window.__actualSound.state().ambientSources===1&&window.__actualSound.state().failedAssets.length===0));
  const requestCount=actualRequests;await actual.evaluate(()=>window.__actualSound.changeScene(window.MAGAZINE.scenes.find(s=>s.id==='inventory')));await actual.waitForTimeout(200);check('real related pages reuse the loaded music bed',actualRequests===requestCount);
  await actual.evaluate(()=>{localStorage.setItem('sergey-magazine-progress-v1',JSON.stringify({sceneId:'birth',introSeen:true}));});await actual.reload();await actual.getByRole('button',{name:'Продолжить с места остановки',exact:true}).click();await actual.waitForFunction(()=>window.__actualSound.state().playingMusic);await actual.locator('audio').evaluate(a=>a.play());await actual.waitForTimeout(1000);check('real soundtrack fades to silence under actual family voices',await actual.evaluate(()=>window.__actualSound.state().foreground==='mira'&&!window.__actualSound.state().playingMusic));await actual.locator('audio').evaluate(a=>a.pause());await actual.waitForTimeout(2000);check('real soundtrack restores after family playback pauses',await actual.evaluate(()=>Boolean(window.__actualSound.state().playingMusic)));
  await actual.evaluate(()=>window.__actualSound.changeScene(window.MAGAZINE.scenes.find(s=>s.id==='moscow')));await actual.waitForTimeout(2200);check('real chapter crossfade retires the previous music source',await actual.evaluate(()=>window.__actualSound.state().musicSources===1&&window.__actualSound.state().failedAssets.length===0));
  await actual.evaluate(()=>{window.__actualSound.changeScene(window.MAGAZINE.scenes.find(s=>s.id==='cover'));window.__actualSound.set('masterMuted',true);});check('real soundtrack master mute stops both layers',await actual.evaluate(()=>window.__actualSound.state().musicSources===0&&window.__actualSound.state().ambientSources===0));
  await actual.reload();await actual.getByRole('button',{name:'Продолжить с места остановки',exact:true}).click();await actual.waitForFunction(()=>Boolean(window.__actualSound.state().playingMusic));check('configured sound starts on first game interaction without the sound button',await actual.evaluate(()=>window.__actualSound.state().musicSources===1&&!window.__actualSound.state().blocked));
  await page.evaluate(()=>window.__sound.set('masterMuted',true));await page.reload();await page.getByRole('button',{name:'Продолжить с места остановки',exact:true}).click();await page.waitForTimeout(250);check('remembered explicit mute survives the first game interaction',(await state()).preferences.masterMuted&&(await state()).musicSources===0);
  console.log(`\n${passed} checks passed. Real Chrome Web Audio + native family MP3 playback; temporary audio fixtures for background/cues. Visibility and autoplay failure states explicitly simulated.`);
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();server.close();});
