#!/usr/bin/env node
/** מחצב · המשטרה-המאוחדת עם ran-ledger (K3 מ-protocol-v10):
 *  מריץ את כל השערים, פולט 'ran <id>' אחרי כל אחד, ומשווה 1:1 מול gates.tsv.
 *  שער שנמחק מהרץ ⇒ חסר ב-ledger ⇒ הפריטי נופל. --fast מדלג על היקרים. */
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const HERE = new URL('.', import.meta.url).pathname;
const FAST = process.argv.includes('--fast');
const registry = new Set(fs.readFileSync(HERE + 'gates.tsv', 'utf8').split('\n')
  .filter(l => l && !l.startsWith('#')).map(l => l.split('\t')[0]));
const ran = new Set();
let fail = 0;
const gate = (id, script, args = [], skip = false) => {
  if (skip) { ran.add(id); console.log(`~ ${id} (מדולג ב---fast, נספר-כנרשם)`); return; }
  try { execFileSync('node', [HERE + script, ...args], { stdio: 'inherit', timeout: 600000 }); }
  catch { fail = 1; }
  ran.add(id); console.log(`ran ${id}`);
};
gate('wiring', 'wiring-check.mjs', [HERE + '../new']);
gate('contract', 'contract-check.mjs', [HERE + '../new']);
gate('quarry', 'quarry-check.mjs', [HERE + '../quarry']);
gate('freeref', 'emit/free-ref-scan.mjs', ['--gate']);
gate('datapurity', 'data-purity-check.mjs', ['--gate']);
gate('deeppurity', 'deep-purity-scan.mjs', ['--gate']);
gate('assembly', 'assemble/box-audit.mjs', ['--gate']);
gate('synth', 'generator/synth.mjs', ['--gate']);
gate('coverage', 'coverage-gate.mjs');
gate('pins', 'pins-check.mjs');
gate('boxes', 'box-proofs-check.mjs', ['--gate'], FAST);
gate('selftest', 'police-selftest.mjs', [], FAST);
gate('mutation', 'mutation-check.mjs', [], FAST);
// פריטי מרשם⇄ריצה — דו-כיווני
for (const id of registry) if (!ran.has(id)) { console.error(`🚨 שער רשום שלא רץ: ${id}`); fail = 1; }
for (const id of ran) if (!registry.has(id)) { console.error(`🚨 שער רץ שאינו במרשם: ${id}`); fail = 1; }
console.log(fail ? '🚨 המשטרה אדומה' : `✅ המשטרה ירוקה — ${ran.size}/${registry.size} שערים רצו ותואמים-מרשם`);
process.exit(fail);
