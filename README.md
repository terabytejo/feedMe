# feedMe

A personal fridge tracker and recipe matcher: log what's in your fridge, keep
a database of recipe ideas, and see which ones you can cook right now —
ranked toward whatever's about to expire, and scaled to how many servings you
actually need.

Live at: https://terabytejo.github.io/feedMe/

## Structure

```
feedMe/
├── frontend/              React + Vite single-page app
│   └── src/
│       ├── components/    FridgeTab, IdeasTab, TonightTab, SyncTab, NavTabs
│       ├── lib/            storage.js, dates.js, ingredients.js, github.js
│       └── App.jsx
├── .github/workflows/     builds frontend/ and deploys it to GitHub Pages
└── backend/               (not yet — see below)
```

`frontend` is currently self-contained: all data lives in the browser's
`localStorage`, and cross-device sync is done via a private GitHub Gist
(`src/lib/github.js`), entered by the user in the Sync tab.

### Why it's split this way

Every read/write to app data goes through `src/lib/storage.js`, and every
sync call goes through `src/lib/github.js`. No component talks to
`localStorage` or the GitHub API directly. That's intentional: when a real
backend is added later, only those two files (plus a new `backend/` service)
need to change — the components and their props stay the same.

## Local development

```
cd frontend
npm install
npm run dev
```

## Deploying

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds
`frontend/` with Vite and publishes `frontend/dist` to GitHub Pages
automatically. No manual copy-to-index.html step anymore.

## Planned: backend

A lightweight backend is planned to replace the Gist-sync hack — likely
Node/Express with a small database, hiding the user's GitHub token
server-side and giving each device automatic sync instead of manual
push/pull. That will live in a sibling `backend/` folder and need its own
hosting (GitHub Pages only serves static files).
