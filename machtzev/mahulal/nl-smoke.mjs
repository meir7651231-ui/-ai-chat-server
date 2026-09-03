#!/usr/bin/env node
// nl-smoke.mjs — רצפת-§22: כל משפט-חופשי (nl-smoke.txt) ⇒ אפליקציה נבנית בלי-קריסה.
// (הקומפילציה עצמה נבדקת בשער genesis-compile; כאן: buildApp לא-זורק + מייצר ישויות.)
import fs from 'node:fs';
import { buildApp } from '../generator/app-ds.mjs';
import * as R from '../root.mjs';
const sents = fs.readFileSync((R.GEN_DIR + 'nl-smoke.txt'), 'utf8').split('\n').map((s) => s.trim()).filter(Boolean);
let fail = 0;
for (const s of sents) {
  try { buildApp(s); const n = fs.readdirSync((R.outDir() + '/')).filter((f) => /^gen_app_ent\d+\.dart$/.test(f)).length; if (n < 1) { console.log('🚨 אפס-ישויות:', s); fail++; } else console.log('✅', n, 'ישויות ·', s); }
  catch (e) { console.log('🚨 קריסה:', s, '·', e.message); fail++; }
}
if (fail) { console.log(`\n🚨 רצפת-§22: ${fail} כשלים`); process.exit(1); }
console.log('\n✅ רצפת-§22: כל המשפטים-החופשיים בונים אפליקציה');
