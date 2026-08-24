#!/usr/bin/env node
/** מחצב · בודק-המוטציה (מ-THE-LAW של buildsmart): "בדיקה שעוברת גם על קוד שבור
 *  שווה כלום". לכל אטום: מחליפים את החוט בגוף-חלול (כל היצואים undefined) ⇒
 *  הבדיקה חייבת להאדים; משחזרים ⇒ ירוק. בדיקה שנשארת ירוקה על חלול = ריקה ⇒ 🚨 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const A = process.argv[2] || new URL('../new/atoms/', import.meta.url).pathname;
const runTest = (t) => { try { execFileSync('node', [t], { stdio: 'pipe', timeout: 15000 }); return 0; } catch { return 1; } };
let ok = 0, vacuous = [], broken = [];
const files = fs.readdirSync(A).filter(f => f.endsWith('.mjs') && !f.endsWith('.test.mjs'));
for (const f of files) {
  const wire = path.join(A, f), test = wire.replace(/\.mjs$/, '.test.mjs');
  if (!fs.existsSync(test)) continue;
  const orig = fs.readFileSync(wire, 'utf8');
  const names = [...orig.matchAll(/export\s+(?:async\s+)?(?:const|function|class)\s+([A-Za-z0-9_$]+)/g)].map(m => m[1]);
  if (!names.length) continue;
  const hollow = '/* מוטציה-חלולה */\n' + names.map(n => `export const ${n} = undefined;`).join('\n') + '\n';
  try {
    fs.writeFileSync(wire, hollow);
    const redOnHollow = runTest(test) === 1;
    fs.writeFileSync(wire, orig);
    const greenOnReal = runTest(test) === 0;
    if (redOnHollow && greenOnReal) ok++;
    else if (!redOnHollow) vacuous.push(f);
    else broken.push(f);
  } finally { fs.writeFileSync(wire, orig); }
}
if (vacuous.length) { console.error(`🚨 בדיקות-ריקות (ירוקות גם על חוט-חלול!): ${vacuous.length}`); vacuous.slice(0, 15).forEach(v => console.error('   ✗ ' + v)); }
if (broken.length) { console.error(`🚨 אדומות-על-אמיתי: ${broken.join(', ')}`); }
console.log(`✓ מוטציה: ${ok}/${files.length} אטומים — הבדיקה מאדימה-על-חלול וירוקה-על-אמיתי`);
process.exit(vacuous.length || broken.length ? 1 : 0);
