#!/usr/bin/env node
/** מחצב · learn-check — שער `learn` (PROTOCOL v4 §8 · שלב 4 · סבב-3: R3-5.1 · R3-5.14 · R3-5.15 · R3-5.16 · R3-3.17).
 *  (א) parity: לכל `## L…` שורת `GATE: <id|none>` עם id מוכר (gates.tsv ∪ שערי-hook) — מיגרציה E. מספר-הלקחים רק-עולה (learn-baseline.json · grow).
 *  (ב) antipattern-scan: כל `ANTIPATTERN:` regex תקין, לא-ליטרל (אחרי הסרת escapes), ואינו תופס אף קובץ ב-new/.
 *  (ג) learn-on-retry: טיוטת-M4 (id בתאריך / `ref:`) — ANTIPATTERN+RULE מלאים · תופס blob-לפני · לא תופס אחרי · fixture ב-selftest-fixtures/learn/<id>.txt
 *      שנתפס **ואינו** העתק-של-blob-לפני (R3-5.15) · ref `sha:-` (כשל בלי נתיב) ⇒ בלי בדיקות-blob אבל עם fixture.
 *  (ד) stuck-loop: אותו שער ב-3 **ניסיונות-commit** שונים לא-פתורים (לא 3 שורות — R3-5.1) ⇒ 🚨 בעלים.
 *  יציאה: 0 · 1. --floor: קובע רצפת-לקחים. */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import * as R from './root.mjs';
