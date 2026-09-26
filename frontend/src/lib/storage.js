// Local persistence layer.
//
// Every read/write in the app goes through load()/save() rather than
// touching localStorage directly, so that when a real backend exists later,
// only this file needs to change (e.g. to fetch()/POST to an API) — no
// component code should need to know where the data actually lives.

const PREFIX = 'fm_';

export function load(key, fallback) {
  try {
    const v = localStorage.getItem(PREFIX + key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

export function save(key, val) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(val));
  } catch {
    // storage unavailable (private browsing, quota, etc.) — fail silently
  }
}
