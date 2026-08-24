import { buildTzGrid } from './build-tz-grid.mjs';

let f = 0;
const eq = (n, got, want) => {
  const g = JSON.stringify(got), w = JSON.stringify(want);
  if (g !== w) { console.error(`✗ דוגמה ${n}: ${g} ≠ ${w}`); f = 1; }
};

// 1+2+3 · האצלה מלאה — אותה רפרנס לפלט ולארגומנטים
const ev = [{ date: '2026-08-24' }];
const G = { cells: [] };
let seen = null;
const spy = (...args) => { seen = args; return G; };
const out = buildTzGrid(ev, '2026-08-24', false, spy);
if (out !== G) { console.error('✗ דוגמה 1: הפלט אינו זקיף-השקע (רפרנס)'); f = 1; }
if (seen[0] !== ev) { console.error('✗ דוגמה 2: tzEvents לא הועבר באותה רפרנס'); f = 1; }
eq('2', [seen[1], seen[2]], ['2026-08-24', false]);
let hebSeen = null;
buildTzGrid([], '2026-01-01', true, (_e, _a, h) => { hebSeen = h; return null; });
eq('3', hebSeen, true);
// 4 · שקע-מחשב
eq('4', buildTzGrid([{ date: 'a' }, { date: 'b' }, { date: 'c' }], 'x', false, (evs) => ({ n: evs.length })), { n: 3 });

if (f) process.exit(1);
console.log('✓ build-tz-grid: 4 דוגמאות-חוזה — ירוק');
