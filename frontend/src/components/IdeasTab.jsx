import { useState } from 'react';
import { parseIngredientLine, fmtQty, isStar } from '../lib/ingredients.js';

export default function IdeasTab({ ideas, setIdeas, stars }) {
  const [title, setTitle] = useState('');
  const [servings, setServings] = useState(4);
  const [ingredientsText, setIngredientsText] = useState('');

  function addIdea() {
    if (!title.trim()) return;
    const ingredients = ingredientsText.split('\n').map(parseIngredientLine).filter(Boolean);
    setIdeas([...ideas, { id: crypto.randomUUID(), title: title.trim(), servings: parseInt(servings) || 4, ingredients }]);
    setTitle(''); setServings(4); setIngredientsText('');
  }
  function removeIdea(id) {
    setIdeas(ideas.filter(i => i.id !== id));
  }

  return (
    <>
      <div className="card">
        <h3 style={{ marginBottom: 10 }}>Save a recipe idea</h3>
        <div className="row">
          <input type="text" placeholder="Recipe name" style={{ flex: 2 }} value={title} onChange={e => setTitle(e.target.value)} />
          <input type="number" placeholder="Serves" min="1" style={{ maxWidth: 80 }} value={servings} onChange={e => setServings(e.target.value)} />
        </div>
        <label className="small">Ingredients — one per line, e.g. "2 chicken breasts" or "1 cup rice"</label>
        <textarea
          placeholder={'2 chicken breasts\n1 eggplant\n3 tbsp olive oil'}
          value={ingredientsText}
          onChange={e => setIngredientsText(e.target.value)}
        />
        <div className="row" style={{ marginTop: 8 }}>
          <button className="btn" onClick={addIdea}>Save idea</button>
        </div>
      </div>
      <div className="card">
        <h3 style={{ marginBottom: 10 }}>Idea database ({ideas.length})</h3>
        {ideas.length ? ideas.map(i => (
          <div className="idea" key={i.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <h3>{i.title}</h3>
              <button className="icon" onClick={() => removeIdea(i.id)}>✕</button>
            </div>
            <div className="meta" style={{ color: 'var(--sub)', fontSize: 12 }}>serves {i.servings}</div>
            <ul>
              {i.ingredients.map((ing, idx) => (
                <li key={idx}>
                  {fmtQty(ing.qty)} {ing.unit}{' '}
                  {isStar(ing.name, stars) ? <span className="starred">{ing.name}</span> : ing.name}
                </li>
              ))}
            </ul>
          </div>
        )) : <div className="empty">No ideas saved yet.</div>}
      </div>
    </>
  );
}
