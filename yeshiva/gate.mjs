#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════
//  yeshiva/gate.mjs — השער הישיבתי במשטרה (הכרעה-27 · "תחבר כבר את הכל").
//  ────────────────────────────────────────────────────────────────────────
//  מה הוא אוכף — שלושה דברים, כולם מדידים:
//   1) **טריות:** הפסק שבדיסק (yeshiva/psak/ · yeshiva/out/) ≡ ריצה טרייה.
//      פסק ישן בדיסק = ירוק-חלול (L27); דריפט ⇒ אדום + שחזור-מדויק (עץ-נח · L14).
//   2) **רצפת-ההכרעה:** המנוע פוסק לבד **רק-עולה**, מתגים **רק-יורדים**.
//   3) **אנטי-משחק:** הכיסוי (פירוקים · ממצאים) רק-עולה — אסור להוריד מתגים
//      ע"י צמצום-הנמדד.
//   4) **מסלול-המטרה (purpose.mjs):** משפט-חופשי ⇒ מסמך-מטרה ⇒ אותם שבעה מהלכים.
//      זה ה-B שחסר למשפט-חופשי: לא מסמך-בעלים אלא **מה שהמטרה דורשת**, נגזר
//      משרשרת-המקור (חבילות-ורטיקל ⇒ סכמה) עם ראיה. שדות-עם-מקור רק-עולה.
//   5) **הוכחת-ירי שהישיבתי באמת פוסק** (‏`rule` — הוא בנתיב-הבנייה של app-ds,
//      לא רק במדידה). מונה-ממצאים אינו מדד-עומק: 151 «ייתור» על מפתחות-סכמה
//      באנגלית היו ממצאי-שווא שיישומם מייצר 25 עמודות בשם «שדה». לכן הרצפה
//      כאן היא **התנהגות**: מתקן מה שיש עליו ראיה · משמיט כותרת · **לא מכריע**
//      בתאומים · ולעולם לא מכניס שם-לא-עברי לספק.
//  fail-closed (L27): 0 פירוקים / 0 ממצאים = הכלי שבור, לא הנתונים ⇒ exit 2.
//  שימוש: node yeshiva/gate.mjs [--gate]
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BASE = JSON.parse(fs.readFileSync(path.join(HERE, 'yeshiva-baseline.json'), 'utf8'));
const DIRS = ['psak', 'out'].map((d) => path.join(HERE, d));

const snap = (d) => { try { return Object.fromEntries(fs.readdirSync(d).map((f) => [f, fs.readFileSync(path.join(d, f), 'utf8')])); } catch { return {}; } };
const restore = (d, s) => { try { for (const f of fs.readdirSync(d)) if (!(f in s)) fs.unlinkSync(path.join(d, f)); } catch {} for (const [f, c] of Object.entries(s)) { try { fs.writeFileSync(path.join(d, f), c); } catch {} } };
const drift = (d, s) => { const now = snap(d); const out = []; for (const f of new Set([...Object.keys(s), ...Object.keys(now)])) if (s[f] !== now[f]) out.push(path.basename(d) + '/' + f); return out; };

