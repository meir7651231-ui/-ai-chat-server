#!/usr/bin/env node
/** מחצב · merge-driver "regen" לקבצים מחוללים (TRUTH.md · WIRING.md) — שלב 1 (RED-TEAM R2-2.6).
 *  git קורא: merge-regen.mjs %O %A %B %P  — במקום מיזוג-טקסט (סימני-conflict בקובץ מחולל) מחדשים מהעץ:
 *  TRUTH.md ⇒ truth.mjs --write · WIRING.md ⇒ tools/gen-wiring-doc.mjs · אחר ⇒ נופל ל-"theirs" ומדווח.
 *  מוגדר ב-session-start / self-heal: git config merge.regen.driver "node machtzev/merge-regen.mjs %O %A %B %P" */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const [, , O, A, B, P] = process.argv;
const HERE = path.dirname(new URL(import.meta.url).pathname);
const ROOT = path.resolve(HERE, '..');
const name = path.basename(P || '');
try {
  if (name === 'TRUTH.md') { execFileSync('node', [path.join(HERE, 'truth.mjs'), '--write'], { cwd: ROOT, stdio: 'ignore' }); fs.copyFileSync(path.join(ROOT, 'TRUTH.md'), A); }
  else if (name === 'WIRING.md') { execFileSync('node', [path.join(HERE, 'tools/gen-wiring-doc.mjs')], { cwd: ROOT, stdio: 'ignore' }); fs.copyFileSync(path.join(ROOT, 'WIRING.md'), A); }
  else { fs.copyFileSync(B, A); console.error(`merge-regen: ${name} אינו מחולל-מוכר — נלקח theirs`); }
  console.error(`merge-regen: ${name} חודש מהעץ (לא מיזוג-טקסט)`);
  process.exit(0);
} catch (e) { console.error('merge-regen נכשל: ' + e.message); process.exit(1); }
