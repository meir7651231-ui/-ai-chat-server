#!/usr/bin/env node
/** מחצב · סורק-טוהר-דאטה — הכרעת-הבעלים "אטומים נקיים ללא דאטה בכלל" (28.8).
 *  מסווג כל אטום: clean (אפס-דאטה) · data (כל-הקובץ=דאטה, לגיטימי) · mixed (מנגנון+דאטה ⇒ חוב).
 *  ‏--gate: ratchet מול baseline — אטום-mixed חדש נחסם; הקיימים = חוב-שרק-יורד. */
import fs from 'node:fs';
import path from 'node:path';
const ROOT = new URL('../../', import.meta.url).pathname;
const MODE = process.argv[2] || '';
const DIRS = [['new/atoms', '.mjs'], ['new/dart-maor', '.dart'], ['new/dart', '.dart']];
const HEB = /'[^'\n]*[֐-׿][^'\n]*'/g;

const out = { clean: 0, data: 0, mixed: [] };
for (const [dir, ext] of DIRS) {
  const d = path.join(ROOT, dir);
  if (!fs.existsSync(d)) continue;
  for (const f of fs.readdirSync(d)) {
    if (!f.endsWith(ext) || f.includes('.test.') || f.endsWith('_test' + ext) || f.endsWith('.md')) continue;
    const src = fs.readFileSync(path.join(d, f), 'utf8');
    const body = src.replace(/\/\*[\s\S]*?\*\//g, '').split('\n').filter(l => !l.trim().startsWith('//') && !l.trim().startsWith('///')).join('\n');
    const heb = body.match(HEB) || [];
    // דאטה-צרובה = ליטרל בלבד; מערך/אובייקט-מחושב (spread `[...`) אינו דאטה. עברית-דאטה עדיין נתפסת דרך heb.
    const constData = (body.match(/const\s+\w+\s*=\s*(?:\{(?!\s*\.\.\.)|\[(?!\s*\.\.\.))/g) || []).length;
    const logic = body.split('\n').filter(l => /\bif\b|\bfor\b|\breturn\b|\bswitch\b/.test(l)).length;
    if (!heb.length && !constData) out.clean++;
    else if (logic <= 1) out.data++;
    else out.mixed.push(dir + '/' + f);
  }
}
const baseFile = path.join(ROOT, 'machtzev/purity-baseline.json');
if (MODE === '--write') {
  fs.writeFileSync(baseFile, JSON.stringify(out.mixed.sort(), null, 1));
  console.log(`📌 baseline-טוהר נכתב: ${out.mixed.length} אטומים-מעורבים (חוב-פתיחה)`);
  process.exit(0);
}
if (MODE === '--gate') {
  if (!fs.existsSync(baseFile)) { console.error('❌ אין purity-baseline — הרץ --write'); process.exit(1); }
  const base = new Set(JSON.parse(fs.readFileSync(baseFile, 'utf8')));
  const fresh = out.mixed.filter(f => !base.has(f));
  if (fresh.length) { for (const f of fresh) console.error(`🔴 אטום-מעורב חדש (דאטה-במנגנון אסורה): ${f}`); process.exit(1); }
  console.log(`🧼 טוהר-דאטה: ${out.clean} נקיים · ${out.data} אטומי-דאטה · חוב: ${out.mixed.length}/${base.size} (אפס-חדשים)`);
  process.exit(0);
}
console.log(`🧼 טוהר-דאטה · נקיים: ${out.clean} · אטומי-דאטה: ${out.data} · מעורבים (חוב): ${out.mixed.length}`);
for (const f of out.mixed.slice(0, 12)) console.log('   ⚠️ ' + f);
