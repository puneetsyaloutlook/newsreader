<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SignalCatcher</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600&family=Lora:wght@600;700&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --primary: #479FA4;
  --action: #376DA4;
  --n900: #1A1A2E;
  --n500: #8E8E9A;
  --n300: #B8B8C2;
  --n200: #D4D4DA;
  --n100: #EDEDF0;
  --warm100: #F5F0E6;
  --page: #FFFFFF;
  --border: var(--n200);
  --border-strong: var(--n300);
  --text: var(--n900);
  --muted: var(--n500);
  --link: var(--action);
  --sans: 'Barlow', system-ui, sans-serif;
  --serif: 'Lora', Georgia, serif;
  --r: 6px; --rl: 8px;
}
html, body { height: 100%; }
body { font-family: var(--sans); font-size: 1rem; line-height: 1.6; color: var(--text); background: var(--n100); display: flex; min-height: 100vh; }

.sidebar { width: 220px; min-width: 220px; background: var(--page); border-right: 1px solid var(--border); display: flex; flex-direction: column; min-height: 100vh; position: sticky; top: 0; height: 100vh; overflow-y: auto; transition: transform 0.2s; }
.sidebar-inner { padding: 0 0 1rem; display: flex; flex-direction: column; height: 100%; }
.sidebar-close { display: none; background: none; border: none; border-bottom: 1px solid var(--border); font-size: 0.78rem; font-weight: 600; color: var(--muted); cursor: pointer; padding: 12px 1rem; text-align: right; line-height: 1; font-family: var(--sans); letter-spacing: 0.02em; width: 100%; }
.nav-group-label { font-size: 0.63rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--n300); padding: 1rem 1rem 0.3rem; }
.nav-items { flex: 1; overflow-y: auto; }
.nav-item { display: block; width: 100%; text-align: left; font-family: var(--sans); font-size: 0.82rem; font-weight: 500; line-height: 1.35; color: var(--muted); background: none; border: none; padding: 8px 1rem; cursor: pointer; transition: background 0.1s, color 0.1s; border-left: 3px solid transparent; }
.nav-item:hover { background: rgba(0,0,0,0.03); color: var(--text); }
.nav-item.active { background: rgba(71,159,164,0.08); color: var(--text); border-left-color: var(--primary); font-weight: 600; }
.sidebar-footer { padding: 1rem; border-top: 1px solid var(--border); margin-top: auto; display: flex; flex-direction: column; gap: 6px; }
.add-btn { display: block; width: 100%; text-align: left; font-family: var(--sans); font-size: 0.78rem; font-weight: 600; color: var(--muted); background: none; border: 1px dashed var(--border-strong); border-radius: var(--r); padding: 7px 12px; cursor: pointer; transition: all 0.1s; }
.add-btn:hover { color: var(--primary); border-color: var(--primary); }

.nav-toggle { display: none; position: fixed; top: 12px; left: 12px; z-index: 200; background: var(--page); border: 1px solid var(--border); border-radius: var(--r); padding: 5px 9px; font-size: 0.85rem; cursor: pointer; line-height: 1; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
.nav-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 150; }

.main { flex: 1; min-width: 0; padding: 2.5rem 2rem; max-width: 820px; }

.nav-toggle-inline { display: none; background: none; border: 1px solid var(--border); border-radius: var(--r); font-size: 1rem; color: var(--muted); cursor: pointer; padding: 2px 7px; line-height: 1; flex-shrink: 0; }

