// הפוך: מתחילים מתוכנית שעובדת ומורידים. כל פעם לוקחים קטע צמוד (2–6 פעולות) ומנסים את *כל* הדרכים לכתוב אותו קצר יותר.
// מחליפים רק אם כל התוכנית עדיין עובדת (תאים מלוכלכים + ערבוב בכל חזרה). חוזרים עד שאין שיפור.
import fs from "node:fs"; import { run } from './machine2.mjs'; import { LENGTH, SEARCH } from './handwritten.mjs';
let s = 99; const rnd = (k) => { s = (s * 1103515245 + 12345) % 2147483648; return Math.floor((s / 2147483648) * k); };
const INPUT = [0, 1, 8, 9, 10, 11, 12, 13, 14, 15];
const make = (n, want, key) => { const ex = []; for (let i = 0; i < n; i++) { const p = [8, 9, 10, 11, 12, 13, 14, 15]; for (let j = 7; j > 0; j--) { const r = rnd(j + 1); [p[j], p[r]] = [p[r], p[j]]; }
  const l = p.slice(0, i < 18 ? i % 9 : rnd(9)); const m = new Array(16).fill(0); m[1] = l[0] || 0; l.forEach((a, j) => { m[a] = l[j + 1] || 0; }); if (key) m[0] = 8 + rnd(8);
  for (let k = 0; k < 16; k++) if (!INPUT.includes(k)) m[k] = rnd(16); ex.push({ mem: m, want: want(l, m), sc: 1 + rnd(1e6) }); } return ex; };
// תוכנית = [op, k, isCode]. קפיצה: «לאן» שמוביל ל«לך-לשורה» = כתובת-קוד
const tag = (p) => { const out = p.map(([o, k]) => [o, k, false]); let last = -1; out.forEach(([o], i) => { if (o === 'WHERE') last = i; else if (o === 'WHERE@') last = -1; else if (o === 'JUMP' && last >= 0) out[last][2] = true; }); return out; };
const plain = (p) => p.map(([o, k]) => (o === 'WHERE' ? ['WHERE', k] : [o]));
const works = (p, ex) => { const q = plain(p); for (const e of ex) for (const sc of [0, e.sc]) { const r = run(q, e.mem, { maxSteps: 2000, scramble: sc }); if (!r || r.mem[2] !== e.want) return false; } return true; };
const ALPHA = [...[0, 1, 2, 3, 4, 5, 6, 7].map((k) => ['WHERE', k, false]), ['WHERE@'], ['GO'], ['TAKE'], ['PUT'], ['CALC'], ['ADD']];
function* seqs(n) { if (n === 0) { yield []; return; } for (const a of ALPHA) for (const rest of seqs(n - 1)) yield [a, ...rest]; }
function replace(p, i, w, rep) { const d = rep.length - w;
  return [...p.slice(0, i), ...rep, ...p.slice(i + w)].map(([o, k, c]) => (c ? [o, k > i ? k + d : k, c] : [o, k, c])); }
function improve(name, p0, fast, full) { let p = p0; const t0 = Date.now(); console.log(`${name}: מתחיל מ-${p.length}`);
  let better = true;
  while (better) { better = false;
    for (let w = 6; w >= 1 && !better; w--) for (let i = 0; i + w <= p.length && !better; i++) {
      const win = p.slice(i, i + w); if (win.some(([o, , c]) => o === 'JUMP' || c)) continue;             // לא נוגעים בקפיצות עצמן
      if (p.some(([o, k, c]) => c && k > i && k < i + w)) continue;                                           // אף קפיצה לא נוחתת באמצע הקטע
      for (let r = 0; r < Math.min(w, 5) && !better; r++) for (const rep of seqs(r)) {
        const q = replace(p, i, w, rep); if (works(q, fast) && works(q, full)) { p = q; better = true; console.log(`  ⇐ ${p.length} (קטע ${w} בשורה ${i} ⇐ ${r} פעולות) · ${Math.round((Date.now() - t0) / 1000)}s`); break; } } } }
  return p; }
const BEST = {}; process.on("exit", () => fs.writeFileSync("best-hand.json", JSON.stringify(BEST)));
const show = (p) => p.map(([o, k, c]) => (o === 'WHERE' ? (c ? `לשורה:${k}` : `לאן${k}`) : { 'WHERE@': 'לאן@', GO: 'לך', TAKE: 'קח', PUT: 'שים', CALC: 'חשב', ADD: 'חשב+', JUMP: '⤴' }[o])).join(' ');
for (const [name, P, want, key] of [['אורך רשימה', LENGTH, (l) => l.length, false], ['חפש ברשימה', SEARCH, (l, m) => (l.includes(m[0]) ? 15 : 0), true]]) {
  const fast = make(40, want, key), full = make(400, want, key), fresh = make(3000, want, key);
  const p = improve(name, tag(P), fast, full);
  BEST[name] = p; console.log(`✓ ${name}: ${P.length} ⇐ ${p.length} פעולות · בדיקה על 3000 רשימות חדשות: ${works(p, fresh) ? 'עובד' : 'נכשל'}`); console.log('   ' + show(p)); }
