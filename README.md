# Signal filter

A personal news reader that uses Claude to search, filter, and surface high-quality items across custom topics.

## Setup

### 1. Clone and push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
gh repo create signal-filter --public --push
```

### 2. Deploy to Vercel

Connect the repo in [vercel.com](https://vercel.com) and add one environment variable:

| Name | Value |
|------|-------|
| `JSONBIN_API_KEY` | Your JSONBin master key (from jsonbin.io → API Keys) |

Vercel will auto-deploy on every push to main.

### 3. Use it

Open your deployed URL. Results are stored in JSONBin under your account, keyed per user. To sync across devices, use the "Sync devices" button in the sidebar.

## Project structure

```
/public/index.html   — the app
/api/cache.js        — serverless proxy for JSONBin (keeps API key server-side)
/vercel.json         — Vercel routing config
```

## Notes

- The app calls the Anthropic API directly from the browser — each user's Claude subscription covers their own usage
- Topic descriptions and fetched results are stored in JSONBin; no other data is collected
- Topics are stored in localStorage per browser; to share topics across devices, export/import via the sync code
