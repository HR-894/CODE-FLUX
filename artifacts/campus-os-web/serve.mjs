/**
 * Standalone Production Static Server for CampusOS Web (Security-Hardened)
 * 
 * Features:
 * - SPA HTML5 history fallback (index.html)
 * - Built-in reverse proxy for /api requests to the API server
 * - Path traversal defense & safe URI decode handling
 * - Security response headers (X-Content-Type-Options, X-Frame-Options, etc.)
 * - Zero external dependencies (uses Node.js built-in http, fs, path, url)
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.WEB_PORT || process.env.PORT || 3000);
const STATIC_DIR = path.resolve(__dirname, 'dist/public');
const API_TARGET = process.env.API_TARGET || 'http://localhost:5001';

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-XSS-Protection': '1; mode=block',
};

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.map': 'application/json',
};

function proxyRequest(req, res, targetUrl) {
  let target;
  try {
    target = new URL(req.url, targetUrl);
  } catch {
    res.writeHead(400, { 'content-type': 'application/json', ...SECURITY_HEADERS });
    return res.end(JSON.stringify({ error: 'Invalid URL' }));
  }

  const options = {
    hostname: target.hostname,
    port: target.port || (target.protocol === 'https:' ? 443 : 80),
    path: target.pathname + target.search,
    method: req.method,
    headers: {
      ...req.headers,
      host: target.host,
      'x-forwarded-for': req.socket.remoteAddress,
      'x-forwarded-proto': 'http',
    },
  };

  const client = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, {
      ...proxyRes.headers,
      ...SECURITY_HEADERS,
    });
    proxyRes.pipe(res, { end: true });
  });

  client.on('error', (err) => {
    console.error(`[Proxy Error] ${req.method} ${req.url} -> ${err.message}`);
    res.writeHead(502, { 'content-type': 'application/json', ...SECURITY_HEADERS });
    res.end(JSON.stringify({ error: 'API Gateway Error', message: err.message }));
  });

  req.pipe(client, { end: true });
}

const server = http.createServer((req, res) => {
  let parsedUrl;
  try {
    parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  } catch {
    res.writeHead(400, { 'content-type': 'text/plain', ...SECURITY_HEADERS });
    return res.end('Bad Request');
  }

  let pathname;
  try {
    pathname = decodeURIComponent(parsedUrl.pathname);
  } catch {
    res.writeHead(400, { 'content-type': 'text/plain', ...SECURITY_HEADERS });
    return res.end('Bad Request');
  }

  // Proxy /api requests to API server
  if (pathname.startsWith('/api')) {
    return proxyRequest(req, res, API_TARGET);
  }

  // Strict path resolution: strip null bytes and normalize
  const sanitizedPath = pathname.replace(/\0/g, '');
  const filePath = path.resolve(STATIC_DIR, '.' + sanitizedPath);

  // Strict directory traversal prevention: must be within STATIC_DIR
  if (filePath !== STATIC_DIR && !filePath.startsWith(STATIC_DIR + path.sep)) {
    res.writeHead(403, { 'content-type': 'text/plain', ...SECURITY_HEADERS });
    return res.end('Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, {
        'content-type': contentType,
        'cache-control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
        ...SECURITY_HEADERS,
      });
      return fs.createReadStream(filePath).pipe(res);
    }

    // SPA fallback to index.html
    const indexPath = path.join(STATIC_DIR, 'index.html');
    fs.readFile(indexPath, (indexErr, content) => {
      if (indexErr) {
        res.writeHead(404, { 'content-type': 'text/plain', ...SECURITY_HEADERS });
        return res.end('App bundle not built. Run "pnpm run build:web" first.');
      }
      res.writeHead(200, {
        'content-type': 'text/html; charset=utf-8',
        ...SECURITY_HEADERS,
      });
      res.end(content);
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[CampusOS Web] Serving on http://localhost:${PORT}`);
  console.log(`[CampusOS Web] Proxying /api -> ${API_TARGET}`);
});
