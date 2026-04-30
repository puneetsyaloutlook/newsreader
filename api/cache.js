const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const DATA_KEY = 'signalcatcher:data';

const authHeaders = { Authorization: `Bearer ${UPSTASH_TOKEN}` };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    return res.status(500).json({ error: 'Upstash credentials not configured' });
  }

  // GET — read data
  if (req.method === 'GET') {
    try {
      const r = await fetch(`${UPSTASH_URL}/get/${DATA_KEY}`, { headers: authHeaders });
      const json = await r.json();
      if (!json.result) return res.status(200).json({});
      const data = typeof json.result === 'string' ? JSON.parse(json.result) : json.result;
      return res.status(200).json(data);
    } catch(e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // PUT — write data
  if (req.method === 'PUT') {
    try {
      const value = JSON.stringify(req.body);
      // Upstash REST: POST /set/KEY with raw string body
      const r = await fetch(`${UPSTASH_URL}/set/${DATA_KEY}`, {
        method: 'POST',
        headers: { ...authHeaders, 'Content-Type': 'text/plain' },
        body: value
      });
      await r.json();
      return res.status(200).json({ ok: true });
    } catch(e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(400).json({ error: 'Invalid request' });
}
