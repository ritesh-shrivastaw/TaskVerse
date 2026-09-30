// Static server + Gemini proxy. The API key lives only here (server side).
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const PORT = process.env.PORT || 3000;
const KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
const FALLBACK_MODELS = ['gemini-flash-lite-latest', 'gemini-flash-latest'];
const ROOT = join(process.cwd(), process.argv.includes('--dist') ? 'dist' : 'public');
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml' };

// Simple per-IP rate limit: 10 requests per minute.
const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter(t => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 10;
}

async function gemini(req, res) {
  if (!KEY) return send(res, 500, { error: 'Server has no GEMINI_API_KEY set.' });
  if (limited(req.socket.remoteAddress)) return send(res, 429, { error: 'Too many requests. Wait a minute and retry.' });
  let body = '';
  for await (const chunk of req) { body += chunk; if (body.length > 50_000) return send(res, 413, { error: 'Input too large.' }); }
  let { prompt, json } = {};
  try { ({ prompt, json } = JSON.parse(body)); } catch { return send(res, 400, { error: 'Invalid JSON body.' }); }
  if (typeof prompt !== 'string' || !prompt.trim()) return send(res, 400, { error: 'Missing prompt.' });

  const payload = JSON.stringify({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: json ? { responseMimeType: 'application/json' } : {}
  });
  const models = [...new Set([MODEL, ...FALLBACK_MODELS])];

  for (const model of models) {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': KEY },
      body: payload
    });
    const data = await r.json();
    if (r.ok) {
      const text = data.candidates?.[0]?.content?.parts?.map(p => p.text).join('') ?? '';
      return send(res, 200, { text });
    }
    if (![429, 503].includes(r.status)) return send(res, r.status, { error: data.error?.message || 'Gemini request failed.' });
  }

  send(res, 503, { error: 'Gemini is busy right now. Please retry in a moment.' });
}

function send(res, status, obj) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(obj));
}

http.createServer(async (req, res) => {
  try {
    if (req.method === 'POST' && req.url === '/api/gemini') return await gemini(req, res);
    const path = req.url.split('?')[0];
    const file = normalize(join(ROOT, path === '/' ? 'index.html' : path));
    if (!file.startsWith(ROOT)) return send(res, 403, { error: 'Forbidden' });
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream' });
    res.end(data);
  } catch (e) {
    send(res, e.code === 'ENOENT' ? 404 : 500, { error: e.code === 'ENOENT' ? 'Not found' : 'Server error' });
  }
}).listen(PORT, () => console.log(`http://localhost:${PORT}`));