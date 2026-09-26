const LABELS = { fridge: 'Fridge', ideas: 'Ideas', tonight: 'Tonight', sync: 'Sync' };

export default function NavTabs({ tab, setTab }) {
  return (
    <nav>
      {Object.keys(LABELS).map(t => (
        <button key={t} className={t === tab ? 'active' : ''} onClick={() => setTab(t)}>
          {LABELS[t]}
        </button>
      ))}
    </nav>
  );
}