const run = (script, args) => spawnSync(process.execPath, [path.join(HERE, script), ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

const before = DIRS.map(snap);
const rd = run('read.mjs', ['--all']);
const ap = run('apply.mjs', ['--all', '--json']);
if (rd.status !== 0 || ap.status !== 0) {
  console.error(`🛠️ yeshiva: read=${rd.status} apply=${ap.status} — הכלי שבור, לא הנתונים (fail-closed)`);
  DIRS.forEach((d, i) => restore(d, before[i]));
  process.exit(2);
}

let J; try { J = JSON.parse(String(ap.stdout).trim().split('\n').pop()); } catch { J = null; }
const per = (J && J.per || []).filter((x) => !x.skipped);
const perukim = per.length;
const findings = per.reduce((a, x) => a + (x.findings || 0), 0);
const decided = per.reduce((a, x) => a + (x.decided || 0), 0);
const switches = per.reduce((a, x) => a + (x.switches || 0), 0);
if (!perukim || !findings) {
  console.error(`🛠️ yeshiva: ${perukim} פירוקים · ${findings} ממצאים — הכלי שבור, לא הנתונים (fail-closed)`);
  DIRS.forEach((d, i) => restore(d, before[i]));
  process.exit(2);
}

// ── מסלול-המטרה: הגשר חי ונמדד (קוד לא-נבדק = קוד מת · §21) ──────────────
let P = { sentences: 0, sourced: 0, findings: 0, open: 0 };
try {
  const { purposeDoc } = await import(path.join(HERE, 'purpose.mjs'));
  const { check, parseSpec } = await import(path.join(HERE, 'read.mjs'));
  const { specFromSentence } = await import(path.join(HERE, '../machtzev/generator/tzinor.mjs'));
  const { nlToSpec } = await import(path.join(HERE, '../machtzev/generator/nl-spec.mjs'));
  const corpus = fs.readFileSync(path.join(HERE, '../machtzev/generator/nl-smoke.txt'), 'utf8')
    .split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  for (const sent of corpus) {
    let sp = ''; try { const t = specFromSentence(sent); if (t.spec.trim()) sp = t.spec; } catch { sp = ''; }
    if (!sp.trim()) sp = nlToSpec(sent);
    const doc = purposeDoc(sent);
    P.sentences++; P.sourced += doc.sources.size; P.open += doc.open.length;
    P.findings += check(doc, parseSpec(sp)).length;
  }
} catch (e) {
  console.error(`🛠️ yeshiva: מסלול-המטרה נשבר — ${e.message} (fail-closed)`);
  DIRS.forEach((d, i) => restore(d, before[i]));
  process.exit(2);
}
if (!P.sentences || !P.sourced) {
  console.error(`🛠️ yeshiva: מסלול-המטרה ${P.sentences} משפטים · ${P.sourced} שדות-עם-מקור — הכלי שבור (fail-closed)`);
  DIRS.forEach((d, i) => restore(d, before[i]));
  process.exit(2);
}

const fails = [];
const stale = DIRS.flatMap((d, i) => drift(d, before[i]));
if (stale.length) fails.push(`${stale.length} קבצי-פסק אינם טריים: ${stale.slice(0, 6).join(' · ')}${stale.length > 6 ? ' …' : ''} (הרץ read.mjs/apply.mjs ו-commit)`);
DIRS.forEach((d, i) => restore(d, before[i]));   // עץ-נח תמיד (L14)

if (decided < BASE.decided) fails.push(`${decided} פסק-לבד < רצפה ${BASE.decided} (הכרעה רק-עולה)`);
if (switches > BASE.switches) fails.push(`${switches} מתגים > רצפה ${BASE.switches} (מתגים רק-יורדים)`);
if (perukim < BASE.perukim) fails.push(`${perukim} פירוקים < רצפה ${BASE.perukim} (כיסוי רק-עולה)`);
if (findings < BASE.findings) fails.push(`${findings} ממצאים < רצפה ${BASE.findings} (כיסוי רק-עולה)`);
const BP = BASE.purpose || {};
if (P.sentences < (BP.sentences || 0)) fails.push(`מסלול-המטרה: ${P.sentences} משפטים < רצפה ${BP.sentences} (כיסוי רק-עולה)`);
if (P.sourced < (BP.sourced || 0)) fails.push(`מסלול-המטרה: ${P.sourced} שדות-עם-מקור < רצפה ${BP.sourced} (מקורות רק-עולים)`);
if (P.open < (BP.open || 0)) fails.push(`מסלול-המטרה: ${P.open} מתגים-עם-מקור < רצפה ${BP.open} (שקעים-ידועים רק-עולים)`);
// ── הוכחת-ירי: הישיבתי **פוסק**, לא רק מודד ─────────────────────────────
const T = [];
try {
  const { rule } = await import(path.join(HERE, 'purpose.mjs'));
  const ok = (name, cond) => T.push({ name, pass: !!cond });
  const r1 = rule('מערכת עם תיקים', 'ישות תיק עם תיק\nתוכן כרטיס: נדחה כי Y');
  ok('מאי X: מציין-מקום מהדוגמה ⇒ {שדה}', r1.changed === 1 && /\{שדה\}/.test(r1.spec) && !/נדחה כי Y/.test(r1.spec));
  const r2 = rule('מערכת עם תיקים', 'ישות תיק עם תיק\nתוכן בדיקה: מה צריך:');
  ok('אין מערבין: כותרת-דוגמה מושמטת', r2.changed === 1 && !/מה צריך/.test(r2.spec));
  const r3 = rule('מערכת עם תיקים', 'ישות תיק עם שם הלקוח, שם לקוח');
  ok('ורמינהו תאומים: **לא** מכריע לבד ⇒ מתג', r3.decided === 0 && r3.switches.length >= 1 && r3.spec.includes('שם הלקוח') && r3.spec.includes('שם לקוח'));
  const HE = /[\u05d0-\u05ea]/;
  let alien = 0;
  for (const sent of ['מערכת לניהול מרפאה עם מטופלים, תורים ורופאים', 'מערכת לחללית עם טייסים', 'ניהול מלון: חדרים, אורחים']) {
    const { specFromSentence } = await import(path.join(HERE, '../machtzev/generator/tzinor.mjs'));
    const out = rule(sent, specFromSentence(sent).spec).spec;
    for (const l of out.split(/\r?\n/)) { const m = l.match(/^ישות \S+ עם (.+?)(?: \| |$)/); if (!m) continue; for (const f of m[1].split(',')) if (f.trim() && !HE.test(f)) alien++; }
  }
  ok('אפס שם-לא-עברי בספק שיצא מהפסק', alien === 0);
} catch (e) { T.push({ name: 'הוכחת-ירי נטענה', pass: false, why: e.message }); }
for (const t of T) console.log(`  ${t.pass ? '✓' : '🚨'} ${t.name}${t.why ? ' — ' + t.why : ''}`);
const shot = T.filter((t) => !t.pass);
if (shot.length) fails.push(`הוכחת-ירי: ${shot.length}/${T.length} כשלו — הישיבתי אינו פוסק כמוצהר`);
if (T.length < 4) fails.push(`הוכחת-ירי: ${T.length} בדיקות < 4 (השער התרוקן)`);

console.log(`  ${perukim} פירוקים · ${findings} ממצאים · ${decided} פסק המנוע לבד · ${switches} מתגים (רצפה ${BASE.decided}/${BASE.switches})`);
console.log(`  מסלול-המטרה: ${P.sentences} משפטים · ${P.sourced} שקעים-עם-מקור · ${P.open} מתגים · ${P.findings} ממצאים`);
if (fails.length) { for (const m of fails) console.error('🚨 yeshiva: ' + m); process.exit(1); }
const up = decided - BASE.decided, down = BASE.switches - switches;
console.log(`✅ yeshiva: הפסק טרי · ${decided}/${findings} הכריע המנוע לבד${up ? ` ⬆ ${up}` : ''}${down ? ` · מתגים ⬇ ${down} — עדכן את המניפסט` : ''}`);
