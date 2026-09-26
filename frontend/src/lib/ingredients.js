import { daysUntil } from './dates.js';

const UNITS = ['g', 'kg', 'ml', 'l', 'tsp', 'tbsp', 'cup', 'cups', 'oz', 'lb', 'lbs',
  'pinch', 'clove', 'cloves', 'can', 'cans', 'slice', 'slices'];

export function parseIngredientLine(line) {
  line = line.trim();
  if (!line) return null;
  const m = line.match(/^([\d.\/]+)\s*([a-zA-Z]*)\s*(.*)$/);
  if (m && m[1]) {
    let unit = m[2].toLowerCase();
    let name = m[3];
    if (!UNITS.includes(unit)) {
      name = (m[2] + ' ' + m[3]).trim();
      unit = '';
    }
    const qty = m[1].includes('/')
      ? (() => { const [a, b] = m[1].split('/'); return a / b; })()
      : parseFloat(m[1]);
    return { qty: qty || 1, unit, name: name.trim() || line };
  }
  return { qty: 1, unit: '', name: line };
}

export function fmtQty(n) {
  if (!isFinite(n)) return '';
  return (Math.round(n * 100) / 100).toString();
}

export function isStar(name, stars) {
  const n = name.toLowerCase();
  return stars.some(s => n.includes(s) || s.includes(n));
}

// Compares a saved recipe idea against current fridge contents: how many
// ingredients are on hand, and whether any of those are close to expiring.
export function matchIdea(idea, fridge) {
  const fridgeNames = fridge.map(f => ({ name: f.name.toLowerCase(), days: daysUntil(f.expiry) }));
  let matched = 0;
  const expiringUsed = [];
  const lines = idea.ingredients.map(ing => {
    const n = ing.name.toLowerCase();
    const hit = fridgeNames.find(f => n.includes(f.name) || f.name.includes(n));
    if (hit) {
      matched++;
      if (hit.days !== null && hit.days <= 4) expiringUsed.push(hit.name);
    }
    return { ...ing, have: !!hit };
  });
  return { lines, matched, total: idea.ingredients.length, expiringUsed: [...new Set(expiringUsed)] };
}
