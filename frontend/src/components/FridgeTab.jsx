import { useState } from 'react';
import { daysUntil, expiryStatus, expiryLabel } from '../lib/dates.js';
import { isStar } from '../lib/ingredients.js';

export default function FridgeTab({ fridge, setFridge, stars, setStars }) {
  const [name, setName] = useState('');
  const [qty, setQty] = useState('');
  const [unit, setUnit] = useState('');
  const [expiry, setExpiry] = useState('');
  const [starInput, setStarInput] = useState('');

  function addItem() {
    if (!name.trim()) return;
    setFridge([...fridge, { id: crypto.randomUUID(), name: name.trim(), qty, unit, expiry }]);
    setName(''); setQty(''); setUnit(''); setExpiry('');
  }
  function removeItem(id) {
    setFridge(fridge.filter(i => i.id !== id));
  }
  function addStar() {
    const v = starInput.trim().toLowerCase();
    if (v && !stars.includes(v)) setStars([...stars, v]);
    setStarInput('');
  }
  function removeStar(s) {
    setStars(stars.filter(x => x !== s));
  }

  const sorted = [...fridge].sort((a, b) => {
    const da = daysUntil(a.expiry), db = daysUntil(b.expiry);
    if (da === null) return 1;
    if (db === null) return -1;
    return da - db;
  });

  return (
    <>
      <div className="card">
        <h3 style={{ marginBottom: 10 }}>Add to fridge</h3>
        <div className="row">
          <input type="text" placeholder="Ingredient name" value={name} onChange={e => setName(e.target.value)} />
          <input type="text" placeholder="Qty" style={{ maxWidth: 70 }} value={qty} onChange={e => setQty(e.target.value)} />
          <input type="text" placeholder="Unit" style={{ maxWidth: 80 }} value={unit} onChange={e => setUnit(e.target.value)} />
          <input type="date" value={expiry} onChange={e => setExpiry(e.target.value)} />
          <button className="btn" onClick={addItem}>Add</button>
        </div>
        <label className="small">Star ingredients (always highlighted)</label>
        <div className="pill-list">
          {stars.length
            ? stars.map(s => (
                <span className="pill" key={s}>
                  {s}<button onClick={() => removeStar(s)}>✕</button>
                </span>
              ))
            : <span className="sub" style={{ fontSize: 12, color: 'var(--sub)' }}>none set</span>}
        </div>
        <div className="row" style={{ marginTop: 8 }}>
          <input type="text" placeholder="Add a star ingredient" value={starInput} onChange={e => setStarInput(e.target.value)} />
          <button className="btn secondary" onClick={addStar}>Add</button>
        </div>
      </div>
      <div className="card">
        <h3 style={{ marginBottom: 6 }}>In the fridge ({fridge.length})</h3>
        {sorted.length ? sorted.map(it => {
          const d = daysUntil(it.expiry);
          const status = expiryStatus(d);
          const star = isStar(it.name, stars);
          return (
            <div className="item" key={it.id}>
              <span className={`dot ${status}`}></span>
              <span className="name">{it.name}{star && <span className="star-tag"> ★ star</span>}</span>
              <span className="meta">{it.qty} {it.unit}</span>
              <span className="meta">{expiryLabel(d)}</span>
              <button className="icon" onClick={() => removeItem(it.id)}>✕</button>
            </div>
          );
        }) : <div className="empty">Nothing logged yet — add what you&#39;ve got above.</div>}
      </div>
    </>
  );
}
