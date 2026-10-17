// Extract an existing embedded JPEG byte stream. Does not alter or develop the RAW image.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {dirname} from 'node:path';
const [input,output]=process.argv.slice(2);if(!input||!output)throw Error('Usage: node tools/extract-nef-preview.mjs input.nef output.jpg');
const data=readFileSync(input),candidates=[];let search=0;
while(search<data.length){
 const start=data.indexOf(Buffer.from([255,216,255]),search);if(start<0)break;search=start+3;let p=start+2,width=0,height=0,valid=false;
 while(p+4<data.length){
  if(data[p]!==255)break;while(data[p]===255)p++;const marker=data[p++];
  if(marker===217){valid=true;break;}
  if(marker===216||marker===1||marker>=208&&marker<=215)continue;
  if(p+2>data.length)break;const length=data.readUInt16BE(p);if(length<2||p+length>data.length)break;
  if([192,193,194,195,197,198,199,201,202,203,205,206,207].includes(marker)&&length>=8){height=data.readUInt16BE(p+3);width=data.readUInt16BE(p+5);}
  p+=length;
  if(marker===218){while(p+1<data.length){if(data[p++]!==255)continue;const next=data[p];if(next===0||next>=208&&next<=215){p++;continue;}p--;break;}}
 }
 if(valid&&width>=100&&height>=100)candidates.push({start,end:p,width,height});
}
candidates.sort((a,b)=>b.width*b.height-a.width*a.height);const best=candidates[0];if(!best)throw Error('No embedded JPEG preview found');mkdirSync(dirname(output),{recursive:true});writeFileSync(output,data.subarray(best.start,best.end));console.log(JSON.stringify({input,output,width:best.width,height:best.height,bytes:best.end-best.start}));
