#!/usr/bin/env node
/** ✅ מחצב · אימות-חי של מתכוני-arg0-קבוע (מבצע-המאה) — מריץ כל מנוע-דארט-יליד עם
 *  arg0 שנלקד מהבדיקה בהרצת-Dart **מבודדת** (job-אחד לבאץ׳, כדי שכשל-אחד לא-ירעיל אחר),
 *  ושומר רק את השמות שרצו-באמת ⇒ machtzev/generator/knowledge/dart-arg0-verified.json.
 *  זהו proof-record: שער-הכיסוי סופר arg0Fixed רק לשמות-מאומתים (L27 — לא חלול).
 *  שימוש: DART_BIN=/path/to/dart node machtzev/verify-dart-arg0.mjs */
import fs from 'node:fs';
import path from 'node:path';
import { buildAtlas } from './generator/atlas.mjs';
import { harvestDartTwins, runDartBatch } from './generator/dart-twins.mjs';
const ROOT = new URL('../', import.meta.url).pathname;
const OUT = path.join(ROOT, 'machtzev/generator/knowledge/dart-arg0-verified.json');

const reg = harvestDartTwins(buildAtlas().functions, { allArg0: true });
const cand = [...reg.entries()].filter(([, r]) => r.arg0Fixed !== undefined).map(([n]) => n);
console.log(`מתכוני arg0-קבוע מועמדים: ${cand.length} — מריץ אימות-Dart מבודד…`);
const verified = [];
for (const fn of cand) {
  const o = runDartBatch(reg, [{ fn, input: '0' }]);
  if (o[0] !== null) verified.push(fn);
}
verified.sort();
if (cand.length && !verified.length) {                              // מגן-מטמון (L27): כל-המועמדים נכשלו ⇒ Dart שבור/חסר, לא מוחקים
  console.error('⚠ אפס-מאומתים מתוך מועמדים (Dart חסר/שבור?) — מטמון-ההוכחות נשמר, לא נכתב.');
  process.exit(1);
}
fs.writeFileSync(OUT, JSON.stringify(verified, null, 0) + '\n');
console.log(`✅ אומתו-רצים: ${verified.length}/${cand.length} ⇒ ${path.relative(ROOT, OUT)} (${cand.length - verified.length} נדחו — לא-רצו)`);
