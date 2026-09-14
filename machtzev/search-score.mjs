// 🔎 search-score — ניקוד-החיפוש האחד (G63): משותף ל-search-record (כותב רשומה) ול-search-proof-check (השער). עותק אחד, לא שניים.
import fs from 'node:fs';
import path from 'node:path';
import * as R from './root.mjs';
export const IDX = R.MACH + 'generator/atom-index-full.json', LOG = R.MACH + 'generator/logic-census.json';
// ── טוקניזציה: עברית/לטינית, camelCase, מקפים; מסירים ו/ה/ל/ב/מ תחיליות עבריות בסיסיות ──
export const tok = (s) => String(s || '').replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase().split(/[^a-z0-9א-ת]+/).filter((t) => t.length > 1).map((t) => t.replace(/^[והלבמכש](?=[א-ת]{3,})/, ''));
// התאמה: זהות, או קידומת של ≥4 תווים (age ⊄ image · pager) — לא substring חופשי
export const near = (x, t) => x === t || (t.length >= 4 && x.startsWith(t)) || (x.length >= 4 && t.startsWith(x));
export function scoreFor(q, entry) {
  const idT = new Set(tok(entry.id || entry.name)), fileT = new Set(tok(path.basename(entry.file || ''))), purT = new Set(tok((entry.purpose || []).join(' ')));
  let s = 0; const hits = [];
  for (const t of q) {
    if ([...idT].some((x) => near(x, t))) { s += 3; hits.push(t); continue; }
    if ([...fileT].some((x) => near(x, t))) { s += 2; hits.push(t); continue; }
    if (purT.has(t)) { s += 1; hits.push(t); }
  }
  return { s, hits };
}
/** האורקל-המאוחד כרשומות-חיפוש (תצוגה + לוגיקה), בלי כפילי-id */
export function loadOracle() {
  const display = JSON.parse(fs.readFileSync(IDX, 'utf8')), logic = JSON.parse(fs.readFileSync(LOG, 'utf8'));
  const seen = new Set();
  const all = [...display.map((e) => ({ id: e.id, layer: e.layer || 'display', file: e.file, purpose: e.purpose })), ...logic.map((e) => ({ id: e.name, layer: 'logic', file: e.file, purpose: [e.ret, ...(e.params || [])] }))].filter((e) => { const k = e.layer + ':' + e.id; if (seen.has(k)) return false; seen.add(k); return true; });
  return { display, logic, all };
}
// G63 · שכבת-היעד לפי הנתיב שנוצר: לוגיקה מול לוגיקה, תצוגה מול תצוגה (מועמד-חזק חוצה-שכבות = כפילות-שווא)
export const layerOf = (creates) => { const c = creates || ''; if (/^new\/(dart|dart-maor|dart-boxes|atoms|boxes)\//.test(c)) return 'logic'; if (/^new\/(dart-ui-bs|dart-forge-bs)\//.test(c)) return 'display'; return null; };