@media (max-width: 680px) {
  .nav-toggle { display: none; }
  .nav-toggle-inline { display: block; }
  .sidebar { position: fixed; left: 0; top: 0; z-index: 160; transform: translateX(-100%); width: calc(100vw - 48px); min-width: 0; }
  .sidebar.open { transform: translateX(0); }
  .sidebar-close { display: block; }
  .nav-overlay.open { display: block; }
  .main { padding: 1.5rem 1rem; }
}
.topic-header { margin-bottom: 1.5rem; }
.topic-heading-row { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
.topic-name { font-family: var(--serif); font-size: 1.35rem; font-weight: 700; color: var(--text); line-height: 1.25; }
.topic-meta { font-size: 0.75rem; color: var(--muted); }

.controls { display: flex; align-items: center; gap: 8px; margin-bottom: 1.25rem; flex-wrap: wrap; }
.controls .cache-banner { margin-left: auto; margin-bottom: 0; }
.btn { font-family: var(--sans); font-size: 0.78rem; font-weight: 600; padding: 8px 16px; border-radius: var(--r); border: 1px solid var(--border-strong); background: var(--page); color: var(--text); cursor: pointer; white-space: nowrap; transition: background 0.1s; }
.btn:hover { background: var(--n100); }
.btn:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-primary { background: var(--primary); color: #fff; border-color: var(--primary); }
.btn-primary:hover { background: #3a8a8f; border-color: #3a8a8f; }
.btn-danger { color: #a02020; border-color: #d4b0b0; }
.btn-danger:hover { background: rgba(214,69,69,0.06); }

.status-bar { font-size: 0.75rem; color: var(--muted); min-height: 1.1rem; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 8px; }
.spinner { width: 11px; height: 11px; border: 2px solid var(--n300); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.7s linear infinite; display: none; flex-shrink: 0; }
@keyframes spin { to { transform: rotate(360deg); } }
.spinner.active { display: inline-block; }

.results { display: flex; flex-direction: column; gap: 10px; }
.card { background: var(--page); border: 1px solid var(--border); border-radius: var(--rl); padding: 1rem 1.2rem; transition: border-color 0.1s; }
.card:hover { border-color: var(--border-strong); }
.card-top { display: flex; align-items: center; gap: 8px; margin-bottom: 7px; }
.score-pill { font-size: 0.68rem; font-weight: 600; padding: 2px 8px; border-radius: 9999px; flex-shrink: 0; }
.score-high { background: rgba(71,159,164,0.12); color: #1D6068; }
.score-mid { background: rgba(195,154,68,0.12); color: #7a5c1a; }
.card-source { font-size: 0.72rem; color: var(--muted); }
.card-title { font-size: 0.93rem; font-weight: 600; line-height: 1.4; margin-bottom: 5px; }
.card-title a { color: var(--text); text-decoration: none; }
.card-title a:hover { color: var(--link); text-decoration: underline; }
.card-why { font-size: 0.78rem; color: var(--muted); line-height: 1.55; }

.cache-banner { font-size: 0.72rem; color: var(--muted); padding: 6px 10px; background: var(--n100); border-radius: var(--r); border: 1px solid var(--border); display: inline-block; }
.cache-empty { font-style: italic; }
.empty-state { padding: 2.5rem 0; color: var(--muted); font-size: 0.85rem; }
.error-msg { font-size: 0.78rem; color: #a02020; background: rgba(214,69,69,0.07); border: 1px solid rgba(214,69,69,0.18); border-radius: var(--r); padding: 10px 14px; }

.panel { background: var(--warm100); border: 1px solid var(--border); border-radius: var(--rl); padding: 1.2rem; margin-bottom: 1.25rem; display: none; }
.panel.open { display: block; }
.panel-row { margin-bottom: 11px; }
.panel label { font-size: 0.75rem; font-weight: 600; color: var(--muted); display: block; margin-bottom: 4px; }
.panel input[type="text"], .panel textarea { width: 100%; font-family: var(--sans); font-size: 0.85rem; line-height: 1.5; color: var(--text); background: var(--page); border: 1px solid var(--border); border-radius: var(--r); padding: 8px 11px; }
.panel textarea { resize: vertical; min-height: 88px; }
.panel input:focus, .panel textarea:focus { outline: none; border-color: var(--action); }
.panel-actions { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.panel-actions .spacer { flex: 1; }
.no-topic { color: var(--muted); font-size: 0.9rem; padding-top: 1rem; }
</style>
</head>
<body>

<button class="nav-toggle" onclick="toggleNav()" aria-label="Open navigation">&#8250;</button>
<div class="nav-overlay" id="navOverlay" onclick="closeNav()"></div>

<aside class="sidebar" id="sidebar">
  <div class="sidebar-inner">
    <button class="sidebar-close" onclick="closeNav()" aria-label="Close navigation">Close &#8249;</button>
    <div class="nav-items" id="navItems"></div>
    <div class="sidebar-footer">
      <button class="add-btn" onclick="startNewTopic()">+ Add topic</button>
      <button class="add-btn" onclick="openSyncPanel()">⟳ Sync devices</button>
    </div>
  </div>
</aside>

<main class="main" id="mainArea"></main>

<div id="syncOverlay" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.4); z-index:100; align-items:center; justify-content:center;">
  <div style="background:#fff; border-radius:10px; padding:1.5rem; max-width:420px; width:90%; box-shadow:0 8px 32px rgba(0,0,0,0.18);">
    <div style="font-family:var(--serif); font-size:1.1rem; font-weight:700; margin-bottom:0.5rem;">Sync devices</div>
    <p style="font-size:0.82rem; color:var(--muted); margin-bottom:1.25rem; line-height:1.55;">Copy the shareable link and open it on any other device to link automatically. Or use the sync code to link manually.</p>
    <div style="margin-bottom:1rem;">
      <label style="font-size:0.75rem; font-weight:600; color:var(--muted); display:block; margin-bottom:4px;">Shareable link</label>
      <div style="display:flex; gap:8px;">
        <input type="text" id="syncLinkDisplay" readonly style="flex:1; font-family:monospace; font-size:0.75rem; padding:7px 10px; border:1px solid var(--border); border-radius:var(--r); background:var(--n100); color:var(--text);" />
        <button class="btn" onclick="copySyncLink()">Copy</button>
      </div>
      <div style="font-size:0.72rem; color:var(--muted); margin-top:4px;">Opening this URL on another device links it automatically.</div>
    </div>
    <div style="margin-bottom:1rem;">
      <label style="font-size:0.75rem; font-weight:600; color:var(--muted); display:block; margin-bottom:4px;">Sync code</label>
      <div style="display:flex; gap:8px;">
        <input type="text" id="syncCodeDisplay" readonly style="flex:1; font-family:monospace; font-size:0.8rem; padding:7px 10px; border:1px solid var(--border); border-radius:var(--r); background:var(--n100); color:var(--text);" />
        <button class="btn" onclick="copySyncCode()">Copy</button>
      </div>
    </div>
    <div style="margin-bottom:1.25rem;">
      <label style="font-size:0.75rem; font-weight:600; color:var(--muted); display:block; margin-bottom:4px;">Link to another device</label>
      <div style="display:flex; gap:8px;">
        <input type="text" id="syncCodeInput" placeholder="Paste sync code here" style="flex:1; font-size:0.82rem; padding:7px 10px; border:1px solid var(--border); border-radius:var(--r); font-family:monospace;" />
        <button class="btn btn-primary" onclick="applySyncCode()">Link</button>
      </div>
      <div id="syncMsg" style="font-size:0.75rem; margin-top:6px; min-height:1rem;"></div>
    </div>
    <div style="text-align:right;">
      <button class="btn" onclick="closeSyncPanel()">Close</button>
    </div>
  </div>
</div>

<script>
const TOPICS_KEY  = 'signal-filter-topics';
const USER_ID_KEY = 'signal-filter-uid';
const BIN_ID_KEY  = 'signal-filter-bin';

const DEFAULT_TOPICS = [
  {
    id: 'agentic',
    group: 'AI',
    name: 'Agentic systems & work',
    description: `The evolution of agentic AI systems in enterprise contexts, including how they are being designed, deployed, and governed in real organisational settings. How these systems are changing the nature of work — not just job displacement, but shifts in decision-making authority, skill requirements, team structures, and the distribution of cognitive labour. The design of interfaces and interaction patterns between people and agentic systems, including how trust, oversight, and control are being negotiated in practice. What early deployments are revealing about gaps between anticipated and actual outcomes. Empirical accounts and practitioner analysis preferred over vendor narratives or speculative commentary.`
  },
  {
    id: 'hcd-ai',
    group: 'AI',
    name: 'Human-centred AI design',
    description: `Human-centred design of AI systems, covering both practice and research. This includes how designers and product teams are rethinking solution architecture to work with AI's actual capabilities rather than forcing it into familiar patterns. What research institutions, HCD labs, and AI ethics bodies are learning about how people experience and interact with AI in real contexts. Emerging interaction patterns, mental models, and design primitives specific to AI. Empirical findings and practitioner case studies preferred over trend pieces or general commentary.`
  }
];

// ── Storage ──────────────────────────────────────────────────────────────────

const RESULTS_CACHE_KEY = 'signal-filter-results';

function loadLocalResults() {
  try { const s = localStorage.getItem(RESULTS_CACHE_KEY); return s ? JSON.parse(s) : {}; }
  catch(e) { return {}; }
}
function saveLocalResults(data) {
  try { localStorage.setItem(RESULTS_CACHE_KEY, JSON.stringify(data)); } catch(e) {}
}

function loadTopics() {
  try { const s = localStorage.getItem(TOPICS_KEY); return s ? JSON.parse(s) : DEFAULT_TOPICS; }
  catch(e) { return DEFAULT_TOPICS; }
}
function saveTopics(t) {
  try { localStorage.setItem(TOPICS_KEY, JSON.stringify(t)); } catch(e) {}
  if (_remoteCache !== null) _remoteCache._topics = t;
  ensureBinExists().then(() => saveTopicsRemote(t));
}

function getUserId() {
  let uid = localStorage.getItem(USER_ID_KEY);
  if (!uid) {
    uid = 'u-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(USER_ID_KEY, uid);
  }
  return uid;
}
function getBinId() { return localStorage.getItem(BIN_ID_KEY) || null; }
function setBinId(id) { localStorage.setItem(BIN_ID_KEY, id); }

let _remoteCache = {};
let _remoteCacheLoaded = false;

async function loadRemoteCache() {
  if (_remoteCacheLoaded) return _remoteCache;
  const binId = getBinId();
  if (!binId) { _remoteCacheLoaded = true; return _remoteCache; }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`/api/cache?binId=${binId}`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) { _remoteCacheLoaded = true; return _remoteCache; }
    _remoteCache = await res.json() || {};
    _remoteCacheLoaded = true;
    return _remoteCache;
  } catch(e) { _remoteCacheLoaded = true; return _remoteCache; }
}

async function saveRemoteCache() {
  if (!_remoteCache) return;
  const binId = getBinId();
  try {
    if (binId) {
      await fetch(`/api/cache?binId=${binId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: _remoteCache })
      });
    } else {
      const res = await fetch('/api/cache', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: getUserId(), data: _remoteCache })
      });
      const result = await res.json();
      if (result.metadata?.id) setBinId(result.metadata.id);
    }
  } catch(e) {}
}

async function ensureBinExists() {
  if (getBinId()) return;
  if (!_remoteCache) _remoteCache = {};
  _remoteCache._topics = topics;
  await saveRemoteCache();
}

async function loadResults(id) {
  const local = loadLocalResults();
  if (local[id]) return local[id];
  try {
    const cache = await loadRemoteCache();
    if (cache[id]) {
      local[id] = cache[id];
      saveLocalResults(local);
    }
    return cache[id] || null;
  } catch(e) { return null; }
}

async function saveResults(id, data) {
  const local = loadLocalResults();
  local[id] = data;
  saveLocalResults(local);
  try {
    const cache = await loadRemoteCache();
    cache[id] = data;
    _remoteCache = cache;
    await saveRemoteCache();
  } catch(e) {}
}

async function saveTopicsRemote(t) {
  try {
    const cache = await loadRemoteCache();
    cache._topics = t;
    _remoteCache = cache;
    await saveRemoteCache();
  } catch(e) {}
}

async function loadTopicsRemote() {
  try {
    const cache = await loadRemoteCache();
    return cache._topics || null;
  } catch(e) { return null; }
}

// ── Topics ───────────────────────────────────────────────────────────────────

let topics = loadTopics();
let activeId = topics.length ? topics[0].id : null;
let editingNew = false;

function esc(s) { return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function genId() { return 't' + Date.now(); }

function renderNav() {
  const groups = [];
  const seen = {};
  topics.forEach(t => { const g = t.group||'Other'; if (!seen[g]) { seen[g]=true; groups.push(g); } });
  let html = '';
  groups.forEach(g => {
    html += `<div class="nav-group-label">${esc(g)}</div>`;
    topics.filter(t => (t.group||'Other') === g).forEach(t => {
      html += `<button class="nav-item${t.id===activeId&&!editingNew?' active':''}" onclick="switchTopic('${t.id}')">${esc(t.name)}</button>`;
    });
  });
  document.getElementById('navItems').innerHTML = html;
}

function toggleNav() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('navOverlay').classList.toggle('open');
}
function closeNav() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('navOverlay').classList.remove('open');
}

function switchTopic(id) { activeId = id; editingNew = false; closeNav(); renderNav(); renderMain(); }

async function renderMain() {
  const area = document.getElementById('mainArea');
  if (!area) return;

  if (editingNew) {
    const existingGroups = [...new Set(topics.map(t => t.group||'Other'))];
    const groupOptions = existingGroups.map(g => `<option value="${esc(g)}">${esc(g)}</option>`).join('');
    area.innerHTML = `
      <div class="topic-header"><div class="topic-heading-row"><button class="nav-toggle-inline" onclick="toggleNav()" aria-label="Open navigation">&#8250;</button><div class="topic-name">New topic</div></div></div>
      <div class="panel open">
        <div id="step-raw">
          <div class="panel-row"><label>Describe what you want to follow</label><textarea id="rawDesc" rows="4" placeholder="Write as much or as little as you like. Claude will refine it into a complete topic description."></textarea></div>
          <div class="panel-actions">
            <button class="btn btn-primary" id="refineBtn" onclick="refineNewTopic()">Refine with Claude</button>
            <button class="btn" onclick="cancelNew()">Cancel</button>
          </div>
          <div class="status-bar" style="margin-top:10px;"><div class="spinner" id="refineSpinner"></div><span id="refineStatus"></span></div>
        </div>
        <div id="step-refined" style="display:none;">
          <div class="panel-row"><label>Topic name</label><input type="text" id="newName" /></div>
          <div class="panel-row"><label>Group</label><input type="text" id="newGroup" list="groupList" placeholder="e.g. AI, Design, Economics" /><datalist id="groupList">${groupOptions}</datalist></div>
          <div class="panel-row"><label>Look back</label><select id="newDays"><option value="1">1 day</option><option value="5" selected>5 days</option><option value="30">30 days</option><option value="90">90 days</option></select></div>
          <div class="panel-row"><label>Topic description</label><textarea id="newDesc" rows="6"></textarea></div>
          <div class="panel-actions">
            <button class="btn btn-primary" onclick="saveNewTopic()">Save topic</button>
            <button class="btn" onclick="reRefine()">Re-refine</button>
            <button class="btn" onclick="cancelNew()">Cancel</button>
          </div>
        </div>
      </div>`;
    document.getElementById('rawDesc').focus();
    return;
  }

  const topic = topics.find(t => t.id === activeId);
  if (!topic) { area.innerHTML = `<div class="no-topic">No topic selected.</div>`; return; }

  const days = topic.days || 5;
  const daysLabel = days === 1 ? '1 day' : `${days} days`;
  const existingGroups = [...new Set(topics.map(t => t.group||'Other'))];
  const groupOptions = existingGroups.map(g => `<option value="${esc(g)}">${esc(g)}</option>`).join('');

  area.innerHTML = `
    <div class="topic-header">
      <div class="topic-heading-row">
        <button class="nav-toggle-inline" onclick="toggleNav()" aria-label="Open navigation">&#8250;</button>
        <div class="topic-name" id="topicNameDisplay">${esc(topic.name)}</div>
      </div>
      <div class="topic-meta">Last ${daysLabel} &middot; up to 5 items &middot; quality filtered</div>
    </div>
    <div class="panel" id="editPanel">
      <div class="panel-row"><label>Topic name</label><input type="text" id="editName" value="${esc(topic.name)}" /></div>
      <div class="panel-row"><label>Group</label><input type="text" id="editGroup" list="editGroupList" value="${esc(topic.group||'')}" /><datalist id="editGroupList">${groupOptions}</datalist></div>
      <div class="panel-row"><label>Look back</label><select id="editDays"><option value="1"${days===1?' selected':''}>1 day</option><option value="5"${days===5?' selected':''}>5 days</option><option value="30"${days===30?' selected':''}>30 days</option><option value="90"${days===90?' selected':''}>90 days</option></select></div>
      <div class="panel-row"><label>Topic description</label><textarea id="editDesc">${esc(topic.description)}</textarea></div>
      <div class="panel-actions">
        <button class="btn btn-primary" onclick="saveTopic()">Save</button>
        <button class="btn" onclick="closePanel()">Cancel</button>
        <div class="spacer"></div>
        <button class="btn btn-danger" onclick="deleteTopic('${topic.id}')">Delete topic</button>
      </div>
    </div>
    <div class="controls">
      <button class="btn btn-primary" id="fetchBtn" onclick="runSearch()">Fetch latest</button>
      <button class="btn" onclick="togglePanel()">Edit topic</button>
      <div class="spinner" id="spinner"></div>
      <span id="statusText"></span>
      <div class="cache-banner cache-empty" id="cacheBanner">Loading...</div>
    </div>
    <div class="results" id="results"></div>`;

  let cached = null;
  try { cached = await loadResults(topic.id); } catch(e) {}
  const banner = document.getElementById('cacheBanner');
  const resultsEl = document.getElementById('results');
  if (banner) {
    if (cached) { banner.textContent = 'Fetched ' + esc(cached.timestamp || cached.time); banner.classList.remove('cache-empty'); }
    else { banner.textContent = 'No results yet — hit fetch to run.'; }
  }
  if (resultsEl) resultsEl.innerHTML = cached ? renderCards(cached.items) : '';
}

function renderCards(items) {
  if (!items||!items.length) return '<div class="empty-state">Nothing cleared the filter.</div>';
  return items.map(item => `<div class="card">
    <div class="card-top">
      <span class="score-pill ${item.score>=85?'score-high':'score-mid'}">${item.score}</span>
      <span class="card-source">${esc(item.source)}${item.published?' &middot; '+esc(item.published):''}</span>
    </div>
    <div class="card-title"><a href="${esc(item.url)}" target="_blank" rel="noopener">${esc(item.title)}</a></div>
    <div class="card-why">${esc(item.why)}</div>
  </div>`).join('');
}

function togglePanel() { document.getElementById('editPanel').classList.toggle('open'); }
function closePanel()  { document.getElementById('editPanel').classList.remove('open'); }

function saveTopic() {
  const name  = document.getElementById('editName').value.trim();
  const desc  = document.getElementById('editDesc').value.trim();
  const group = document.getElementById('editGroup').value.trim() || 'Other';
  const days  = parseInt(document.getElementById('editDays').value) || 5;
  if (!name||!desc) return;
  const idx = topics.findIndex(t => t.id===activeId);
  if (idx===-1) return;
  topics[idx].name = name; topics[idx].description = desc; topics[idx].group = group; topics[idx].days = days;
  saveTopics(topics); closePanel();
  document.getElementById('topicNameDisplay').textContent = name;
  renderNav();
}

function deleteTopic(id) {
  if (!confirm('Delete this topic and its cached results?')) return;
  topics = topics.filter(t => t.id!==id);
  saveTopics(topics);
  if (_remoteCache) { delete _remoteCache[id]; saveRemoteCache(); }
  activeId = topics.length ? topics[0].id : null;
  renderNav(); renderMain();
}

function startNewTopic() { editingNew = true; renderNav(); renderMain(); }
function cancelNew() { editingNew = false; activeId = activeId||(topics.length?topics[0].id:null); renderNav(); renderMain(); }
function reRefine() { document.getElementById('step-refined').style.display='none'; document.getElementById('step-raw').style.display='block'; }

function saveNewTopic() {
  const name  = document.getElementById('newName').value.trim();
  const desc  = document.getElementById('newDesc').value.trim();
  const group = document.getElementById('newGroup').value.trim() || 'Other';
  const days  = parseInt(document.getElementById('newDays').value) || 5;
  if (!name||!desc) return;
  const t = { id: genId(), name, description: desc, group, days };
  topics.push(t); saveTopics(topics);
  editingNew = false; activeId = t.id;
  renderNav(); renderMain();
}

// ── API calls ────────────────────────────────────────────────────────────────

function sanitiseContent(content) {
  if (!Array.isArray(content)) return content;
  return content.filter(b => !(b.type==='text' && (!b.text||!b.text.trim())));
}

async function callAPI(messages, useSearch, maxTokens = 1000) {
  const body = { model: 'claude-sonnet-4-20250514', max_tokens: maxTokens, messages };
  if (useSearch) body.tools = [{ type: 'web_search_20250305', name: 'web_search' }];
  const res = await fetch('/api/claude', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
  });
  return res.json();
}

function extractText(data) {
  if (!data.content) return null;
  const b = data.content.find(b => b.type==='text');
  return b ? b.text : null;
}

function buildSearchPrompt(topic) {
  const days = topic.days || 5;
  const now = new Date();
  const today = now.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const cutoff = new Date(now - days * 24 * 60 * 60 * 1000).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
  const window = days === 1 ? 'last 24 hours' : `last ${days} days`;
  return `You are a research assistant with a precise editorial filter.

Today is ${today}. Only include items published on or after ${cutoff}.

Topic: ${topic.description}

Filter criteria — only surface items that:
- Were published within the ${window} (on or after ${cutoff}). Reject anything older, even if highly relevant.
- Contain genuine analysis, original observations, or reported evidence
- Come from researchers, practitioners, or experienced journalists
- Have direct, substantive relevance to the topic
- Avoid hype, sensationalism, and marketing framing

If fewer than 6 items published in the ${window} genuinely clear the bar, return only those that do. Do not pad results with older items. It is acceptable to return zero items if nothing recent qualifies.

Search the web for items published in the ${window}. Find no more than 6 candidates. For each write one line: title, source, URL, publication date, and one sentence on why it clears the filter.`;
}

function buildJsonPrompt(topic) {
  const days = topic ? (topic.days || 5) : 5;
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
  return `Return the best 5 of those candidates — or fewer if quality does not warrant 5 — as JSON only. No markdown, no preamble, no code fences. Exclude any item published before ${cutoff}. The "why" field must be under 40 words. Format:
{"items":[{"title":"...","url":"...","source":"...","score":85,"why":"...","published":"e.g. Apr 26"}]}
Score 70–100. Omit anything below 70. Hard limit: 5 items maximum.`;
}

function buildRefinePrompt(raw) {
  return `You are helping a user set up a personalised news filter topic. Refine their raw description into a well-structured topic suitable for use as a search and scoring brief.

User context: The user works in a strategy and AI governance role at Suncorp, based in Canberra, Australia. Their professional focus includes enterprise AI risk, AI governance frameworks, organisational impact of AI, and design. They follow both policy and practice angles, and prefer empirical findings and practitioner accounts over speculation or vendor narratives.

Raw description: ${raw}

Produce a refined topic description that fills logical gaps, adds relevant angles the user likely intends, applies their professional context where it sharpens the scope, and specifies what makes an item worth reading vs noise. 3–5 sentences, written as a coherent brief.

Also generate a short topic name (3–5 words, sentence case) and a group name (1–2 words, e.g. AI, Design, Economics).

Write out the name, group, and description in plain text.`;
}

async function refineNewTopic() {
  const raw = document.getElementById('rawDesc').value.trim();
  if (!raw) return;
  const btn = document.getElementById('refineBtn');
  const spinner = document.getElementById('refineSpinner');
  const status  = document.getElementById('refineStatus');
  btn.disabled = true; spinner.classList.add('active'); status.textContent = 'Refining...';
  try {
    const refinePrompt = buildRefinePrompt(raw);
    const turn1 = await callAPI([{ role: 'user', content: refinePrompt }], false);
    if (turn1.error) { spinner.classList.remove('active'); status.textContent = 'API error: ' + turn1.error.message; btn.disabled = false; return; }
    if (!extractText(turn1)) { spinner.classList.remove('active'); status.textContent = 'No response.'; btn.disabled = false; return; }

    const jsonPrompt = `Now return that as JSON only — no markdown, no preamble, no code fences:\n{"name":"...","group":"...","description":"..."}`;
    const turn2 = await callAPI([
      { role: 'user', content: refinePrompt },
      { role: 'assistant', content: sanitiseContent(turn1.content) },
      { role: 'user', content: jsonPrompt }
    ], false);
    if (turn2.error) { spinner.classList.remove('active'); status.textContent = 'API error: ' + turn2.error.message; btn.disabled = false; return; }
    const text = extractText(turn2);
    if (!text) { spinner.classList.remove('active'); status.textContent = 'No response.'; btn.disabled = false; return; }

    let parsed;
    try { const m = text.match(/\{[\s\S]*\}/); parsed = JSON.parse(m ? m[0] : text.replace(/```json|```/g,'').trim()); }
    catch(e) { spinner.classList.remove('active'); status.textContent = 'Could not parse response.'; btn.disabled = false; return; }

    spinner.classList.remove('active'); status.textContent = '';
    document.getElementById('step-raw').style.display = 'none';
    document.getElementById('step-refined').style.display = 'block';
    document.getElementById('newName').value  = parsed.name  || '';
    document.getElementById('newGroup').value = parsed.group || '';
    document.getElementById('newDesc').value  = parsed.description || '';
  } catch(e) { spinner.classList.remove('active'); status.textContent = 'Something went wrong.'; }
  btn.disabled = false;
}

async function runSearch() {
  const topic = topics.find(t => t.id===activeId);
  if (!topic) return;
  const btn = document.getElementById('fetchBtn');
  const spinner = document.getElementById('spinner');
  const statusText = document.getElementById('statusText');
  const results = document.getElementById('results');
  btn.disabled = true; spinner.classList.add('active');
  statusText.textContent = 'Searching...'; results.innerHTML = '';
  try {
    const turn1 = await callAPI([{ role: 'user', content: buildSearchPrompt(topic) }], true);
    if (turn1.error) { spinner.classList.remove('active'); statusText.textContent = ''; results.innerHTML = `<div class="error-msg">API error: ${esc(turn1.error.message)}</div>`; btn.disabled = false; return; }
    if (!extractText(turn1)) { spinner.classList.remove('active'); statusText.textContent = 'No response from search step.'; btn.disabled = false; return; }

    statusText.textContent = 'Scoring...';
    const turn2 = await callAPI([
      { role: 'user', content: buildSearchPrompt(topic) },
      { role: 'assistant', content: sanitiseContent(turn1.content) },
      { role: 'user', content: buildJsonPrompt(topic) }
    ], false, 1000);
    if (turn2.error) { spinner.classList.remove('active'); statusText.textContent = ''; results.innerHTML = `<div class="error-msg">API error: ${esc(turn2.error.message)}</div>`; btn.disabled = false; return; }

    const rawText = extractText(turn2);
    if (!rawText) { spinner.classList.remove('active'); statusText.textContent = 'No response from scoring step.'; btn.disabled = false; return; }

    let parsed;
    try { const m = rawText.match(/\{[\s\S]*\}/); parsed = JSON.parse(m ? m[0] : rawText.replace(/```json|```/g,'').trim()); }
    catch(e) { spinner.classList.remove('active'); statusText.textContent = 'Could not parse response.'; btn.disabled = false; return; }

    const items = (parsed.items||[]).filter(i => i.score>=70).slice(0,5);
    const now = new Date();
    const timestamp = now.toLocaleDateString('en-AU', { weekday:'short', day:'numeric', month:'short' }) +
      ' at ' + now.toLocaleTimeString('en-AU', { hour:'2-digit', minute:'2-digit' });
    await saveResults(topic.id, { items, timestamp });
    spinner.classList.remove('active'); statusText.textContent = '';
    const banner = document.getElementById('cacheBanner');
    if (banner) { banner.textContent = 'Fetched ' + timestamp; banner.classList.remove('cache-empty'); }
    results.innerHTML = renderCards(items);
  } catch(err) {
    spinner.classList.remove('active'); statusText.textContent = '';
    results.innerHTML = `<div class="error-msg">Something went wrong. Check your connection and try again.</div>`;
  }
  btn.disabled = false;
}

// ── Sync panel ───────────────────────────────────────────────────────────────

async function openSyncPanel() {
  document.getElementById('syncCodeDisplay').value = 'Saving...';
  document.getElementById('syncLinkDisplay').value = 'Saving...';
  document.getElementById('syncCodeInput').value = '';
  document.getElementById('syncMsg').textContent = '';
  document.getElementById('syncOverlay').style.display = 'flex';
  try {
    _remoteCache._topics = topics;
    await saveRemoteCache();
  } catch(e) {}
  const binId = getBinId() || 'not-yet-created';
  document.getElementById('syncCodeDisplay').value = getUserId() + '|' + binId;
  document.getElementById('syncLinkDisplay').value = window.location.origin + window.location.pathname + '?bin=' + binId;
}
function closeSyncPanel() { document.getElementById('syncOverlay').style.display = 'none'; }
function copySyncCode() {
  navigator.clipboard.writeText(document.getElementById('syncCodeDisplay').value).then(() => {
    const msg = document.getElementById('syncMsg');
    msg.style.color = '#1D6068'; msg.textContent = 'Copied to clipboard.';
  });
}
function copySyncLink() {
  navigator.clipboard.writeText(document.getElementById('syncLinkDisplay').value).then(() => {
    const msg = document.getElementById('syncMsg');
    msg.style.color = '#1D6068'; msg.textContent = 'Link copied to clipboard.';
  });
}
async function applySyncCode() {
  const raw = document.getElementById('syncCodeInput').value.trim();
  const msg = document.getElementById('syncMsg');
  if (!raw) { msg.style.color = '#a02020'; msg.textContent = 'Paste a sync code first.'; return; }
  const parts = raw.split('|');
  if (parts.length !== 2 || !parts[0] || !parts[1]) { msg.style.color = '#a02020'; msg.textContent = 'Invalid sync code.'; return; }
  const [uid, binId] = parts;
  msg.style.color = '#8E8E9A'; msg.textContent = 'Verifying...';
  try {
    const res = await fetch(`/api/cache?binId=${binId}`);
    if (!res.ok) { msg.style.color = '#a02020'; msg.textContent = 'Could not verify that sync code.'; return; }
    localStorage.setItem(USER_ID_KEY, uid);
    localStorage.setItem(BIN_ID_KEY, binId);
    _remoteCache = {};
    _remoteCacheLoaded = false;
    await loadRemoteCache();
    const remoteTopics = await loadTopicsRemote();
    if (remoteTopics && remoteTopics.length) {
      topics = remoteTopics;
      localStorage.setItem(TOPICS_KEY, JSON.stringify(topics));
      activeId = topics[0].id;
    }
    msg.style.color = '#1D6068'; msg.textContent = 'Linked. Results will now sync with that device.';
    setTimeout(() => { closeSyncPanel(); renderMain(); }, 1200);
  } catch(e) { msg.style.color = '#a02020'; msg.textContent = 'Something went wrong. Try again.'; }
}

// ── Init ─────────────────────────────────────────────────────────────────────

async function init() {
  getUserId();
  const urlParams = new URLSearchParams(window.location.search);
  const urlBin = urlParams.get('bin');
  if (urlBin) {
    setBinId(urlBin);
    history.replaceState(null, '', window.location.pathname);
  }

  // Render immediately from localStorage so the page is usable instantly
  renderNav();
  renderMain();

  // Sync from remote in the background
  try {
    if (!getBinId()) {
      const res = await fetch('/api/cache?registry=1');
      if (res.ok) {
        const data = await res.json();
        if (data.binId) {
          setBinId(data.binId);
          _remoteCacheLoaded = false;
        }
      }
    }
    await loadRemoteCache();
    const remoteTopics = await loadTopicsRemote();
    if (remoteTopics && remoteTopics.length) {
      topics = remoteTopics;
      localStorage.setItem(TOPICS_KEY, JSON.stringify(topics));
      activeId = activeId || topics[0].id;
      // Sync remote results into localStorage
      const local = loadLocalResults();
      let updated = false;
      for (const t of topics) {
        if (_remoteCache[t.id] && !local[t.id]) {
          local[t.id] = _remoteCache[t.id];
          updated = true;
        }
      }
      if (updated) saveLocalResults(local);
      renderNav();
      renderMain();
    }
  } catch(e) {}
}

init();

</script>
</body>
</html>
