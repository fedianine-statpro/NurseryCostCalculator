import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd(),port=Number(process.env.PORT||8000);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.json':'application/json'};
http.createServer(async(req,res)=>{try{let url=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(url.startsWith('/birthday/'))url=url.slice('/birthday'.length);let file=path.resolve(root,'.'+url);if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403).end();return;}if((await stat(file)).isDirectory())file=path.join(file,'index.html');const body=await readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(body);}catch{res.writeHead(404).end('Not found');}}).listen(port,'127.0.0.1',()=>console.log(`Quest: http://127.0.0.1:${port}/birthday/`));