const LEARN = R.MACH + 'LEARNINGS.md', GATES = R.MACH + 'gates.tsv', RETRY = R.MACH + 'audit/retry.jsonl', FX = R.MACH + 'selftest-fixtures/learn', FLOOR = R.MACH + 'learn-baseline.json';
const HOOK_GATES = ['hooks', 'layers', 'exit-direct', 'no-conflict-markers', 'secrets', 'nobinary', 'no-registry', 'gitignore-guard', 'no-export-ignore', 'truth-fresh', 'wiring-fresh', 'ratchet-down', 'cross-source', 'search-proof', 'pins-write', 'police', 'commit-msg', 'pre-push', 'pre-tool', 'none'];
const gateIds = new Set([...fs.readFileSync(GATES, 'utf8').split('\n').filter((l) => l && !l.startsWith('#')).map((l) => l.split('\t')[0]), ...HOOK_GATES]);
const src = fs.readFileSync(LEARN, 'utf8').split('\n');
const bad = [];
const entries = [];
for (let i = 0; i < src.length; i++) {
  const m = src[i].match(/^## (L[\w.-]+)/);
  if (!m) { if (/^## (\d|L\d|L[ ·-])/.test(src[i])) bad.push(`שורה ${i + 1}: כותרת-לקח בלי מזהה L תקין — "${src[i].slice(0, 60)}" (R3-5.16)`); continue; }   // כותרות-סעיף (אמוג׳י/טקסט) מותרות
  let j = i + 1; while (j < src.length && !/^## /.test(src[j])) j++;
  entries.push({ id: m[1], line: i + 1, body: src.slice(i + 1, j) });
}
if (process.argv.includes('--floor')) { fs.writeFileSync(FLOOR, JSON.stringify({ entries: entries.length }, null, 1) + '\n'); console.log(`✍️ learn floor ⇒ ${entries.length}`); process.exit(0); }
if (!fs.existsSync(FLOOR)) bad.push('אין learn-baseline.json — --floor (fail-closed)');
else { const fl = JSON.parse(fs.readFileSync(FLOOR, 'utf8')).entries ?? 0; if (entries.length < fl) bad.push(`מספר-הלקחים ירד ${fl} → ${entries.length} (רק-עולה)`); }
const field = (e, k) => { const l = e.body.find((x) => x.startsWith(k + ':')); return l ? l.slice(k.length + 1).trim() : null; };
const META = /[.*+?^${}()|[\]\\]/;
for (const e of entries) {
  const g = field(e, 'GATE');
  if (g === null) { bad.push(`${e.id} (שורה ${e.line}): אין שורת GATE: (מיגרציה E)`); continue; }
  for (const id of g.split(/[·,\s]+/).filter(Boolean)) if (!gateIds.has(id)) bad.push(`${e.id}: GATE: ${id} — לא שער מוכר`);
}
const files = [];
(function walk(d) { for (const x of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, x.name); if (x.isDirectory()) { if (x.name !== 'node_modules') walk(f); } else if (/\.(mjs|js|dart)$/.test(x.name)) files.push(f); } })(R.NEW);
const contents = new Map();
const read = (f) => contents.get(f) ?? (contents.set(f, fs.readFileSync(f, 'utf8')), contents.get(f));
for (const e of entries) {
  const ap = field(e, 'ANTIPATTERN'), rule = field(e, 'RULE'), ref = field(e, 'ref');
  const draft = /^L\d{4}-\d{2}-\d{2}-/.test(e.id) || ref !== null;
  if (draft && (!ap || !rule)) { bad.push(`${e.id}: טיוטת-M4 — ANTIPATTERN/RULE ריקים; מלא (regex+משפט) לפני commit`); continue; }
  if (draft && ref === null) bad.push(`${e.id}: לקח בתאריך בלי ref: (R3-5.16)`);
  if (!ap) continue;
  let re; try { re = new RegExp(ap, 'm'); } catch (err) { bad.push(`${e.id}: ANTIPATTERN לא regex תקין (${err.message})`); continue; }
  if (!META.test(ap.replace(/\\./g, 'x'))) bad.push(`${e.id}: ANTIPATTERN ליטרל (בלי מטא-תווים אמיתיים) = escape של substring — לא לקח (R2-3.3 · R3-5.14)`);
  const hits = files.filter((f) => re.test(read(f)));
  if (hits.length) bad.push(`${e.id}: אנטי-פטרן חזר ב-${hits.length} קבצים: ${hits.slice(0, 3).map((f) => path.relative(R.ROOT, f)).join(' · ')}${hits.length > 3 ? ' …' : ''}`);
  if (draft && ref) {
    const [blob, p] = ref.split(':');
    let before = null;
    if (p && p !== '-') {
      try { before = execFileSync('git', ['show', blob], { cwd: R.ROOT, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 }); } catch {}
      if (before === null) bad.push(`${e.id}: ref blob ${blob} לא נמצא`);
      else if (!re.test(before)) bad.push(`${e.id}: ANTIPATTERN לא תופס את blob-לפני (${blob.slice(0, 8)}:${p})`);
      const after = fs.existsSync(path.join(R.ROOT, p)) ? fs.readFileSync(path.join(R.ROOT, p), 'utf8') : '';
      if (after && re.test(after)) bad.push(`${e.id}: ANTIPATTERN עדיין תופס את הקובץ-אחרי (${p}) — הלקח לא יושם`);
    }
    const fx = path.join(FX, e.id + '.txt');
    if (!fs.existsSync(fx)) bad.push(`${e.id}: אין fixture מוזרע selftest-fixtures/learn/${e.id}.txt — "אנטי-פטרן מת"`);
    else {
      const fxs = fs.readFileSync(fx, 'utf8');
      if (!re.test(fxs)) bad.push(`${e.id}: ה-fixture המוזרע לא נתפס ע"י ה-regex`);
      if (before && fxs.trim().length && before.includes(fxs.trim())) bad.push(`${e.id}: ה-fixture הוא העתק מ-blob-לפני — לא הכללה (R3-5.15)`);
    }
  }
}
let retries = 0;
if (fs.existsSync(RETRY)) {
  const rows = fs.readFileSync(RETRY, 'utf8').split('\n').filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
  retries = rows.length;
  const open = rows.filter((r) => !r.resolved);
  const byGate = {};
  for (const r of open) if (!/^(learn|police)$/.test(r.gate)) (byGate[r.gate] ||= new Set()).add(r.attempt ?? r.ts);   // מטא-שערים אינם לקחי-קוד
  for (const [g, s] of Object.entries(byGate)) if (s.size >= 3) bad.push(`stuck-loop: השער ${g} נכשל ב-${s.size} ניסיונות-commit לא-פתורים (audit/retry.jsonl) — עצור, לבעלים. אין allow-retry`);
}
const drafts = entries.filter((e) => field(e, 'ref') !== null).length, aps = entries.filter((e) => field(e, 'ANTIPATTERN')).length;
if (bad.length) { console.log(`🚨 learn: ${bad.length} הפרות`); bad.forEach((b) => console.log('   ✗ ' + b)); process.exit(1); }
console.log(`✓ למידה: ${entries.length} לקחים עם GATE: (רצפה) · ${aps} אנטי-פטרנים לא חזרו ב-${files.length} קבצים · ${drafts} טיוטות-M4 מוכחות · retry.jsonl ${retries} · אין stuck-loop`);
