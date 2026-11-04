/* Dependency-free Chrome smoke test. Screenshots are ignored under .qa/. */
const fs=require('node:fs'),path=require('node:path'),{spawn}=require('node:child_process'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),out=path.join(root,'.qa');fs.mkdirSync(out,{recursive:true});
const chrome=process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe';
const child=spawn(chrome,['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--remote-debugging-port=9224','--user-data-dir='+path.join(out,'chrome'),'about:blank'],{windowsHide:true,stdio:'ignore'});
const delay=ms=>new Promise(r=>setTimeout(r,ms));let socket,seq=0;const pending=new Map(),errors=[],requests=[];
async function main(){
 let tab;for(let i=0;i<80;i++){try{tab=await(await fetch('http://127.0.0.1:9224/json/new?about:blank',{method:'PUT'})).json();break;}catch{await delay(200);}}
 assert(tab,'Chrome did not start');socket=new WebSocket(tab.webSocketDebuggerUrl);await new Promise((resolve,reject)=>{socket.onopen=resolve;socket.onerror=reject;});
 socket.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(Error(m.error.message)):p.resolve(m.result);}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text+': '+(m.params.exceptionDetails.exception?.description||''));else if(m.method==='Network.requestWillBeSent')requests.push(m.params.request.url);};
 const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});socket.send(JSON.stringify({id,method,params}));});
 const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;};
 await send('Runtime.enable');await send('Page.enable');await send('Network.enable');await send('Page.addScriptToEvaluateOnNewDocument',{source:"try{localStorage.removeItem('london-fare-check-analytics')}catch{}"});await send('Emulation.setDeviceMetricsOverride',{width:1280,height:1000,deviceScaleFactor:1,mobile:false});
 await send('Page.navigate',{url:'file:///'+path.join(root,'calculator.html').replaceAll('\\','/')});
 for(let i=0;i<80;i++){if(await evaluate("!!document.querySelector('#results h2')"))break;await delay(100);}
 await evaluate("Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,2000))]).then(()=>true)");
 const set=async(id,value)=>evaluate(`(()=>{const el=document.getElementById(${JSON.stringify(id)});el.value=${JSON.stringify(String(value))};el.dispatchEvent(new Event('input',{bubbles:true}));return true;})()`);
 const click=selector=>evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
 const text=()=>evaluate("document.getElementById('results').innerText");
 assert((await text()).includes('2 Tube & rail trips'));
 await set('start-date','2026-11-04');await set('to-zone',5);await click('[name="day-count"][value="7"]');
 const light=await text();assert(light.includes('Pay as you go.'));assert(light.includes('2 Tube & rail trips.'));
 await click('[data-count="extra-bus"][data-change="1"]');await click('[data-count="extra-bus"][data-change="1"]');
 const mixed=await text();assert(mixed.includes('2 Tube & rail trips + 2 bus/tram journeys.'));assert(mixed.includes('Get a monthly Travelcard.'));assert(mixed.includes('included in the Travelcard price'));
 await click('[data-count="trips"][data-change="1"]');await click('[data-count="trips"][data-change="1"]');
 assert((await text()).includes('4 Tube & rail trips + 2 bus/tram journeys.'));
 const desktop=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});fs.writeFileSync(path.join(out,'desktop.png'),Buffer.from(desktop.data,'base64'));
 await set('trips',0);assert(await evaluate("document.getElementById('rail-fields').hidden"));assert((await text()).includes('Monthly Bus & Tram Pass'));
 await set('extra-bus',0);assert((await text()).includes('Add at least one Tube & rail trip or bus/tram journey'));
 await click('#reset');assert((await text()).includes('2 Tube & rail trips.'));assert.equal(await evaluate("document.getElementById('extra-bus').value"),'0');
 await set('extra-bus',2);await evaluate("document.getElementById('details').open=true");await set('rail-type','national');assert((await text()).includes('2 Tube & rail trips + 2 bus/tram journeys.'));
 await click('#reset');await set('start-date','2026-11-02');await set('to-zone',5);await set('extra-bus',2);await click('#week-toggle');
 assert(await evaluate("!document.getElementById('week-panel').hidden"));
 await set('day-2-rail',0);await set('day-3-rail',1);await set('day-3-to',2);
 await evaluate("document.getElementById('day-3-tram').checked=true;document.getElementById('day-3-tram').dispatchEvent(new Event('input',{bubbles:true}))");
 let weekly=await text();assert(weekly.includes('Your planned week'));assert(weekly.includes('2 Tube & rail trips · Zones 1–5 + 2 bus journeys'));assert(weekly.includes('1 Tube & rail trip · Zones 1–2 + 2 tram/bus journeys'));assert(weekly.includes('£111.70'));
 await click('[data-copy-day="1"][data-target="weekdays"]');assert.equal(await evaluate("document.getElementById('day-5-rail').value"),'2');
 await click('[data-off-day="4"]');assert.equal(await evaluate("document.getElementById('day-4-rail').value"),'0');
 await click('[data-usual-day="4"]');assert.equal(await evaluate("document.getElementById('day-4-rail').value"),'2');
 await click('#week-toggle');assert((await text()).includes('Each travel day:'));await click('#week-toggle');assert((await text()).includes('Your planned week'));
 await click('#reset');await set('extra-bus',2);await click('#week-toggle');await set('day-2-rail',0);await set('day-3-tram','on');
 const weekDesktop=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});fs.writeFileSync(path.join(out,'week-desktop.png'),Buffer.from(weekDesktop.data,'base64'));
 await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await click('#reset');await set('extra-bus',2);
 assert(await evaluate('document.documentElement.scrollWidth<=innerWidth'),'Mobile page overflows');
 assert(await evaluate("getComputedStyle(document.querySelector('.mobile-result')).display!=='none'"));
 const mobile=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});fs.writeFileSync(path.join(out,'mobile.png'),Buffer.from(mobile.data,'base64'));
 await click('#week-toggle');await evaluate("document.querySelector('[data-weekday=\"1\"]').open=true");await set('day-1-bus',4);assert(await evaluate('document.documentElement.scrollWidth<=innerWidth'),'Weekly planner overflows on mobile');
 const weekMobile=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});fs.writeFileSync(path.join(out,'week-mobile.png'),Buffer.from(weekMobile.data,'base64'));
 assert(!requests.some(url=>/googletagmanager\.com|google-analytics\.com/.test(url)),'Analytics loaded without consent');
 await evaluate("Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async value=>{window.copiedComparison=value}}})");await click('#copy-comparison');
 const shared=await evaluate('window.copiedComparison'),beforeShare=await text();assert(shared.startsWith('https://fedianine.com/tfl/calculator.html#compare='));
 const localUrl='file:///'+path.join(root,'calculator.html').replaceAll('\\','/');
 await send('Page.navigate',{url:localUrl+new URL(shared).hash});for(let i=0;i<80;i++){if(await evaluate("!!document.querySelector('#results h2') && !document.getElementById('shared-notice').hidden"))break;await delay(100);}
 assert.equal(await text(),beforeShare);assert(await evaluate("!document.getElementById('week-panel').hidden"));assert.equal(await evaluate("document.getElementById('day-1-bus').value"),'4');
 await evaluate("const original=document.head.append.bind(document.head);document.head.append=(...nodes)=>{for(const n of nodes){if(n.src?.includes('googletagmanager'))window.analyticsTagRequested=true;else original(n)}};document.getElementById('analytics-preferences').open=true");
 await click('#analytics-allow');assert(await evaluate('window.analyticsTagRequested===true'));
 await set('day-1-bus',3);await evaluate('new Promise(r=>setTimeout(r,850))');
 const analytics=await evaluate('window.dataLayer.map(args=>Array.from(args))');assert(analytics.some(a=>a[0]==='event'&&a[1]==='page_view'));assert(!JSON.stringify(analytics).includes('#compare='));assert(analytics.filter(a=>a[0]==='event').every(a=>a[2].page_location==='https://fedianine.com/tfl/calculator.html'));
 await click('#analytics-decline');assert(await evaluate("document.getElementById('analytics-status').textContent.includes('off')"));
 await send('Page.navigate',{url:localUrl+'#compare=bad'});for(let i=0;i<80;i++){if(await evaluate("!!document.querySelector('#results h2') && !document.getElementById('shared-notice').hidden"))break;await delay(100);}
 assert((await text()).includes('Pay as you go.'));assert(await evaluate("document.getElementById('shared-notice').textContent.includes('invalid')"));
 await send('Emulation.setScriptExecutionDisabled',{value:true});await send('Page.navigate',{url:localUrl});await delay(150);
 assert(await evaluate("document.getElementById('questions-title').textContent.includes('Travelcard')"));assert.equal(await evaluate("document.querySelector('link[rel=canonical]').href"),'https://fedianine.com/tfl/calculator.html');
 await send('Emulation.setScriptExecutionDisabled',{value:false});
 await send('Emulation.setDeviceMetricsOverride',{width:1200,height:630,deviceScaleFactor:1,mobile:false});await send('Page.navigate',{url:'file:///'+path.join(root,'assets/share-card.svg').replaceAll('\\','/')});
 for(let i=0;i<60;i++){if(await evaluate("document.documentElement.tagName==='svg'"))break;await delay(100);}
 const card=await send('Page.captureScreenshot',{format:'png',clip:{x:0,y:0,width:1200,height:630,scale:1}});fs.writeFileSync(path.join(root,'assets/share-card.png'),Buffer.from(card.data,'base64'));
 assert.deepEqual(errors,[]);console.log('Browser checks passed: calculator, weekly editing/copying, desktop/mobile layouts, shared-link round trip, invalid links, analytics opt-in/out, sanitized events, static crawlable content and social PNG.');
 await send('Browser.close');
}
main().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>{socket?.close();child.kill();});
