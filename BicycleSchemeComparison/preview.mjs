import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
export function startServer(port=8000) {
  const root=path.dirname(fileURLToPath(import.meta.url));
  const server=http.createServer(async(req,res)=>{
    try {
      let name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
      if(name.startsWith('/BicycleSchemeComparison/')) name=name.slice('/BicycleSchemeComparison'.length);
      if(name.endsWith('/'))name+='index.html';
      const target=path.resolve(root,'.'+name);
      if(!target.startsWith(root+path.sep)) {res.writeHead(403);res.end();return;}
      const body=await readFile(target);
      res.writeHead(200,{'Content-Type':({'.html':'text/html; charset=utf-8','.css':'text/css','.mjs':'text/javascript','.svg':'image/svg+xml'})[path.extname(target)]||'text/plain'});res.end(body);
    }catch{res.writeHead(404);res.end('Not found');}
  });
  return new Promise(resolve=>server.listen(port,'127.0.0.1',()=>resolve(server)));
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const server=await startServer(Number(process.env.PORT||8000));console.log(`Local: http://127.0.0.1:${server.address().port}/BicycleSchemeComparison/`);}
