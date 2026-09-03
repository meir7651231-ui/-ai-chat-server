#!/usr/bin/env node
/** משטרת-המחצבה — כל טיוטת-חוט חייבת: כותרת-מוצא + parse-תקין. קלה מדרגת-חוזה. */
import fs from 'node:fs';
import * as R from './root.mjs';
const Q = process.argv[2] || R.p('quarry') + '/';
if (!fs.existsSync(Q)) { console.log('✓ מחצבה ריקה'); process.exit(0); }
let f = 0, n = 0;
for (const file of fs.readdirSync(Q).filter(x => x.endsWith('.mjs'))) {
  const txt = fs.readFileSync(Q + '/' + file, 'utf8'); n++;
  if (!txt.includes('מוצא:')) { console.error('🚨 טיוטה בלי מוצא: ' + file); f = 1; }
  const stripped = txt
    .replace(/^export\s*\{[^}]*\}\s*(from\s*['"][^'"]*['"])?;\s*$/gm, '')
    .replace(/^import[^;]*;\s*$/gm, '')
    .replace(/^export\s+default\s+/gm, 'const __d = ')
    .replace(/^export\s+/gm, '');
  try { new Function(stripped); }
  catch (e) { console.error('🚨 parse נכשל: ' + file + ' — ' + e.message.slice(0, 60)); f = 1; }
}
f ? process.exit(1) : console.log(`✓ מחצבה: ${n} טיוטות-חוט — כולן עם מוצא ו-parse תקין`);
