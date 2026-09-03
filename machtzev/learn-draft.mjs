#!/usr/bin/env node
/** מחצב · learn-draft — מנוע-M4 (PROTOCOL v4 §4 · §8 · שלב 4). רץ מתוך pre-commit, לעולם לא ביד.
 *  --record <g1,g2> --stage <f1,f2>   כשל-תוכן: לכל (שער-כושל × קובץ-staged תחת new/) רשומה ב-audit/retry.jsonl
 *                                     {ts, gate, path, sha:HEAD, blob_before:HEAD:path|null}. בלי שערים ⇒ מסמן resolved
 *                                     את הרשומות הפתוחות שנתיביהן staged (הכשל נפתר).
 *  --stage <f1,f2>                    retry לא-פתור שנתיבו staged וטרם-טויט ⇒ טיוטה בראש LEARNINGS.md:
 *                                     `## L<תאריך>-<gate>-<sha6>` · GATE: · ref: <blob>:<path> · ANTIPATTERN: · RULE: (ריקים לסוכן).
 *                                     ה-id נגזר מ-blob-before ⇒ אידמפוטנטי. פלט: שמות-הטיוטות (או ריק). */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import * as R from './root.mjs';
const argv = process.argv.slice(2);
const opt = (k) => { const i = argv.indexOf(k); return i >= 0 ? (argv[i + 1] || '') : null; };
const RETRY = R.MACH + 'audit/retry.jsonl', LEARN = R.MACH + 'LEARNINGS.md';
const staged = (opt('--stage') || '').split(',').filter(Boolean);
const inNew = staged.filter((f) => f.startsWith('new/') && /\.(mjs|js|dart)$/.test(f));
const git = (...a) => { try { return execFileSync('git', a, { cwd: R.ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return null; } };
const rows = fs.existsSync(RETRY) ? fs.readFileSync(RETRY, 'utf8').split('\n').filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean) : [];
const save = () => { if (!rows.length && !fs.existsSync(RETRY)) return; fs.mkdirSync(path.dirname(RETRY), { recursive: true }); fs.writeFileSync(RETRY, rows.map((r) => JSON.stringify(r)).join('\n') + (rows.length ? '\n' : '')); };   // אין רשומות ואין קובץ ⇒ לא יוצרים (TRUTH סופר תת-תיקיות)

if (argv.includes('--record')) {
  const gates = (opt('--record') || '').split(',').filter(Boolean);
  const sha = git('rev-parse', 'HEAD') || '';
  if (gates.length) {
    const attempt = Math.floor(Date.now() / 1000);
    // R3-5.2: שורה רק לקובץ שבאמת השתנה מול HEAD (blob-לפני ≠ תוכן-נוכחי); אחרת הטיוטה בלתי-ניתנת-לסיפוק
    const changed = inNew.filter((p) => { const b = git('rev-parse', `HEAD:${p}`); if (!b) return true; try { return git('hash-object', p) !== b; } catch { return true; } });
    for (const g of gates) for (const p of changed) rows.push({ ts: attempt, attempt, gate: g, path: p, sha, blob_before: git('rev-parse', `HEAD:${p}`), resolved: false });
    if (gates.length && !changed.length) for (const g of gates) rows.push({ ts: attempt, attempt, gate: g, path: null, sha, blob_before: null, resolved: false });
  } else {
    for (const r of rows) if (!r.resolved && (r.path === null || staged.includes(r.path))) r.resolved = true;
  }
  save(); process.exit(0);
}

// --stage בלבד ⇒ טיוטות
const learn = fs.readFileSync(LEARN, 'utf8');
const today = new Date().toISOString().slice(0, 10);
const made = [];
const seen = new Set();
for (const r of rows) {
  if (r.resolved || !r.path || !r.blob_before || !staged.includes(r.path)) continue;   // בלי נתיב = כשל-כלי: נספר ל-stuck-loop, לא מטויט (אין blob להוכיח מולו)
  const id = `L${today}-${r.gate}-${r.blob_before.slice(0, 6)}`;
  if (seen.has(id) || learn.includes(`## ${id}`) || learn.includes(`ref: ${r.blob_before}:${r.path}`)) continue;
  seen.add(id); made.push({ id, r });
}
if (made.length) {
  const block = made.map(({ id, r }) => `## ${id} · <כותרת-הלקח — מלא>\nGATE: ${r.gate}\nref: ${r.blob_before}:${r.path}\nANTIPATTERN: \nRULE: \n<מה נכשל, למה, ומה החוק — משפט-שניים. הראיה = ref (git show), לא hunk.>\n`).join('\n');
  // אחרי כותרת-הקובץ ושורות-ה-> הפותחות (חדש-ראשון)
  const lines = learn.split('\n'); let k = 0; while (k < lines.length && (/^# /.test(lines[k]) || lines[k].startsWith('>') || lines[k].trim() === '')) k++;   // כותרת-הקובץ (#) + הקדמה (>) בלבד — לא '## L'
  lines.splice(k, 0, block);
  fs.writeFileSync(LEARN, lines.join('\n'));
  fs.mkdirSync(R.MACH + 'selftest-fixtures/learn', { recursive: true });
  for (const { id } of made) { const fx = R.MACH + `selftest-fixtures/learn/${id}.txt`; if (!fs.existsSync(fx)) fs.writeFileSync(fx, `<הדבק כאן דוגמה מורעלת שה-ANTIPATTERN של ${id} חייב לתפוס>\n`); }
}
console.log(made.map((m) => m.id).join(' · '));
