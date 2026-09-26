// GitHub Gist–backed sync. This is a stand-in cloud layer for a single-user
// app with no server. When a real backend exists, replace the three
// functions below with calls to it (same shapes: createStore, pushState,
// pullState) and SyncTab.jsx won't need to change at all.

const API = 'https://api.github.com/gists';
const FILE = 'feedme-data.json';

function headers(token) {
  return {
    Authorization: 'token ' + token,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
  };
}

export async function createGist(token, state) {
  const res = await fetch(API, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({
      description: 'feedMe sync data',
      public: false,
      files: { [FILE]: { content: JSON.stringify(state, null, 2) } },
    }),
  });
  if (!res.ok) throw new Error('GitHub said: ' + res.status);
  return (await res.json()).id;
}

export async function pushState(token, gistId, state) {
  const res = await fetch(`${API}/${gistId}`, {
    method: 'PATCH',
    headers: headers(token),
    body: JSON.stringify({ files: { [FILE]: { content: JSON.stringify(state, null, 2) } } }),
  });
  if (!res.ok) throw new Error('GitHub said: ' + res.status);
}

export async function pullState(token, gistId) {
  const res = await fetch(`${API}/${gistId}`, { headers: headers(token) });
  if (!res.ok) throw new Error('GitHub said: ' + res.status);
  const data = await res.json();
  const file = data.files[FILE];
  if (!file) throw new Error('no feedme-data.json in that gist');
  return JSON.parse(file.content);
}
