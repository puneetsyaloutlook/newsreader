const JBIN_BASE = 'https://api.jsonbin.io/v3/b';
const KEY = process.env.JSONBIN_API_KEY;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (!KEY) return res.status(500).json({ error: 'JSONBIN_API_KEY not configured' });

  const { binId } = req.query;

  // GET /api/cache?binId=xxx — read bin
  if (req.method === 'GET' && binId) {
    const upstream = await fetch(`${JBIN_BASE}/${binId}/latest?meta=false`, {
      headers: { 'X-Master-Key': KEY }
    });
    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  }

  // POST /api/cache — create new bin, body: { uid, data }
  if (req.method === 'POST' && !binId) {
    const { uid, data } = req.body;
    const upstream = await fetch(JBIN_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': KEY,
        'X-Bin-Name': uid,
        'X-Bin-Private': 'true',
        'X-Bin-Versioning': 'false'
      },
      body: JSON.stringify(data)
    });
    const result = await upstream.json();
    return res.status(upstream.status).json(result);
  }

  // PUT /api/cache?binId=xxx — update bin, body: { data }
  if (req.method === 'PUT' && binId) {
    const { data } = req.body;
    const upstream = await fetch(`${JBIN_BASE}/${binId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': KEY,
        'X-Bin-Versioning': 'false'
      },
      body: JSON.stringify(data)
    });
    const result = await upstream.json();
    return res.status(upstream.status).json(result);
  }

  return res.status(400).json({ error: 'Invalid request' });
}
