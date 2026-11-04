const assets=['calculator.html','styles.css','readability.css','fares.js','engine.js','script.js'];
Promise.all(assets.map(async p=>{const r=await fetch('http://127.0.0.1:8000/'+p);if(!r.ok)throw Error(p+': '+r.status);console.log(p+': '+r.status);})).catch(e=>{console.error(e.message);process.exitCode=1;});
