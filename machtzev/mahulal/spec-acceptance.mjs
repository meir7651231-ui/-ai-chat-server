#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════
//  spec-acceptance.mjs — יַרְד-מידה "מערכת-מלאה" (§22 · הכרעה 23): אפיון-עשיר
//  (מערכת-חלל, generator/acceptance-space.txt) ⇒ המחולל מרכיב **מערכת-הפעלה שלמה**.
//  בודק שכל יכולות-הליבה נפלטו: טופס-מוקלד · טבלה · לוח-מסע · KPI · לוח-שנה · קשרים ·
//  הרשאות · **התנהגות** (שדה-מותנה). לא 'בונה' סתם — 'מערכת אמיתית'. שער: כל היכולות + 0 קריסה.
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import { buildApp } from '../generator/app-ds.mjs';
const GEN = new URL('../../new/dart-gen-bs/', import.meta.url).pathname;
const spec = fs.readFileSync(new URL('../generator/acceptance-space.txt', import.meta.url), 'utf8');

let r;
try { r = buildApp(spec); } catch (e) { console.log('🚨 המחולל קרס על אפיון-מערכת-מלאה:', e.message); process.exit(1); }
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
// §21: מגוון-אטומים נפלטים (רק-עולה) — המחולל מפזר שימוש על המאגר-הבינדבילי, לא DS-בלבד.
const atomIdx = new Set(JSON.parse(fs.readFileSync(new URL('../generator/atom-index.json', import.meta.url), 'utf8')).map((a) => a.cls));
const emitted = new Set([...all.matchAll(/\b([A-Z][A-Za-z0-9]+)\(/g)].map((m) => m[1]).filter((c) => atomIdx.has(c)));
const ATOM_FLOOR = 23;
caps[`§21 מגוון-אטומים ≥${ATOM_FLOOR} (נפלטו ${emitted.size})`] = emitted.size >= ATOM_FLOOR;
console.log(`§22 קבלה · מערכת-חלל · ${entities} ישויות · ${r.roles.length} תפקידים · ${Object.keys(caps).length} יכולות-נבדקות · ${emitted.size} אטומי-אימפריה`);
let miss = 0;
for (const [k, v] of Object.entries(caps)) { console.log(`  ${v ? '✅' : '🚨'} ${k}`); if (!v) miss++; }
if (miss) { console.log(`\n🚨 §22 קבלה: ${miss} יכולות חסרות ⇒ לא מערכת-מלאה`); process.exit(1); }
console.log('\n✅ §22 קבלה: מאפיון-אחד ⇒ מערכת-הפעלה שלמה (כל היכולות · כולל התנהגות)');
