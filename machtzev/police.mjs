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
// שער-"מלכלך": מצלם dart-gen-bs לפני, מריץ, ומשחזר-מדויק אחרי (המחולל כותב פלט; המשטרה חייבת עץ-נח · L14).
const snapD = (d, re) => { try { return Object.fromEntries(fs.readdirSync(d).filter(f => re.test(f)).map(f => [f, fs.readFileSync(d + '/' + f, 'utf8')])); } catch { return {}; } };
const restoreD = (d, re, s) => { try { for (const f of fs.readdirSync(d)) if (re.test(f)) fs.unlinkSync(d + '/' + f); } catch {} for (const [f, c] of Object.entries(s)) { try { fs.writeFileSync(d + '/' + f, c); } catch {} } };
const GENd = HERE + '../new/dart-gen-bs', DATAd = HERE + '../new/dart-data-bs/auto', GAP = /^gen_app_.*\.dart$/;
const gateDirty = (id, script, args = [], skip = false) => {
  if (skip) { ran.add(id); console.log(`~ ${id} (מדולג ב---fast, נספר-כנרשם)`); return; }
  const s1 = snapD(GENd, GAP), s2 = snapD(DATAd, GAP);
  try { execFileSync('node', [HERE + script, ...args], { stdio: 'inherit', timeout: 600000 }); } catch { fail = 1; }
  restoreD(GENd, GAP, s1); restoreD(DATAd, GAP, s2);
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
gate('genratchet', 'mahulal/generator-ratchet.mjs');
gate('independence', 'purity/independence-check.mjs');
gate('puredata', 'purity/purity-data.mjs', ['--gate']);
gateDirty('acceptance', 'mahulal/spec-acceptance.mjs');
gateDirty('nlsmoke', 'mahulal/nl-smoke.mjs', [], FAST);
gateDirty('nlquality', 'mahulal/nl-quality.mjs', [], FAST);
gate('oracle', 'census/oracle.mjs', ['--gate']);
gate('truth', 'truth.mjs', ['--gate']);
gate('pins', 'pins-check.mjs');
gate('selftest', 'police-selftest.mjs', [], FAST);
gate('mutation', 'mutation-check.mjs', [], FAST);
// פריטי מרשם⇄ריצה — דו-כיווני
for (const id of registry) if (!ran.has(id)) { console.error(`🚨 שער רשום שלא רץ: ${id}`); fail = 1; }
for (const id of ran) if (!registry.has(id)) { console.error(`🚨 שער רץ שאינו במרשם: ${id}`); fail = 1; }
console.log(fail ? '🚨 המשטרה אדומה' : `✅ המשטרה ירוקה — ${ran.size}/${registry.size} שערים רצו ותואמים-מרשם`);
process.exit(fail);
