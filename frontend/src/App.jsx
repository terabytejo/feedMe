import { useState, useEffect } from 'react';
import { load, save } from './lib/storage.js';
import NavTabs from './components/NavTabs.jsx';
import FridgeTab from './components/FridgeTab.jsx';
import IdeasTab from './components/IdeasTab.jsx';
import TonightTab from './components/TonightTab.jsx';
import SyncTab from './components/SyncTab.jsx';

const DEFAULT_STARS = ['chicken', 'eggplant', 'eggs', 'fresh mozzarella'];

export default function App() {
  const [tab, setTab] = useState('fridge');
  const [fridge, setFridge] = useState(() => load('fridge', []));
  const [ideas, setIdeas] = useState(() => load('ideas', []));
  const [stars, setStars] = useState(() => load('stars', DEFAULT_STARS));
  const [servings, setServings] = useState(() => load('servings', 1));

  useEffect(() => save('fridge', fridge), [fridge]);
  useEffect(() => save('ideas', ideas), [ideas]);
  useEffect(() => save('stars', stars), [stars]);
  useEffect(() => save('servings', servings), [servings]);

  const state = { fridge, ideas, stars, servingsForMe: servings };
  function applyState(d) {
    setFridge(d.fridge || []);
    setIdeas(d.ideas || []);
    setStars(d.stars || []);
    setServings(d.servingsForMe || 1);
  }

  return (
    <div className="wrap">
      <header>
        <div>
          <h1>feedMe</h1>
          <div className="sub">what you've got, what to make</div>
        </div>
      </header>
      <NavTabs tab={tab} setTab={setTab} />
      {tab === 'fridge' && <FridgeTab fridge={fridge} setFridge={setFridge} stars={stars} setStars={setStars} />}
      {tab === 'ideas' && <IdeasTab ideas={ideas} setIdeas={setIdeas} stars={stars} />}
      {tab === 'tonight' && (
        <TonightTab ideas={ideas} fridge={fridge} stars={stars} servings={servings} setServings={setServings} />
      )}
      {tab === 'sync' && <SyncTab state={state} applyState={applyState} />}
      <footer className="hint">Saved privately in this browser only, unless you sync.</footer>
    </div>
  );
}
