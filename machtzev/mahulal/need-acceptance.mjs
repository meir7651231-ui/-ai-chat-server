#!/usr/bin/env node
// need-acceptance.mjs — baseline: כמה מ-13 היכולות המחולל גוזר מ**אפיון-צורך** (לא-מימוש)?
// מריץ buildApp על acceptance-space-need.txt ומחיל את אותן בדיקות-יכולת של spec-acceptance.
import fs from 'node:fs';
import path from 'node:path';
import { buildApp } from '../generator/app-ds.mjs';
const GEN = new URL('../../new/dart-gen-bs/', import.meta.url).pathname;
const spec = fs.readFileSync(new URL('../generator/acceptance-space-need.txt', import.meta.url), 'utf8');
let r;
try { r = buildApp(spec); } catch (e) { console.log('🚨 קרס:', e.message); process.exit(1); }
const all = fs.readdirSync(GEN).filter((f) => /^gen_app_.*\.dart$/.test(f)).map((f) => fs.readFileSync(path.join(GEN, f), 'utf8')).join('\n');
const caps = {
  'טופס-מוקלד (enum/טווח)': /DsEnumField\(/.test(all) && /num\.tryParse/.test(all),
  'טבלה': /DsTable\(/.test(all),
  'לוח-מסע (שלבים)': /DsBoard\(/.test(all),
  'KPI (דשבורד)': /DsStat\(/.test(all),
  'לוח-שנה': /DsCalendar\(/.test(all),
  'קשרים (מפתח-יעד)': /countRef|sumRef|Navigator\.of\(context\)\.push/.test(all),
  'אגרגט חוצה-ישות': /appStore\.(sum|avg|count)\(/.test(all),
  'הרשאות (RLS · בורר-תפקיד)': /_roleChip\(|appStore\.scoped\(/.test(all),
  'התנהגות (שדה-מותנה חי)': /num\.tryParse[^\n]*[<>][^\n]*\?\s*gen_app_\w+\s*:\s*gen_app_\w+/.test(all),
  'התנהגות-על (מונה-מסונן "בסיכון")': /appStore\.records\('[^']+'\)\.where\([^\n]*\.length/.test(all),
  'שדה-מחושב (נוסחה)': /_calc\(/.test(all),
  'ולידציה (חובה/ייחודי/חוק)': /trim\(\)\.isEmpty\) miss\.add/.test(all),
};
const entities = r.screens.filter((s) => s.kind === 'entity').length;
console.log(`baseline · אפיון-צורך · ${entities} ישויות · ${r.roles.length} תפקידים`);
let pass = 0;
for (const [k, v] of Object.entries(caps)) { console.log(`  ${v ? '✅' : '🔴'} ${k}`); if (v) pass++; }
console.log(`\nגזר ${pass}/${Object.keys(caps).length} יכולות מהצורך-בלבד.`);
console.log('ישויות-שחולצו:', r.screens.filter((s)=>s.kind==='entity').map((s)=>s.name).join(' · '));
