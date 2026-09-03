#!/usr/bin/env node
/** מחצב · audit-gates — G5 (PROTOCOL v4 §7.3 · שלב 8): כל שער-staging/commit-msg **חוסם בפועל** על הפרה מוזרעת, ב-clone זמני עם hooksPath.
 *  לא בודק את הסקריפטים — בודק את ה-hooks כפי שגיט מריץ אותם (הראיה = `git commit` שנכשל/הצליח).
 *  הזרעות בקבצי-תיעוד בלבד (allowlist ⇒ המשטרה מדולגת ⇒ מהיר): secrets · conflict-markers · nobinary · no-registry · gitignore-guard ·
 *  no-export-ignore · commit-msg (קצר · זבל · Allow שגוי · pins-write לחוקה חסר) · ביקורת-שלילית (commit-תיעוד תקין ⇒ מצליח + Protocol-Ran).
 *  יציאה: 0 · 1 (שער שלא חסם / ביקורת-שלילית נכשלה) · 2 (git חסר). שכבת-push (FAST ⇒ דילוג). */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import * as R from './root.mjs';
const ROOT = R.ROOT.replace(/\/$/, '');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'audit-gates-'));
const WT = path.join(tmp, 'wt');
const git = (args, cwd = WT, input) => spawnSync('git', args, { cwd, encoding: 'utf8', input, env: { ...process.env, GIT_AUTHOR_NAME: 'audit', GIT_AUTHOR_EMAIL: 'audit@machtzev', GIT_COMMITTER_NAME: 'audit', GIT_COMMITTER_EMAIL: 'audit@machtzev' } });
if (git(['--version'], ROOT).status !== 0) { console.log('🟡 tool=git'); process.exit(2); }
// worktree detached של HEAD (כולל .githooks) — לא נוגע בריפו האמיתי
if (git(['worktree', 'add', '--detach', '-q', WT, 'HEAD'], ROOT).status !== 0) { console.log('🔴 audit-gates: worktree add נכשל'); process.exit(1); }
process.on('exit', () => { try { git(['worktree', 'remove', '--force', WT], ROOT); fs.rmSync(tmp, { recursive: true, force: true }); } catch {} });
git(['config', 'core.hooksPath', '.githooks']);
if (fs.existsSync(path.join(ROOT, 'machtzev/node_modules'))) fs.cpSync(path.join(ROOT, 'machtzev/node_modules'), path.join(WT, 'machtzev/node_modules'), { recursive: true });
const write = (f, s) => { fs.mkdirSync(path.dirname(path.join(WT, f)), { recursive: true }); fs.writeFileSync(path.join(WT, f), s); };
const attempt = (files, msg) => { git(['add', '-A']); const r = git(['commit', '-q', '-F', '-'], WT, msg); git(['reset', '-q', '--hard', 'HEAD']); git(['clean', '-qfd']); return r; };
const CASES = [
  { id: 'secrets', expect: 1, seed: () => write('knowledge/audit-seed.md', 'contact: someone@gmail.com\n'), msg: 'הזרעה: סוד בתיעוד' },
  { id: 'no-conflict-markers', expect: 1, seed: () => write('knowledge/audit-seed.md', 'a\n<<<<<<< HEAD\nb\n=======\nc\n>>>>>>> x\n'), msg: 'הזרעה: סימני conflict' },
  { id: 'nobinary', expect: 1, seed: () => write('knowledge/audit-seed.md', 'x'.repeat(1024 * 1024 + 10)), msg: 'הזרעה: קובץ גדול ממגה' },
  { id: 'no-registry', heavy: true, expect: 1, seed: () => write('machtzev/registry/seed.json', '{}'), msg: 'הזרעה: registry בסטייג׳ינג' },
  { id: 'gitignore-guard', heavy: true, expect: 1, seed: () => write('.gitignore', fs.readFileSync(path.join(WT, '.gitignore'), 'utf8').split('\n').filter((l) => !/node_modules|\.allow_/.test(l)).join('\n')), msg: 'הזרעה: הסרת כיסוי מ-gitignore' },
  { id: 'no-export-ignore', heavy: true, expect: 1, seed: () => write('.gitattributes', fs.readFileSync(path.join(WT, '.gitattributes'), 'utf8') + '\nmachtzev/police.mjs export-ignore\n'), msg: 'הזרעה: export-ignore' },
  { id: 'commit-msg:short', expect: 1, seed: () => write('knowledge/audit-seed.md', 'ok\n'), msg: 'wip' },
  { id: 'commit-msg:allow-format', expect: 1, seed: () => write('knowledge/audit-seed.md', 'ok\n'), msg: 'תיעוד: הזרעת Allow שגוי\n\nAllow: baseline dup L1\n' },
  { id: 'commit-msg:pins-write', expect: 1, seed: () => write('machtzev/LEARNINGS.md', fs.readFileSync(path.join(WT, 'machtzev/LEARNINGS.md'), 'utf8') + '\n<!-- audit -->\n'), msg: 'תיעוד: עריכת חוקה בלי Allow' },
  { id: 'negative-control', expect: 0, seed: () => write('knowledge/audit-seed.md', 'commit-תיעוד תקין\n'), msg: 'תיעוד: ביקורת-שלילית של audit-gates — commit תקין חייב לעבור' },
];
const FULL = process.argv.includes('--full');   // הזרעות כבדות (קובץ-קוד ⇒ משטרה מלאה בעותק) — CI בלבד
let bad = 0; const rows = [];
for (const c of CASES.filter((c) => FULL || !c.heavy)) {
  c.seed();
  const r = attempt([], c.msg);
  const got = r.status === 0 ? 0 : 1;
  const ok = got === c.expect;
  if (!ok) bad++;
  const trailer = c.expect === 0 && got === 0 ? (git(['log', '-1', '--format=%B']).stdout.includes('Protocol-Ran:') ? ' · Protocol-Ran ✓' : ' · ❌ בלי Protocol-Ran') : '';
  if (c.expect === 0 && got === 0 && !trailer.includes('✓')) bad++;
  rows.push(`  ${ok ? '✅' : '❌'} [${c.id}] ${c.expect ? 'הפרה-מוזרעת ⇒ commit נחסם' : 'commit תקין ⇒ עובר'}${ok ? '' : ` — קיבלתי ${got}: ${(r.stderr + r.stdout).split('\n').filter((l) => /🚨|❌/.test(l)).slice(-2).join(' | ').slice(0, 160)}`}${trailer}`);
  if (c.expect === 0 && got === 0) git(['reset', '-q', '--hard', 'HEAD~1']);
}
rows.forEach((l) => console.log(l));
if (bad) { console.log(`🚨 audit-gates: ${bad}/${rows.length} שערים לא חוסמים/עוברים כמצופה ב-clone זמני`); process.exit(1); }
console.log(`✓ audit-gates: ${rows.length}/${rows.length}${FULL ? ' (--full)' : ' (מהירות; כבדות ב-CI --full)'} — כל שער-staging חוסם על הפרה מוזרעת + ביקורת-שלילית עוברת (clone זמני · hooksPath)`);
