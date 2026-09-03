#!/usr/bin/env node
/** מחצב · ראצ׳ט-כיוון (PROTOCOL v4 §5.2 צעד 4 · שלב 1) — הפרוטוקול רק גדל.
 *  משווה שני commits (from → to) דרך `git show` (לעולם לא מעץ-עבודה): tuples gate(id, script, skip) ב-police.mjs
 *  לא-יורדים · רשומות-מרשם ב-gates.tsv לא נמחקות · baselines לפי המניפסט (baseline=<f>;dir=shrink|grow).
 *  משמש: pre-commit (merge-base → index), pre-push (merge-base → sha), verify-independent (T → H).
 *  שימוש: node machtzev/ratchet-direction.mjs <from> <to|--index> [--repo d]   exit 0 = אין החלשה · 1 = החלשה */
import { execFileSync } from 'node:child_process';
import path from 'node:path';
const argv = process.argv.slice(2);
const opt = (f, d = null) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : d; };
const [FROM, TO] = argv.filter((a, i) => (a === '--index' || !a.startsWith('--')) && (i === 0 || argv[i - 1] !== '--repo'));
const REPO = path.resolve(opt('--repo', '.'));
const git = (...a) => execFileSync('git', ['-C', REPO, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
const show = (ref, p) => { try { return ref === '--index' ? git('show', `:${p}`) : git('show', `${ref}:${p}`); } catch { return null; } };
const narrowsFast = (skip) => skip === 'FAST' || /^FAST(\s*&&\s*!?[A-Za-z_$][\w$]*)+$/.test(skip);   // FAST && X מדלג רק כש-FAST מדלג ⇒ צמצום, לא החלשה
const tuples = (ref) => Object.fromEntries([...(show(ref, 'machtzev/police.mjs') || '').matchAll(/^\s*gate(?:Dirty)?\(\s*'([^']+)'\s*,\s*'([^']+)'(?:\s*,\s*\[[^\]]*\])?(?:\s*,\s*([^)]+))?\)/gm)].map((m) => [m[1], { script: m[2], skip: (m[3] || '').trim() }]));
const manifest = (ref) => { const m = {}; for (const l of (show(ref, 'machtzev/gates.tsv') || '').split('\n')) { if (!l || l.startsWith('#')) continue; const p = l.split('\t'); const b = (p[3] || '').match(/^(?:baseline=)?([^;]+);(?:dir=)?(shrink|grow)$/); m[p[0]] = b ? { file: 'machtzev/' + b[1], dir: b[2] } : null; } return m; };
const a = tuples(FROM), b = tuples(TO), ma = manifest(FROM), mb = manifest(TO);
const issues = [];
for (const id of Object.keys(a)) {
  if (!b[id]) issues.push(`שער נמחק מ-police.mjs: ${id}`);
  else { if (b[id].script !== a[id].script) issues.push(`סקריפט הוחלף: ${id} ${a[id].script} → ${b[id].script}`); if (b[id].skip && b[id].skip !== a[id].skip && !narrowsFast(b[id].skip)) issues.push(`skip חדש: ${id}=${b[id].skip}`); }
}
for (const id of Object.keys(ma)) if (!(id in mb)) issues.push(`רשומת-מרשם נמחקה: ${id}`);
for (const id of Object.keys(mb)) {
  const bl = mb[id]; if (!bl) continue;
  const before = show(FROM, bl.file), after = show(TO, bl.file);
  if (before === null || after === null || before === after) continue;
  let A, B; try { A = JSON.parse(before); B = JSON.parse(after); } catch { issues.push(`baseline לא-JSON: ${bl.file}`); continue; }
  if (bl.dir === 'shrink') { const sa = new Set(Array.isArray(A) ? A : Object.keys(A)); const grew = (Array.isArray(B) ? B : Object.keys(B)).filter((x) => !sa.has(x)); if (grew.length) issues.push(`baseline גדל (${bl.file}): +${grew.length} · ${grew.slice(0, 3).join(', ')}`); }
  else for (const k of Object.keys(A)) if (typeof A[k] === 'number' && typeof B[k] === 'number' && B[k] < A[k]) issues.push(`ראצ׳ט ירד (${bl.file}.${k}): ${A[k]} → ${B[k]}`);
}
if (issues.length) { console.error('🚨 ראצ׳ט-כיוון: החלשה ' + FROM.slice(0, 8) + ' → ' + (TO === '--index' ? 'index' : TO.slice(0, 8)) + ':'); issues.forEach((x) => console.error('   · ' + x)); process.exit(1); }
console.log(`✓ ראצ׳ט-כיוון: אין החלשה (${Object.keys(b).length} שערים · ${Object.values(mb).filter(Boolean).length} baselines)`);
