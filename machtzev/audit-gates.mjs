#!/usr/bin/env node
/** מחצב · audit-gates — G5 (PROTOCOL v4 §7.3 · שלב 8 · סבב-3: R3-3.12 · R3-4.16 · R3-5.9 · R3-5.10): כל שער-staging/commit-msg/ratchet
 *  **חוסם בפועל ומהסיבה הנכונה** על הפרה מוזרעת, ב-worktree זמני עם hooksPath. הראיה = `git commit` שנכשל + שם-השער בפלט.
 *  מהירות (תיעוד ⇒ המשטרה מדולגת): secrets · conflict · nobinary · commit-msg קצר · זבל · Allow-שגוי · pins-write · ביקורת-שלילית (+Protocol-Ran).
 *  כבדות (--full, CI): registry · gitignore-guard · export-ignore · baseline-ירד-בלי-Allow · שער-נמחק-מ-police (ראצ׳ט).
 *  יציאה: 0 · 1 · 2 (git חסר, tool=git ב-stderr). שכבת-push (FAST ⇒ דילוג). ניקוי גם על TERM/INT. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import * as R from './root.mjs';
const ROOT = R.ROOT.replace(/\/$/, '');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'audit-gates-'));
const WT = path.join(tmp, 'wt');
const git = (args, cwd = WT, input) => spawnSync('git', args, { cwd, encoding: 'utf8', input, env: { ...process.env, GIT_AUTHOR_NAME: 'audit', GIT_AUTHOR_EMAIL: 'audit@machtzev', GIT_COMMITTER_NAME: 'audit', GIT_COMMITTER_EMAIL: 'audit@machtzev' } });
if (git(['--version'], ROOT).status !== 0) { console.error('tool=git'); console.log('🟡 tool=git'); process.exit(2); }
if (git(['worktree', 'add', '--detach', '-q', WT, 'HEAD'], ROOT).status !== 0) { console.log('🔴 audit-gates: worktree add נכשל'); process.exit(1); }
const cleanup = () => { try { git(['worktree', 'remove', '--force', WT], ROOT); fs.rmSync(tmp, { recursive: true, force: true }); } catch {} };
process.on('exit', cleanup); for (const s of ['SIGTERM', 'SIGINT', 'SIGHUP']) process.on(s, () => { cleanup(); process.exit(1); });
git(['config', 'core.hooksPath', '.githooks']);
if (fs.existsSync(path.join(ROOT, 'machtzev/node_modules'))) fs.cpSync(path.join(ROOT, 'machtzev/node_modules'), path.join(WT, 'machtzev/node_modules'), { recursive: true });
const read = (f) => fs.readFileSync(path.join(WT, f), 'utf8');
const write = (f, s) => { fs.mkdirSync(path.dirname(path.join(WT, f)), { recursive: true }); fs.writeFileSync(path.join(WT, f), s); };
const attempt = (msg, force = []) => { git(['add', '-A']); for (const f of force) git(['add', '-f', f]); const r = git(['commit', '-q', '-F', '-'], WT, msg); const out = (r.stdout || '') + (r.stderr || ''); git(['reset', '-q', '--hard', 'HEAD']); git(['clean', '-qfdx', '-e', 'machtzev/node_modules']); return { status: r.status, out }; };
const OK = 'תיעוד: ביקורת-שלילית של audit-gates — commit תקין חייב לעבור';
const CASES = [
  { id: 'secrets', expect: 1, mark: /\[secrets\]/, seed: () => write('knowledge/audit-seed.md', 'contact: someone@gmail.com\n'), msg: 'הזרעה: סוד בתיעוד' },
  { id: 'no-conflict-markers', expect: 1, mark: /\[no-conflict-markers\]/, seed: () => write('knowledge/audit-seed.md', 'a\n<<<<<<< HEAD\nb\n=======\nc\n>>>>>>> x\n'), msg: 'הזרעה: סימני conflict' },
  { id: 'nobinary', expect: 1, mark: /\[nobinary\]/, seed: () => write('knowledge/audit-seed.md', 'x'.repeat(1024 * 1024 + 10)), msg: 'הזרעה: קובץ גדול ממגה' },
  { id: 'commit-msg:short', expect: 1, mark: /קצרה מדי/, seed: () => write('knowledge/audit-seed.md', 'ok commit-msg:short\n'), msg: 'תיקון קטן' },
  { id: 'commit-msg:junk', expect: 1, mark: /לא-תיאורית/, seed: () => write('knowledge/audit-seed.md', 'ok commit-msg:junk\n'), msg: 'wip\n\nגוף-הודעה ארוך מספיק כדי שהאורך יעבור ורק שורת-הכותרת תיפסל כזבל' },
  { id: 'commit-msg:allow-format', expect: 1, mark: /Allow שגוי/, seed: () => write('knowledge/audit-seed.md', 'ok commit-msg:allow-format\n'), msg: 'תיעוד: הזרעת Allow שגוי\n\nAllow: baseline dup L1\n' },
  { id: 'commit-msg:allow-reason', expect: 1, mark: /סיבה לא קיימת/, seed: () => write('knowledge/audit-seed.md', 'ok commit-msg:allow-reason\n'), msg: 'תיעוד: הזרעת Allow עם סיבה מומצאת\n\nAllow: baseline:dup-class-baseline.json L99999\n' },
  { id: 'commit-msg:pins-write', expect: 1, mark: /בלי "Allow: pins-write/, seed: () => write('machtzev/LEARNINGS.md', read('machtzev/LEARNINGS.md') + '\n<!-- audit -->\n'), msg: 'תיעוד: עריכת חוקה בלי Allow' },
  { id: 'no-registry', heavy: true, expect: 1, mark: /\[no-registry\]/, seed: () => write('machtzev/registry/seed.json', '{}'), force: ['machtzev/registry/seed.json'], msg: 'הזרעה: registry בסטייג׳ינג' },
  { id: 'gitignore-guard', heavy: true, expect: 1, mark: /\[gitignore-guard\]/, seed: () => write('.gitignore', read('.gitignore').split('\n').filter((l) => !/node_modules|\.allow_/.test(l)).join('\n')), msg: 'הזרעה: הסרת כיסוי מ-gitignore' },
  { id: 'no-export-ignore', heavy: true, expect: 1, mark: /\[no-export-ignore\]/, seed: () => write('.gitattributes', read('.gitattributes') + '\nmachtzev/police.mjs export-ignore\n'), msg: 'הזרעה: export-ignore' },
  { id: 'ratchet:baseline-drop', heavy: true, expect: 1, mark: /החלשה בלי Allow|ratchet-down/, seed: () => { const f = 'machtzev/wired-floor.json'; const j = JSON.parse(read(f)); for (const k of Object.keys(j)) if (typeof j[k] === 'number') j[k] = Math.max(0, j[k] - 1); write(f, JSON.stringify(j, null, 1) + '\n'); }, msg: 'הזרעה: הורדת רצפה בלי Allow' },
  { id: 'ratchet:gate-deleted', heavy: true, expect: 1, mark: /שער נמחק|ratchet-down/, seed: () => write('machtzev/police.mjs', read('machtzev/police.mjs').replace(/^\s*gate\('quarry'[^\n]*\n/m, '')), msg: 'הזרעה: מחיקת שער מ-police\n\nAllow: pins-write:police.mjs הכרעה-P\n' },
  { id: 'negative-control', expect: 0, seed: () => write('knowledge/audit-seed.md', 'commit-תיעוד תקין\n'), msg: OK },
];
const FULL = process.argv.includes('--full');
let bad = 0; const rows = [];
for (const c of CASES.filter((c) => FULL || !c.heavy)) {
  c.seed();
  const r = attempt(c.msg, c.force || []);
  if (process.env.AUDIT_DEBUG) console.log(`[debug ${c.id}] status=${r.status} out=${JSON.stringify(r.out.slice(-300))}`);
  const got = r.status === 0 ? 0 : 1;
  let ok = got === c.expect, why = '';
  if (ok && c.expect === 1 && c.mark && !c.mark.test(r.out)) { ok = false; why = 'נחסם, אבל לא מהשער הצפוי (R3-3.12)'; }
  if (r.status === 0) { const m = git(['log', '-1', '--format=%B']).stdout; if (c.expect === 0 && !m.includes('Protocol-Ran:')) { ok = false; why = 'עבר בלי Protocol-Ran'; } git(['reset', '-q', '--hard', 'HEAD~1']); }   // כל commit שהצליח מתגלגל אחורה — אחרת המקרה הבא 'nothing to commit' בלי hooks (R3 cascade)
  if (!ok) bad++;
  rows.push(`  ${ok ? '✅' : '❌'} [${c.id}] ${c.expect ? 'הפרה-מוזרעת ⇒ נחסם מהסיבה הנכונה' : 'commit תקין ⇒ עובר + Protocol-Ran'}${ok ? '' : ` — ${why || 'קיבלתי ' + got}: ${r.out.split('\n').filter((l) => /🚨|❌/.test(l)).slice(-2).join(' | ').slice(0, 180)}`}`);
}
rows.forEach((l) => console.log(l));
if (bad) { console.log(`🚨 audit-gates: ${bad}/${rows.length} שערים לא חוסמים/עוברים כמצופה ב-worktree זמני`); process.exit(1); }
console.log(`✓ audit-gates: ${rows.length}/${rows.length}${FULL ? ' (--full)' : ' (מהירות; כבדות ב-CI --full)'} — כל שער חוסם מהסיבה הנכונה + ביקורת-שלילית עוברת עם Protocol-Ran`);
