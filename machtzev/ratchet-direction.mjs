#!/usr/bin/env node
/** מחצב · ratchet-direction — "האם commit B חלש מ-A?" (PROTOCOL v4 §5.2 · שלב 1 · סבב-3: R3-4.4/4.5/4.7/4.8/4.14).
 *  משווה שני commits (from → to) דרך `git show` (לעולם לא מעץ-עבודה):
 *  · tuples gate(id, script, args, skip) ב-police.mjs: שער נמחק · סקריפט הוחלף · ארגומנטים השתנו · skip הורחב
 *    (skip מותר רק: זהה · ריק · `<a.skip> && …` צמצום-אמיתי; ריק→FAST = החלשה)
 *  · מניפסט gates.tsv: רשומה נמחקה · baseline-manifest הוסר/הוחלף/כיוון-התהפך
 *  · baselines (רקורסיבי): shrink = מפתחות/פריטי-מערך/מספרים לא עולים · grow = לא יורדים · baseline נמחק = החלשה
 *  יציאה: 0 אין החלשה · 1 החלשה (stderr: שורות `   · …`) · 2 שגיאת-קלט. שימוש: <from> <to|--index> [--repo dir] */
import { execFileSync } from 'node:child_process';
import path from 'node:path';
const argv = process.argv.slice(2);
const opt = (f, d = null) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : d; };
const [FROM, TO] = argv.filter((a, i) => (a === '--index' || !a.startsWith('--')) && (i === 0 || argv[i - 1] !== '--repo'));
const REPO = path.resolve(opt('--repo', '.'));
const git = (...a) => execFileSync('git', ['-C', REPO, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
const show = (ref, p) => { try { return ref === '--index' ? git('show', `:${p}`) : git('show', `${ref}:${p}`); } catch { return null; } };
const norm = (s) => (s || '').replace(/\s+/g, ' ').trim();
const skipOk = (a, b) => b === a || b === '' || (a !== '' && b.startsWith(a + ' &&'));   // צמצום = צירוף-AND על ה-skip הקודם
export const tuples = (src) => Object.fromEntries([...(src || '').matchAll(/^\s*gate(?:Dirty)?\(\s*'([^']+)'\s*,\s*'([^']+)'(?:\s*,\s*(\[[^\]]*\]))?(?:\s*,\s*([^)]+))?\)/gm)].map((m) => [m[1], { script: m[2], args: norm(m[3] || '[]'), skip: norm(m[4] || '') }]));
export const manifest = (src) => { const m = {}; for (const l of (src || '').split('\n')) { if (!l || l.startsWith('#')) continue; const p = l.split('\t'); const b = (p[3] || '').match(/^(?:baseline=)?([^;]+);(?:dir=)?(shrink|grow)$/); m[p[0]] = b ? { file: 'machtzev/' + b[1], dir: b[2] } : null; } return m; };
const isObj = (x) => x && typeof x === 'object' && !Array.isArray(x);
const key = (x) => (typeof x === 'string' ? x : JSON.stringify(x));
/** רקורסיה: מחזיר רשימת-הפרות; shrink = B לא גדל מ-A · grow = B לא קטן מ-A */
export function weaken(A, B, dir, p = '') {
  const out = [];
  if (isObj(A) && isObj(B)) {
    for (const k of Object.keys(A)) { if (!(k in B)) { if (dir === 'grow') out.push(`${p}${k} הוסר`); continue; } out.push(...weaken(A[k], B[k], dir, `${p}${k}.`)); }
    for (const k of Object.keys(B)) if (!(k in A) && dir === 'shrink') out.push(`${p}${k} נוסף`);
  } else if (Array.isArray(A) && Array.isArray(B)) {
    const sa = new Set(A.map(key)), sb = new Set(B.map(key));
    if (dir === 'shrink') { const g = [...sb].filter((x) => !sa.has(x)); if (g.length) out.push(`${p || 'רשימה'} +${g.length} (${g.slice(0, 3).join(', ').slice(0, 120)})`); }
    else { const s = [...sa].filter((x) => !sb.has(x)); if (s.length) out.push(`${p || 'רשימה'} −${s.length} (${s.slice(0, 3).join(', ').slice(0, 120)})`); }
  } else if (typeof A === 'number' && typeof B === 'number') {
    if (dir === 'shrink' && B > A) out.push(`${p.replace(/\.$/, '')}: ${A} → ${B} (עלה)`);
    if (dir === 'grow' && B < A) out.push(`${p.replace(/\.$/, '')}: ${A} → ${B}`);
  } else if (typeof A !== typeof B || Array.isArray(A) !== Array.isArray(B)) out.push(`${p || 'שורש'} שינה-צורה`);
  return out;
}
export function compare(showFn, from, to) {
  const a = tuples(showFn(from, 'machtzev/police.mjs')), b = tuples(showFn(to, 'machtzev/police.mjs'));
  const ma = manifest(showFn(from, 'machtzev/gates.tsv')), mb = manifest(showFn(to, 'machtzev/gates.tsv'));
  const issues = [];
  for (const id of Object.keys(a)) {
    if (!b[id]) { issues.push(`שער נמחק מ-police.mjs: ${id}`); continue; }
    if (b[id].script !== a[id].script) issues.push(`סקריפט הוחלף: ${id} ${a[id].script} → ${b[id].script}`);
    if (!skipOk(a[id].skip, b[id].skip)) issues.push(`skip חדש: ${id}=${b[id].skip || '(ריק)'} (היה ${a[id].skip || 'ריק'})`);
    if (b[id].args !== a[id].args) issues.push(`ארגומנטים השתנו: ${id} ${a[id].args} → ${b[id].args}`);
  }
  for (const id of Object.keys(ma)) {
    if (!(id in mb)) { issues.push(`רשומת-מרשם נמחקה: ${id}`); continue; }
    if (ma[id] && !mb[id]) issues.push(`מניפסט-baseline הוסר: ${id} (${ma[id].file};${ma[id].dir})`);
    else if (ma[id] && mb[id] && (ma[id].file !== mb[id].file || ma[id].dir !== mb[id].dir)) issues.push(`מניפסט-baseline השתנה: ${id} ${ma[id].file};${ma[id].dir} → ${mb[id].file};${mb[id].dir}`);
  }
  for (const id of Object.keys(mb)) {
    const bl = mb[id]; if (!bl) continue;
    const before = showFn(from, bl.file), after = showFn(to, bl.file);
    if (before === null) continue;                                   // baseline חדש — אין עבר להשוות
    if (after === null) { issues.push(`baseline נמחק (${bl.file})`); continue; }
    if (before === after) continue;
    let A, B; try { A = JSON.parse(before); B = JSON.parse(after); } catch { issues.push(`baseline לא-JSON: ${bl.file}`); continue; }
    const w = weaken(A, B, bl.dir);
    if (w.length) issues.push(...(bl.dir === 'shrink' ? [`baseline גדל (${bl.file}): ${w.slice(0, 4).join(' · ')}`] : w.map((x) => `ראצ׳ט ירד (${bl.file}.${x})`)));
  }
  return { issues, gates: Object.keys(b).length, baselines: Object.values(mb).filter(Boolean).length };
}
if (import.meta.url === `file://${process.argv[1]}`) {
  if (!FROM || !TO) { console.error('usage: ratchet-direction.mjs <from> <to|--index> [--repo dir]'); process.exit(2); }
  const r = compare(show, FROM, TO);
  if (r.issues.length) { console.error('🚨 ראצ׳ט-כיוון: החלשה ' + FROM.slice(0, 8) + ' → ' + (TO === '--index' ? 'index' : TO.slice(0, 8)) + ':'); r.issues.forEach((x) => console.error('   · ' + x)); process.exit(1); }
  console.log(`✓ ראצ׳ט-כיוון: אין החלשה (${r.gates} שערים · ${r.baselines} baselines)`);
}
