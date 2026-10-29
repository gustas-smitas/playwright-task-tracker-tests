const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'));
http.createServer((req, res) => {
  if (req.url === '/api/tip') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ tip: 'Start with one small task.' }));
  } else if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
}).listen(3000, '0.0.0.0', () => console.log('Task Tracker: http://localhost:3000'));
