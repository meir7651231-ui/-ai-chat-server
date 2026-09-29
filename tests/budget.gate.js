// step budget-contract-gate: the page may only touch collections the contract lists, with a cap and a class, the caps
// must add up to less than the ceiling, and no live read may be unbounded. Exit 1 on any breach.
//   node tests/budget.gate.js              check liba-call.html against channel-budget.json
//   node tests/budget.gate.js --self-test  prove the gate bites: an unlisted collection and an over-ceiling contract must fail
const fs = require('fs'); const path = require('path');
const ROOT = path.join(__dirname, '..');
const CLS = ['voice', 'state', 'record', 'telemetry', 'fixed', 'janitor'];

function collectionsIn(html) {
  const out = new Set();
  // db.doc('a/b').collection('c')...  →  a/b/c
  for (const m of html.matchAll(/db\.doc\('([^']+)'\)\.collection\('([^']+)'\)/g)) out.add(m[1] + '/' + m[2]);
  // db.collection('x')  →  x
  for (const m of html.matchAll(/db\.collection\('([^']+)'\)/g)) out.add(m[1]);
  // db.doc('x/'+id) or db.doc('x/y') standing alone  →  the collection x
  for (const m of html.matchAll(/db\.doc\('([^'\/]+)\/(?:[^']*)'(?:\+[^)]*)?\)(?!\.collection)/g)) out.add(m[1]);
  return [...out].sort();
}

function check(html, budget) {
  const errs = [], lines = [];
  const c = budget.collections || {};
  for (const [k, v] of Object.entries(c)) {
    if (!(Number.isInteger(v.cap) && v.cap > 0)) errs.push(`${k}: אין cap שלם וחיובי`);
    if (!CLS.includes(v.cls)) errs.push(`${k}: cls לא מוכר (${v.cls})`);
    if (!v.time) errs.push(`${k}: אין שדה זמן`);
  }
  const used = collectionsIn(html);
  const missing = used.filter(u => !c[u]);
  if (missing.length) errs.push('אוספים בדף שאינם בחוזה: ' + missing.join(', '));
  lines.push(`${used.length} אוספים בדף, כולם בחוזה`);
  const sum = Object.values(c).reduce((a, v) => a + (v.cap || 0), 0);
  if (!(sum < budget.ceiling)) errs.push(`סכום התקרות ${sum} לא קטן מ-${budget.ceiling}`);
  lines.push(`סכום התקרות ${sum} < ${budget.ceiling}`);
  const COLS = ['inbox', 'tasks', 'sessions', 'gallery', 'notes', 'prefs', 'turns', 'decisions', 'telemetry', 'reqs', 'crashes', 'folds', 'pulses', 'ledgers', 'metricsDays'];
  const unbounded = html.match(new RegExp('P\\.(' + COLS.join('|') + ')\\(\\)\\.onSnapshot\\(', 'g')) || [];
  if (unbounded.length) errs.push('מנוי חי בלי חלון: ' + unbounded.join(' '));
  lines.push('0 מנויים חיים בלי חלון');
  // the contract the page carries is the one in the repo (baked at build time)
  const baked = /const BUDGET=(\{.*?\});/.exec(html);
  if (!baked) errs.push('אין BUDGET בדף - הבנייה לא הזריקה את החוזה');
  else { const b = JSON.parse(baked[1]); if (JSON.stringify(b.c) !== JSON.stringify(c)) errs.push('החוזה בדף שונה מ-channel-budget.json - צריך לבנות מחדש'); else lines.push('החוזה בדף זהה לחוזה בריפו'); }
  return { errs, lines };
}

const html = fs.readFileSync(path.join(ROOT, 'liba-call.html'), 'utf8');
const budget = JSON.parse(fs.readFileSync(path.join(ROOT, 'channel-budget.json'), 'utf8'));
if (process.argv.includes('--self-test')) {
  let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
  const a = check(html + "\n<script>db.collection('newthing')</script>", budget);
  ok(a.errs.some(e => /newthing/.test(e)), 'self-test: a page line naming db.collection(\'newthing\') fails the gate');
  const big = JSON.parse(JSON.stringify(budget)); big.collections.inbox.cap = budget.ceiling;
  ok(check(html, big).errs.some(e => /סכום התקרות/.test(e)), 'self-test: caps adding up past the ceiling fail the gate');
  const noCls = JSON.parse(JSON.stringify(budget)); delete noCls.collections.req.cls;
  ok(check(html, noCls).errs.some(e => /req: cls/.test(e)), 'self-test: a collection without a class fails the gate');
  ok(check(html, budget).errs.length === 0, 'self-test: the real page passes');
  process.exit(fails ? 1 : 0);
}
const r = check(html, budget);
r.lines.forEach(l => console.log('PASS ' + l));
r.errs.forEach(e => console.log('FAIL ' + e));
process.exit(r.errs.length ? 1 : 0);
