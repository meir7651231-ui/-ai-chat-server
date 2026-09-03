#!/usr/bin/env node
/** מחצב · נעילת-השוטרים (נלמד מ-protocol/pins.sha256 של buildsmart):
 *  החוקה והמשטרה חתומות; שינוי בלי עדכון-חתימה-באותו-commit ⇒ אדום.
 *  עדכון: node machtzev/pins-check.mjs --write */
import fs from 'node:fs';
import crypto from 'node:crypto';
import * as R from './root.mjs';
const ROOT = R.ROOT;
const PINNED = ['LAW.md', 'CLAUDE.md', 'machtzev/wiring-check.mjs', 'machtzev/contract-check.mjs',
  'machtzev/quarry-check.mjs', 'machtzev/police-selftest.mjs', 'machtzev/mutation-check.mjs', 'machtzev/police.mjs', 'machtzev/gates.tsv', 'machtzev/AGENT-CODE.md', 'machtzev/pins-check.mjs'];
const PIN_FILE = ROOT + 'machtzev/pins.sha256';
const hash = (f) => crypto.createHash('sha256').update(fs.readFileSync(ROOT + f)).digest('hex').slice(0, 16);
if (process.argv[2] === '--write') {
  fs.writeFileSync(PIN_FILE, PINNED.map(f => hash(f) + '  ' + f).join('\n') + '\n');
  console.log('✍️ חתימות עודכנו (' + PINNED.length + ' קבצים מקובעים)'); process.exit(0);
}
const pins = Object.fromEntries(fs.readFileSync(PIN_FILE, 'utf8').trim().split('\n').map(l => l.split(/\s+/).reverse()));
let fail = 0;
for (const f of PINNED) {
  if (!pins[f]) { console.error('🚨 קובץ-מקובע בלי חתימה: ' + f); fail = 1; continue; }
  if (hash(f) !== pins[f]) { console.error('🚨 קובץ-מקובע שונה בלי עדכון-חתימה: ' + f); fail = 1; }
}
fail ? process.exit(1) : console.log('✓ נעילת-השוטרים: ' + PINNED.length + ' קבצים חתומים ותואמים');
