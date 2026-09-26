import { matchIdea, fmtQty, isStar } from '../lib/ingredients.js';

export default function TonightTab({ ideas, fridge, stars, servings, setServings }) {
  const scored = ideas
    .map(idea => ({ idea, m: matchIdea(idea, fridge) }))
    .sort((a, b) =>
      b.m.expiringUsed.length - a.m.expiringUsed.length ||
      (b.m.matched / b.m.total) - (a.m.matched / a.m.total)
    );

  return (
    <>
      <div className="servings-box">
        <label className="small" style={{ margin: 0 }}>Cooking for</label>
        <input type="number" min="1" value={servings} onChange={e => setServings(parseFloat(e.target.value) || 1)} />
        <span className="sub" style={{ color: 'var(--sub)', fontSize: 13 }}>serving(s)</span>
      </div>
      {scored.length ? scored.map(({ idea, m }) => (
        <div className="idea" key={idea.id}>
          <h3>{idea.title}</h3>
          <div className="badges">
            <span className="badge match">{m.matched}/{m.total} ingredients on hand</span>
            {m.expiringUsed.length > 0 && (
              <span className="badge expiring">uses {m.expiringUsed.join(', ')} — expiring soon</span>
            )}
          </div>
          <ul>
            {m.lines.map((l, idx) => {
              const factor = servings / idea.servings;
              const scaled = fmtQty(l.qty * factor);
              return (
                <li key={idx} className={l.have ? 'have' : 'missing'}>
                  {scaled} {l.unit}{' '}
                  {isStar(l.name, stars) ? <span className="starred">{l.name}</span> : l.name}
                  {!l.have && ' — need to buy'}
                </li>
              );
            })}
          </ul>
        </div>
      )) : (
        <div className="empty">
          Save some recipe ideas first — they&#39;ll show up here ranked by what you can make right now.
        </div>
      )}
    </>
  );
}
