#!/usr/bin/env node
/** מחצב · learn-check — שער `learn` (PROTOCOL v4 §8 · שלב 4): למידה מוכחת מול ההיסטוריה, לא מול פרוזה.
 *  (א) parity: לכל `## L…` ב-LEARNINGS.md שורת `GATE: <id|none>` ו-id קיים (gates.tsv ∪ שערי-pre-commit) — מיגרציה E.
 *  (ב) antipattern-scan: כל `ANTIPATTERN: <regex>` מתקמפל ואינו תופס אף קובץ ב-new/ (הלקח לא חזר).
 *  (ג) learn-on-retry: טיוטת-M4 (`## L<תאריך>-<gate>-<sha6>` עם `ref:`) חייבת ANTIPATTERN+RULE מלאים; ה-regex תופס את
 *      blob-לפני (git show) ולא את הקובץ-אחרי; לא ליטרל (regex בלי מטא-תווים = escape של substring — R2-3.3);
 *      ותופס גם את ה-fixture המוזרע selftest-fixtures/learn/<Lid>.txt (אחרת "אנטי-פטרן מת").
 *  (ד) stuck-loop: audit/retry.jsonl — אותו שער 3 פעמים רצופות ⇒ 🚨 בעלים. אין allow-retry.
 *  יציאה: 0 ירוק · 1 אדום. --gate = אותו דבר (סימטריה עם שאר השערים). */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import * as R from './root.mjs';
const LEARN = R.MACH + 'LEARNINGS.md', GATES = R.MACH + 'gates.tsv', RETRY = R.MACH + 'audit/retry.jsonl', FX = R.MACH + 'selftest-fixtures/learn';
const HOOK_GATES = ['hooks', 'layers', 'exit-direct', 'no-conflict-markers', 'secrets', 'nobinary', 'no-registry', 'gitignore-guard', 'no-export-ignore', 'truth-fresh', 'wiring-fresh', 'ratchet-down', 'cross-source', 'police', 'commit-msg', 'pre-push', 'pre-tool', 'none'];
const gateIds = new Set([...fs.readFileSync(GATES, 'utf8').split('\n').filter((l) => l && !l.startsWith('#')).map((l) => l.split('\t')[0]), ...HOOK_GATES]);
const src = fs.readFileSync(LEARN, 'utf8').split('\n');
const bad = [];
// ── parse entries ──
const entries = [];
for (let i = 0; i < src.length; i++) {
  const m = src[i].match(/^## (L[\w.-]+)/); if (!m) continue;
  let j = i + 1; while (j < src.length && !/^## /.test(src[j])) j++;
  entries.push({ id: m[1], line: i + 1, body: src.slice(i + 1, j) });
}
const field = (e, k) => { const l = e.body.find((x) => x.startsWith(k + ':')); return l ? l.slice(k.length + 1).trim() : null; };
const META = /[.*+?^${}()|[\]\\]/;
// ── (א) parity ──
for (const e of entries) {
  const g = field(e, 'GATE');
  if (g === null) { bad.push(`${e.id} (שורה ${e.line}): אין שורת GATE: (מיגרציה E)`); continue; }
  for (const id of g.split(/[·,\s]+/).filter(Boolean)) if (!gateIds.has(id)) bad.push(`${e.id}: GATE: ${id} — לא שער מוכר`);
}
// ── (ב)+(ג) antipatterns ──
const files = [];
(function walk(d) { for (const x of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, x.name); if (x.isDirectory()) { if (x.name !== 'node_modules') walk(f); } else if (/\.(mjs|js|dart)$/.test(x.name)) files.push(f); } })(R.NEW);
const contents = new Map();
const read = (f) => contents.get(f) ?? (contents.set(f, fs.readFileSync(f, 'utf8')), contents.get(f));
for (const e of entries) {
  const ap = field(e, 'ANTIPATTERN'), rule = field(e, 'RULE'), ref = field(e, 'ref');
  const draft = /^L\d{4}-\d{2}-\d{2}-/.test(e.id) || ref !== null;
  if (draft) {
    if (!ap || !rule) { bad.push(`${e.id}: טיוטת-M4 — ANTIPATTERN/RULE ריקים; מלא (regex+משפט) לפני commit`); continue; }
  }
  if (!ap) continue;
  let re; try { re = new RegExp(ap, 'm'); } catch (err) { bad.push(`${e.id}: ANTIPATTERN לא regex תקין (${err.message})`); continue; }
  if (!META.test(ap)) bad.push(`${e.id}: ANTIPATTERN ליטרל (בלי מטא-תווים) = escape של substring — לא לקח (R2-3.3)`);
  const hits = files.filter((f) => re.test(read(f)));
  if (hits.length) bad.push(`${e.id}: אנטי-פטרן חזר ב-${hits.length} קבצים: ${hits.slice(0, 3).map((f) => path.relative(R.ROOT, f)).join(' · ')}${hits.length > 3 ? ' …' : ''}`);
  if (draft && ref) {
    const [blobBefore, p] = ref.split(':');
    let before = null; try { before = execFileSync('git', ['show', blobBefore], { cwd: R.ROOT, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 }); } catch {}
    if (before === null) bad.push(`${e.id}: ref blob ${blobBefore} לא נמצא`);
    else if (!re.test(before)) bad.push(`${e.id}: ANTIPATTERN לא תופס את blob-לפני (${blobBefore.slice(0, 8)}:${p})`);
    const after = p && fs.existsSync(path.join(R.ROOT, p)) ? fs.readFileSync(path.join(R.ROOT, p), 'utf8') : '';
    if (after && re.test(after)) bad.push(`${e.id}: ANTIPATTERN עדיין תופס את הקובץ-אחרי (${p}) — הלקח לא יושם`);
    const fx = path.join(FX, e.id + '.txt');
    if (!fs.existsSync(fx)) bad.push(`${e.id}: אין fixture מוזרע selftest-fixtures/learn/${e.id}.txt — "אנטי-פטרן מת"`);
    else if (!re.test(fs.readFileSync(fx, 'utf8'))) bad.push(`${e.id}: ה-fixture המוזרע לא נתפס ע"י ה-regex`);
  }
}
// ── (ד) stuck-loop ──
let retries = 0;
if (fs.existsSync(RETRY)) {
  const rows = fs.readFileSync(RETRY, 'utf8').split('\n').filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
  retries = rows.length;
  const last = rows.slice(-3);
  if (last.length === 3 && last.every((r) => r.gate === last[0].gate && !r.resolved)) bad.push(`stuck-loop: השער ${last[0].gate} נכשל 3 פעמים רצופות (audit/retry.jsonl) — עצור, לבעלים. אין allow-retry`);
}
const drafts = entries.filter((e) => field(e, 'ref') !== null).length, aps = entries.filter((e) => field(e, 'ANTIPATTERN')).length;
if (bad.length) { console.log(`🚨 learn: ${bad.length} הפרות`); bad.forEach((b) => console.log('   ✗ ' + b)); process.exit(1); }
console.log(`✓ למידה: ${entries.length} לקחים עם GATE: · ${aps} אנטי-פטרנים לא חזרו ב-${files.length} קבצים · ${drafts} טיוטות-M4 מוכחות · retry.jsonl ${retries} · אין stuck-loop`);
