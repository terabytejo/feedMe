import { useState } from 'react';
import { load, save } from '../lib/storage.js';
import { createGist, pushState, pullState } from '../lib/github.js';

export default function SyncTab({ state, applyState }) {
  const [token, setToken] = useState(() => load('gh_token', ''));
  const [gistId, setGistId] = useState(() => load('gist_id', ''));
  const [lastSync, setLastSync] = useState(() => load('last_sync', ''));
  const [status, setStatus] = useState('');
  const [error, setError] = useState(false);

  function persistCreds(t, g) {
    save('gh_token', t);
    save('gist_id', g);
  }
  function markSynced() {
    const now = new Date().toLocaleString();
    setLastSync(now);
    save('last_sync', now);
  }

  async function handleCreate() {
    persistCreds(token, gistId);
    if (!token) { setStatus('Paste a token first.'); setError(true); return; }
    setStatus('Creating…'); setError(false);
    try {
      const id = await createGist(token, state);
      setGistId(id); save('gist_id', id);
      markSynced();
      setStatus('Created and synced. Use this same Gist ID on your other device.');
    } catch (e) { setStatus('Could not create gist — ' + e.message); setError(true); }
  }
  async function handlePush() {
    persistCreds(token, gistId);
    if (!token || !gistId) { setStatus('Need both a token and a Gist ID.'); setError(true); return; }
    setStatus('Pushing…'); setError(false);
    try {
      await pushState(token, gistId, state);
      markSynced();
      setStatus('Pushed.');
    } catch (e) { setStatus('Push failed — ' + e.message); setError(true); }
  }
  async function handlePull() {
    persistCreds(token, gistId);
    if (!token || !gistId) { setStatus('Need both a token and a Gist ID.'); setError(true); return; }
    setStatus('Pulling…'); setError(false);
    try {
      const data = await pullState(token, gistId);
      applyState(data);
      markSynced();
      setStatus('Pulled.');
    } catch (e) { setStatus('Pull failed — ' + e.message); setError(true); }
  }

  return (
    <div className="card">
      <h3 style={{ marginBottom: 6 }}>Sync across devices</h3>
      <p style={{ color: 'var(--sub)', fontSize: 13, margin: '0 0 12px' }}>
        Uses a private GitHub Gist as a small cloud drop point for your data. Create a token scoped to{' '}
        <strong>gist</strong> only (github.com/settings/tokens) — not the same token used to deploy this page.
        Note: a "secret" gist isn't listed publicly, but anyone who gets the Gist ID could still view its
        contents, so don't share it.
      </p>
      <label className="small">GitHub token (gist scope)</label>
      <div className="row">
        <input type="password" value={token} placeholder="ghp_..." onChange={e => setToken(e.target.value)} />
      </div>
      <label className="small">Gist ID</label>
      <div className="row">
        <input type="text" value={gistId} placeholder="leave blank to create one" onChange={e => setGistId(e.target.value)} />
      </div>
      <div className="row">
        <button className="btn secondary" onClick={handleCreate}>Create new gist</button>
        <button className="btn secondary" onClick={handlePull}>Pull from cloud</button>
        <button className="btn" onClick={handlePush}>Push to cloud</button>
      </div>
      <div style={{ fontSize: 13, marginTop: 8, color: error ? 'var(--danger)' : 'var(--ok)' }}>
        {status || (lastSync ? `Last synced ${lastSync}.` : 'Not synced yet.')}
      </div>
    </div>
  );
}
