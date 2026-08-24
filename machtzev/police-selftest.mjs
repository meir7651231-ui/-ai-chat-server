#!/usr/bin/env node
/** מחצב · selftest-המשטרה — מוכיח שכל חוק יורה (נלמד מ-catalog_qa של buildsmart:
 *  fixtures מורעלים פר-חוק + ביקורת-שלילית שנקי עובר). עונה ל"הכלי לא עובד". */
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const TMP = '/tmp/machtzev-selftest';
const run = (script, dir) => { try { execFileSync('node', [new URL(script, import.meta.url).pathname, dir], { stdio: 'pipe' }); return 0; } catch { return 1; } };
const mk = (files) => {
  fs.rmSync(TMP, { recursive: true, force: true });
  for (const [p, c] of Object.entries(files)) { fs.mkdirSync(TMP + '/' + p.split('/').slice(0, -1).join('/'), { recursive: true }); fs.writeFileSync(TMP + '/' + p, c); }
  return TMP;
};
const CLEAN_ATOM = { 'atoms/ok.mjs': 'export const ok = (x) => x + 1;\n',
  'atoms/ok.contract.md': '# חוזה · ok\nתפקיד: מוסיף 1. קלט מספר, פלט מספר. דוגמאות: 1⇒2, 0⇒1. מוצא: selftest. אורך-מילוי כדי לעבור סף-מאה-תווים של השוטר.\n',
  'atoms/ok.test.mjs': "import { ok } from './ok.mjs';\nif (ok(1) !== 2) process.exit(1);\nconsole.log('ok');\n" };
let fail = 0;
const expect = (name, got, want) => { const hit = got === want; console.log(`  ${hit ? '✅' : '❌'} ${name.padEnd(34)} ${hit ? 'יורה כמצופה' : 'לא יורה!'}`); if (!hit) fail = 1; };

// ── חוקי-החשמלאי (wiring) ──
expect('אטום-מייבא-אטום ⇒ אדום', run('./wiring-check.mjs', mk({ ...CLEAN_ATOM, 'atoms/bad.mjs': "import { ok } from './ok.mjs';\nexport const bad = ok;\n", 'atoms/bad.contract.md': '#'.repeat(120), 'atoms/bad.test.mjs': 'console.log(1)' })), 1);
expect('קופסה-מייבאת-קופסה ⇒ אדום', run('./wiring-check.mjs', mk({ 'boxes/a.mjs': "import x from './b.mjs';\n", 'boxes/b.mjs': 'export default 1;\n' })), 1);
expect('בדיקה-מייבאת-את-האטום-שלה ⇒ ירוק', run('./wiring-check.mjs', mk(CLEAN_ATOM)), 0);
// ── חוק-החוזה ──
expect('חוט-בלי-חוזה ⇒ אדום', run('./contract-check.mjs', mk({ 'atoms/x.mjs': 'export const x = 1;\n' })), 1);
expect('בדיקה-אדומה ⇒ אדום', run('./contract-check.mjs', mk({ 'atoms/x.mjs': 'export const x = 1;\n', 'atoms/x.contract.md': '#'.repeat(120), 'atoms/x.test.mjs': 'process.exit(1);\n' })), 1);
expect('חוק-6: מייל-PII-באטום ⇒ אדום', run('./contract-check.mjs', mk({ ...CLEAN_ATOM, 'atoms/pii.mjs': "export const M = 'someone@gmail.com';\n", 'atoms/pii.contract.md': '#'.repeat(120), 'atoms/pii.test.mjs': 'console.log(1)\n' })), 1);
expect('עץ-נקי ⇒ ירוק (ביקורת-שלילית)', run('./contract-check.mjs', mk(CLEAN_ATOM)), 0);
// ── משטרת-המחצבה ──
expect('טיוטה-בלי-מוצא ⇒ אדום', run('./quarry-check.mjs', mk({ 'q/x.mjs': 'export const x = 1;\n' }) + '/q'), 1);
expect('טיוטה-שבורה ⇒ אדום', run('./quarry-check.mjs', mk({ 'q/x.mjs': '/** מוצא: כאן */\nexport const x = ((;\n' }) + '/q'), 1);
expect('טיוטה-תקינה ⇒ ירוק', run('./quarry-check.mjs', mk({ 'q/x.mjs': '/** מוצא: כאן */\nexport const x = 1;\n' }) + '/q'), 0);

fs.rmSync(TMP, { recursive: true, force: true });
console.log(fail ? '\n❌ חוק לא יורה — המשטרה שבורה!' : '\n✅ כל חוקי-המשטרה מוכחים-יורים + ביקורת-שלילית עוברת');
process.exit(fail);
