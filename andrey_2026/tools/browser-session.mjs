import {spawn} from 'node:child_process';
export const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
export async function browserSession(port=9335){
 const server=await fetch('http://127.0.0.1:8000/birthday/').catch(()=>null);if(!server){const processHandle=spawn(process.execPath,['tools/serve.mjs'],{detached:true,stdio:'ignore',windowsHide:true});processHandle.unref();}
 const processHandle=spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--remote-debugging-port='+port,'--user-data-dir='+process.cwd()+'/.browser-test/check-'+port,'about:blank'],{detached:true,stdio:'ignore',windowsHide:true});processHandle.unref();
 let targets;for(let i=0;i<60;i++){try{targets=await(await fetch('http://127.0.0.1:'+port+'/json')).json();if(targets.some(t=>t.type==='page'))break;}catch{}await pause(200);}
 if(!targets)throw Error('Headless Chrome did not start');
 const ws=new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});
 let id=0;const pending=new Map(),errors=[],requests=[],failedRequests=[];
 ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);if(p){clearTimeout(p.timer);pending.delete(m.id);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.exception?.description??m.params.exceptionDetails.text);if(m.method==='Runtime.consoleAPICalled'&&m.params.type==='error')errors.push(m.params.args.map(a=>a.description??a.value).join(' '));if(m.method==='Network.requestWillBeSent')requests.push(m.params.request.url);if(m.method==='Network.responseReceived'&&m.params.response.status>=400)failedRequests.push(m.params.response.url);};
 ws.onclose=()=>{for(const p of pending.values()){clearTimeout(p.timer);p.reject(Error('Chrome connection closed'));}pending.clear();};
 const call=(method,params={})=>new Promise((resolve,reject)=>{const request=++id;const timer=setTimeout(()=>{pending.delete(request);reject(Error('CDP timeout: '+method));},30000);pending.set(request,{resolve,reject,timer});ws.send(JSON.stringify({id:request,method,params}));});
 const run=async expression=>{const r=await call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description??r.exceptionDetails.text);return r.result?.value;};
 const until=async(expression,description='condition')=>{for(let i=0;i<150;i++){if(await run(expression))return;await pause(80);}throw Error('Timed out: '+description);};
 await call('Runtime.enable');await call('Page.enable');await call('Network.enable');
 return {call,run,until,errors,requests,failedRequests,async close(){await call('Browser.close').catch(()=>{});ws.close();}};
}
