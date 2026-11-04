const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
test('page references existing local scripts and styles',()=>{
 const html=fs.readFileSync(path.join(root,'calculator.html'),'utf8');
 const refs=[...html.matchAll(/(?:src|href)="([^"#]+\.(?:js|css))"/g)].map(m=>m[1]);
 assert(refs.length>=5);for(const ref of refs)assert(fs.existsSync(path.join(root,ref)),ref);
});
test('UI controls used by the script exist and have unique IDs',()=>{
 const html=fs.readFileSync(path.join(root,'calculator.html'),'utf8'),js=fs.readFileSync(path.join(root,'script.js'),'utf8');
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);
 for(const m of js.matchAll(/\$\('([^']+)'\)/g))assert(ids.includes(m[1]),m[1]);
});
test('source labels cover all published sources',()=>{
 const js=fs.readFileSync(path.join(root,'script.js'),'utf8'),F=require('../fares.js');
 for(const key of Object.keys(F.sources))assert(js.includes(key+':'),key);
});
