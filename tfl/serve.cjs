const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const file = path.resolve(root, '.' + (url.pathname === '/' ? '/calculator.html' : decodeURIComponent(url.pathname)));
  if (!file.startsWith(root + path.sep) || /(?:^|[\\/])\./.test(path.relative(root, file))) { res.writeHead(403).end(); return; }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404).end('Not found'); return; }
    res.setHeader('Content-Type', ({'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml'})[path.extname(file)] || 'application/octet-stream');
    res.end(data);
  });
}).listen(8000, '127.0.0.1', () => console.log('London Fare Check: http://127.0.0.1:8000'));
