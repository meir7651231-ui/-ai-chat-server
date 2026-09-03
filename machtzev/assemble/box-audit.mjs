#!/usr/bin/env node
/** מחצב · מנוע-ביקורת-ההרכבה — חוזה: BOX-AUDIT-CONTRACT.md (5 חובות).
 *  תוכנית-חיווט (box-draft) ↔ קופסה-בנויה (dart-boxes): כל חוט מתוכנן חייב להיות מחווט.
 *  מצבים: (ברירת-מחדל) דוח · --write ‏baseline · --gate ‏ratchet-נסיגה · --selftest אדום-על-חלול. */
import fs from 'node:fs';
import path from 'node:path';
import * as R from '../root.mjs';
const ROOT = R.ROOT;
const p = (...s) => path.join(ROOT, ...s);
const MODE = process.argv[2] || '';

// ── חובה 2: מיפוי-שמות דטרמיניסטי (camel/CONST → kebab) ──
const kebab = (n) => n.includes('_')
  ? n.toLowerCase().replace(/_/g, '-')
  : n.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

// קטלוג-האטומים (כל מדפי-ה-Dart)
const catalog = new Set();
for (const dir of ['new/dart-maor', 'new/dart', 'new/dart-data-maor']) {
  if (!fs.existsSync(p(dir))) continue;
  for (const f of fs.readdirSync(p(dir)))
    if (f.endsWith('.dart') && !f.endsWith('_test.dart')) catalog.add(f.replace('.dart', ''));
}

// כינויים מוצהרים (חוט-בתוכנית ⇒ שם-אטום/מזהה בפועל) — שקוף, לא בליעה
const aliasFile = p('machtzev/assemble/box-aliases.json');
const ALIASES = fs.existsSync(aliasFile) ? JSON.parse(fs.readFileSync(aliasFile, 'utf8')) : {};

