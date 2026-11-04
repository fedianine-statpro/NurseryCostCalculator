/* Versioned, validated travel-input links. Results are always recalculated. */
(function(root){
  const values=['trips','extra-bus','from-zone','to-zone','profile','railcard','rail-type','start-date','away','exact-out','exact-back','out-time','back-time'];
  const checks=['via-one','tram','exact','custom-times'];
  function validate(s){
    if(!s||s.v!==1||typeof s.values!=='object'||!s.values||!s.checks||!Array.isArray(s.days)||typeof s.weekMode!=='boolean'||!['peak','offpeak','mixed'].includes(s.timing))throw Error('This comparison link is not supported.');
    for(const id of values)if(typeof s.values[id]!=='string'||s.values[id].length>100)throw Error('This comparison link contains invalid choices.');
    for(const id of checks)if(typeof s.checks[id]!=='boolean')throw Error('This comparison link contains invalid choices.');
    const fares=root.LondonFares||(typeof module!=='undefined'?require('./fares.js'):null);
    if(!fares||!Object.hasOwn(fares.profiles,s.values.profile)||!['none','offpeak','disabled'].includes(s.values.railcard)||!['tube','national','through','special'].includes(s.values['rail-type']))throw Error('This comparison link contains an unknown card or fare type.');
    for(const [id,min,max] of [['trips',0,12],['extra-bus',0,12],['from-zone',1,6],['to-zone',1,6],['away',0,31]]){const n=Number(s.values[id]);if(s.values[id]===''||!Number.isInteger(n)||n<min||n>max)throw Error('This comparison link contains an invalid count or zone.');}
    if(!/^\d{4}-\d{2}-\d{2}$/.test(s.values['start-date'])||!Number.isFinite(Date.parse(s.values['start-date'])))throw Error('This comparison link contains an invalid date.');
    for(const id of ['out-time','back-time'])if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(s.values[id]))throw Error('This comparison link contains an invalid time.');
    for(const id of ['exact-out','exact-back'])if(s.values[id]!==''&&(!Number.isFinite(Number(s.values[id]))||Number(s.values[id])<0||Number(s.values[id])>100))throw Error('This comparison link contains an invalid fare.');
    if(s.days.some(n=>!Number.isInteger(n)||n<0||n>6)||new Set(s.days).size!==s.days.length)throw Error('This comparison link contains invalid weekdays.');
    if(s.weekMode){if(!s.week||typeof s.week!=='object')throw Error('The shared week is missing.');for(let i=0;i<7;i++){
      const p=s.week[i];if(!p||![p.rail,p.bus].every(n=>Number.isInteger(n)&&n>=0&&n<=12)||![p.from,p.to].every(n=>Number.isInteger(n)&&n>=1&&n<=6)||typeof p.via1!=='boolean'||typeof p.tram!=='boolean'||!['usual','peak','offpeak','mixed'].includes(p.timing))throw Error('This comparison link contains an invalid day.');
    }}
    return {v:1,fares:typeof s.fares==='string'?s.fares.slice(0,30):'',values:Object.fromEntries(values.map(id=>[id,s.values[id]])),checks:Object.fromEntries(checks.map(id=>[id,s.checks[id]])),days:s.days,timing:s.timing,weekMode:s.weekMode,week:s.weekMode?Object.fromEntries(Array.from({length:7},(_,i)=>{const p=s.week[i];return [i,{rail:p.rail,bus:p.bus,from:p.from,to:p.to,via1:p.via1,tram:p.tram,timing:p.timing}];})):null};
  }
  function encode(s){const bytes=new TextEncoder().encode(JSON.stringify(validate(s)));let binary='';for(const n of bytes)binary+=String.fromCharCode(n);return btoa(binary).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'');}
  function decode(hash){if(!hash.startsWith('#compare='))return null;const encoded=hash.slice(9);if(encoded.length>16000||!/^[\w-]+$/.test(encoded))throw Error('This comparison link is incomplete or invalid.');try{const binary=atob(encoded.replaceAll('-','+').replaceAll('_','/'));return validate(JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(Uint8Array.from(binary,c=>c.charCodeAt(0)))));}catch{throw Error('This comparison link is incomplete or invalid.');}}
  function url(state,base='https://fedianine.com/tfl/calculator.html'){const u=new URL(base);u.search='';u.hash='compare='+encode(state);return u.href;}
  const api={values,checks,validate,encode,decode,url};root.LondonSharing=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
