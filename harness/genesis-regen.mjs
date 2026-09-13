#!/usr/bin/env node
// 🧬 genesis-regen — פקודת-הבנייה של גנסיס עבור harness/police.mjs.
//   מריץ את רשימת REGEN של הריפו, בלי tighten-types (ידוע-שבור) ובלי peruk.mjs
//   (מחולל-מחדש את specs-ds מ-peruks/*.md ומוחק עריכות-ספק לגיטימיות של המשימה).
//   יוצא 0 רק אם כל צעד יצא 0. אין תלות ב-harness — זה קובץ של הפרויקט.
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = process.env.HARNESS_ROOT || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKIP = /tighten-types|generator\/peruk\.mjs/;
const { REGEN } = await import(path.join(ROOT, 'machtzev/generator/regen.mjs'));

let failed = 0;
for (const s of REGEN) {
  if (SKIP.test(s.rel)) continue;
  const r = spawnSync('node', [path.join(ROOT, s.rel), ...s.args], { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 240000, killSignal: 'SIGKILL' });
  if (r.status !== 0) { failed++; console.error(`✗ ${s.rel} ${s.args.join(' ')} → ${((r.stderr || '') + (r.stdout || '')).split('\n').filter(Boolean).slice(-2).join(' ‖ ').slice(0, 200)}`); }
}
console.log(failed ? `✗ regen: ${failed} צעדים נכשלו` : `✓ regen: ${REGEN.filter((s) => !SKIP.test(s.rel)).length} צעדים`);
process.exit(failed ? 1 : 0);
