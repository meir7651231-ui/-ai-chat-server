#!/usr/bin/env node
/** מחצב · משוואה 4 — אכיפת חוקי-החשמלאי על העץ החדש (new/). ריק = עובר.
 *  c3ב: --files a,b,c — בודק רק קבצים נתונים (אינקרמנטלי; police --inc). ברירת-מחדל: הליכה מלאה. */
import fs from 'node:fs';
import path from 'node:path';
import * as R from './root.mjs';
const argv = process.argv.slice(2);
const fi = argv.indexOf('--files');
const dirArg = argv.find((a, i) => !a.startsWith('--') && (fi < 0 || i !== fi + 1));
const NEW = dirArg || R.NEW;
if (!fs.existsSync(NEW)) { console.log('✓ חוקי-החשמלאי: העץ החדש טרם קיים — אין מה לאכוף'); process.exit(0); }
let fail = 0;
let files = [];
const SRC = /\.(mjs|ts|tsx|js|dart)$/;
if (fi >= 0) files = argv[fi + 1].split(',').map(s => path.resolve(s)).filter(f => SRC.test(f) && fs.existsSync(f));
else (function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); e.isDirectory() ? walk(f) : SRC.test(e.name) && files.push(f); } })(NEW);
for (const f of files) {
  const rel = path.relative(NEW, f).replace(/\\/g, '/');
  const zone = rel.startsWith('atoms/') ? 'atom' : rel.startsWith('boxes/') ? 'box' : /^board\./.test(rel) ? 'board' : 'other';
  const txt = fs.readFileSync(f, 'utf8');
  for (const m of txt.matchAll(/(?:import\s.*?from\s*|import\s*\(\s*|require\s*\(\s*)['"]([^'"]+)['"]/g)) {
    const imp = m[1];
    if (!imp.startsWith('.')) continue; // שפה/סטנדרט — מותר
    const target = path.relative(NEW, path.resolve(path.dirname(f), imp)).replace(/\\/g, '/');
    const tz = target.startsWith('atoms/') ? 'atom' : target.startsWith('boxes/') ? 'box' : /^board\./.test(target) ? 'board' : 'other';
    const ownTest = /\.test\.mjs$/.test(rel) && target === rel.replace(/\.test\.mjs$/, '.mjs');
    const bad = !ownTest && (
      (zone === 'atom') ||                                    // אטום לא מייבא כלום פנימי
      (zone === 'box' && tz !== 'atom') ||                    // קופסה מייבאת רק אטומים
      (zone === 'board' && tz !== 'box'));                     // לוח מייבא רק קופסאות
    if (bad) { console.error(`🚨 הפרת-חיווט: ${rel} (${zone}) ← ${target} (${tz})`); fail = 1; }
  }
}
fail ? process.exit(1) : console.log(`✓ חוקי-החשמלאי: ${files.length} קבצים ${fi >= 0 ? '(--files)' : 'בעץ החדש'} — אפס הפרות-חיווט`);