// ── חובה 1: קריאת-התוכניות ──
const drafts = fs.readdirSync(p('box-drafts')).filter(f => f.endsWith('.box-draft.md'));
const plans = {};
for (const f of drafts) {
  const src = fs.readFileSync(p('box-drafts', f), 'utf8');
  const m = src.match(/##\s*תוכנית-החיווט([\s\S]*?)(?=\n##\s|$)/);
  if (!m) { plans[f] = null; continue; }
  const threads = [];
  for (const line of m[1].split('\n')) {
    const t = line.match(/^\s*·\s*([A-Za-z_][A-Za-z0-9_]*)/);
    if (t) threads.push(t[1]);
  }
  plans[f] = threads;
}

// ── חובה 3: התאמת תוכנית↔קופסה ──
const boxDir = p('new/dart-boxes');
const boxes = fs.readdirSync(boxDir).filter(f => f.endsWith('.dart') && !f.includes('-proof') && f !== 'atoms.dart').map(f => f.replace('.dart', ''));
const BOX_MAP = ALIASES.__boxmap || {};
function boxFor(draft) {
  const base = kebab(draft.replace('.box-draft.md', '')); // נרמול: lib-callerId ⇒ lib-caller-id
  if (BOX_MAP[base]) return BOX_MAP[base];
  // הארוך-ביותר שמופיע כמקטע בשם-הטיוטה
  let best = null;
  for (const b of boxes) {
    if (new RegExp(`(^|-)${b.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}($|-)`).test(base))
      if (!best || b.length > best.length) best = b;
  }
  return best;
}

// ── חובה 4: ביקורת-כיסוי ──
function audit(threads, boxSrc) {
  const covered = [], missing = [], unresolved = [];
  for (const t of threads) {
    const alias = ALIASES[t];
    const keb = kebab(alias || t);
    const inCatalog = catalog.has(keb);
    const wired = boxSrc.includes(`/${keb}.dart`) || new RegExp(`\\b${alias || t}\\b`).test(boxSrc);
    if (wired) covered.push(t);
    else if (!inCatalog && !alias) unresolved.push(t); // שם לא נפתר בקטלוג — מדוּוח, לא נבלע
    else missing.push(t);
  }
  return { covered, missing, unresolved };
}

// ── הרצה מלאה ──
const report = {}; let tThreads = 0, tCov = 0, tMiss = 0, tUnres = 0, noBox = [];
for (const [draft, threads] of Object.entries(plans)) {
  if (!threads) continue;
  const box = boxFor(draft);
  if (!box) { noBox.push(draft); continue; }
  const src = fs.readFileSync(path.join(boxDir, box + '.dart'), 'utf8');
  const r = audit(threads, src);
  report[box] = { draft, threads: threads.length, covered: r.covered, missing: r.missing, unresolved: r.unresolved };
  tThreads += threads.length; tCov += r.covered.length; tMiss += r.missing.length; tUnres += r.unresolved.length;
}

// ── חובה 5: מצבים ──
if (MODE === '--selftest') {
  // אדום-על-חלול: מוחקים חוט-מכוסה מעותק ⇒ המנוע חייב לזהות חסר
  const box = Object.keys(report).find(b => report[b].covered.length > 2);
  const victim = report[box].covered.find(t => catalog.has(kebab(ALIASES[t] || t)));
  const src = fs.readFileSync(path.join(boxDir, box + '.dart'), 'utf8');
  const keb = kebab(ALIASES[victim] || victim);
  const hollow = src.split('\n').filter(l => !l.includes(`/${keb}.dart`)).join('\n')
    .replace(new RegExp(`\\b${ALIASES[victim] || victim}\\b`, 'g'), '_removed_');
  const rHollow = audit(plans[report[box].draft], hollow);
  const fires = rHollow.missing.includes(victim) || rHollow.unresolved.includes(victim);
  const clean = audit(plans[report[box].draft], src).covered.includes(victim);
  console.log(`${fires ? '✅' : '❌'} אדום-על-חלול: מחיקת ${victim} מ-${box} ⇒ ${fires ? 'המנוע מזהה חסר' : 'לא זוהה!'}`);
  console.log(`${clean ? '✅' : '❌'} ירוק-על-נקי: ${victim} מכוסה במקור`);
  process.exit(fires && clean ? 0 : 1);
}
const baseFile = p('machtzev/assemble/box-coverage-baseline.json');
if (MODE === '--write') {
  const base = Object.fromEntries(Object.entries(report).map(([b, r]) => [b, r.covered.sort()]));
  fs.writeFileSync(baseFile, JSON.stringify(base, null, 1));
  console.log(`📌 baseline נכתב: ${Object.keys(base).length} קופסאות · ${tCov} חוטים-מכוסים`);
  process.exit(0);
}
if (MODE === '--gate') {
  if (!fs.existsSync(baseFile)) { console.error('❌ אין baseline — הרץ --write קודם'); process.exit(1); }
  const base = JSON.parse(fs.readFileSync(baseFile, 'utf8'));
  let regress = 0;
  for (const [b, was] of Object.entries(base)) {
    const now = new Set(report[b]?.covered || []);
    for (const t of was) if (!now.has(t)) { console.error(`🔴 נסיגה: ${b} איבד את ${t}`); regress++; }
  }
  console.log(regress ? `❌ ${regress} נסיגות-חיווט` : `🔌 מבקר-ההרכבה: ${Object.keys(report).length} קופסאות · אפס-נסיגה מ-baseline (${tCov} חוטים)`);
  process.exit(regress ? 1 : 0);
}
// דוח
console.log(`🔌 ביקורת-ההרכבה · ${drafts.length} תוכניות · ${Object.keys(report).length} זוגות תוכנית↔קופסה`);
console.log(`   חוטים-מתוכננים: ${tThreads} · מחווטים: ${tCov} (${(100 * tCov / tThreads).toFixed(1)}%) · חסרים: ${tMiss} · לא-נפתרו: ${tUnres}`);
if (noBox.length) console.log(`   ⚠️ טיוטות-בלי-קופסה (${noBox.length}): ${noBox.join(' · ')}`);
for (const [b, r] of Object.entries(report).sort((a, z) => (z[1].missing.length + z[1].unresolved.length) - (a[1].missing.length + a[1].unresolved.length))) {
  if (r.missing.length || r.unresolved.length)
    console.log(`   ${b}: ${r.covered.length}/${r.threads}` +
      (r.missing.length ? ` · חסר: ${r.missing.join(',')}` : '') +
      (r.unresolved.length ? ` · לא-נפתר: ${r.unresolved.join(',')}` : ''));
}
