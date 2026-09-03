#!/usr/bin/env node
/** מחצב · בודק-המוטציה (מ-THE-LAW של buildsmart): "בדיקה שעוברת גם על קוד שבור
 *  שווה כלום". לכל אטום: מחליפים את החוט בגוף-חלול ⇒ הבדיקה חייבת להאדים; משחזרים ⇒ ירוק.
 *  c3ב: (א) הליכה רקורסיבית (היה: readdirSync שטוח — אטום בתת-תיקייה לא נבדק מעולם · R2-1.7)
 *  (ב) fail-closed: צורת-export שהרגקס לא מפרסר (export default / export {…}) = unparsed ⇒ אדום, לא דילוג-שקט (L13)
 *  (ג) חלול שומר-טיפוס: כל יצוא = פונקציה שמחזירה undefined — בדיקת `typeof f === 'function'` לבדה נשארת ירוקה
 *      ולכן מסומנת ריקה (R2-2.8) · (ד) sandbox כמו contract-check · (ה) --files a,b,c. */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import * as R from './root.mjs';
const argv = process.argv.slice(2);
const fi = argv.indexOf('--files');
const dirArg = argv.find((a, i) => !a.startsWith('--') && (fi < 0 || i !== fi + 1));
const A = dirArg || (R.NEW + 'atoms/');
const isAtom = (f) => f.endsWith('.mjs') && !f.endsWith('.test.mjs');
const runTest = (test) => { const dir = path.dirname(test); const r = spawnSync('node', ['--permission', `--allow-fs-read=${path.resolve(A, '..')}/*`, test], { cwd: dir, env: { PATH: process.env.PATH || '' }, stdio: 'pipe', timeout: 15000, killSignal: 'SIGKILL' }); return r.status === 0 ? 0 : 1; };
let files = [];
if (fi >= 0) files = argv[fi + 1].split(',').map(s => path.resolve(s)).filter(f => isAtom(f) && fs.existsSync(f));
else (function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); if (e.isDirectory()) walk(f); else if (isAtom(e.name)) files.push(f); } })(A);
files.sort();
let ok = 0, vacuous = [], broken = [], unparsed = [], untested = 0;
for (const wire of files) {
  const test = wire.replace(/\.mjs$/, '.test.mjs'), rel = path.relative(A, wire);
  if (!fs.existsSync(test)) { untested++; continue; }
  const orig = fs.readFileSync(wire, 'utf8');
  const names = [...orig.matchAll(/export\s+(?:async\s+)?(?:const|let|function\*?|class)\s+([A-Za-z0-9_$]+)/g)].map(m => m[1]);
  const other = /export\s+(default|\{)/.test(orig);
  if (!names.length || other) { unparsed.push(rel); continue; }
  const hollow = '/* מוטציה-חלולה */\n' + names.map(n => `export const ${n} = (..._a) => undefined;`).join('\n') + '\n';
  try {
    fs.writeFileSync(wire, hollow);
    const redOnHollow = runTest(test) === 1;
    fs.writeFileSync(wire, orig);
    const greenOnReal = runTest(test) === 0;
    if (redOnHollow && greenOnReal) ok++;
    else if (!redOnHollow) vacuous.push(rel);
    else broken.push(rel);
  } finally { fs.writeFileSync(wire, orig); }
}
if (unparsed.length) { console.error(`🚨 export לא-מפורסר (default/{…}) — fail-closed: ${unparsed.length}`); unparsed.slice(0, 10).forEach(v => console.error('   ✗ ' + v)); }
if (vacuous.length) { console.error(`🚨 בדיקות-ריקות (ירוקות גם על חוט-חלול!): ${vacuous.length}`); vacuous.slice(0, 15).forEach(v => console.error('   ✗ ' + v)); }
if (broken.length) { console.error(`🚨 אדומות-על-אמיתי: ${broken.join(', ')}`); }
console.log(`✓ מוטציה: ${ok}/${files.length - untested} אטומים — מאדימה-על-חלול וירוקה-על-אמיתי (sandbox · רקורסיבי${fi >= 0 ? ' · --files' : ''})`);
process.exit(vacuous.length || broken.length || unparsed.length ? 1 : 0);
