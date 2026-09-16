#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════
//  hamtzaa.mjs — גלאי-ההמצאה (שער-המחצבה · L57 · CLOSED-GENMAX-G5f «אין המצאה»).
//  ────────────────────────────────────────────────────────────────────────
//  החוק שהוא אוכף: **כל שדה בספק חייב מקור בקלט. אין מקור = המצאה = אדום.**
//  הקלט = המסמך/המשפט של הבעלים. הספק = `ישות X עם שדה, שדה*, שדה{א|ב}`.
//  שני המסלולים (peruk.mjs · nl-spec.mjs) פולטים את אותו הפורמט — ולכן בדיקה
//  אחת תופסת את שניהם. המנוע לא יודע מה "נכון" לישות; הוא רק שואל
//  "האם המילה הזאת נאמרה?" — בדיוק כמו L57: מה שאין לו מקור אינו ניחוש, הוא ∅.
//
//  ⚙️ מנגנון-עיוור (§19-ד · L57 ANTIPATTERN): אפס מילה-עברית בקוד הזה. כל ידע-
//  השפה מוזרק מאטומי-הדאטה הקיימים — `nl-lang.data.json` (מילות-פיגום: leadins ·
//  fieldMarks · listConj) ו-`spec-lang.data.json` (prefixLetters · אוצר-הדקדוק).
//  פירוק-הספק אינו נכתב פה מחדש: משתמשים ב-`entity.interpret` — **הצרכן האמיתי**
//  של הספק — כדי שהשער ימדוד את השדות שבאמת מגיעים לאפליקציה, לא פרסר-משנֶה (L1).
//
//  🔒 fail-closed: אם לא פורסר **אף שדה** (או לא נקראה אף מילת-קלט) — exit 2 עם
//  «הכלי שבור, לא הנתונים». לעולם לא לדווח 0-המצאות על כלי שלא רץ (ירוק-חלול · L27).
//
//  שימוש:
//    node hamtzaa.mjs --peruks            # מסלול-הפירוקים: peruks/*.md מול specs-ds/perukNN.txt
//    node hamtzaa.mjs --nl                # מסלול-המשפט-החופשי: nl-smoke.txt ⇒ nlToSpec
//    node hamtzaa.mjs --peruk 7           # זוג-בודד
//    node hamtzaa.mjs --gate              # שני המסלולים · ספירה · exit 1 אם יש המצאות
//    node hamtzaa.mjs --file <in> <spec>  # זוג-חופשי מהדיסק
//    (‏--list מפרט כל שדה-מומצא · --json פלט-מכונה)
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { interpret } from './entity.mjs';
import { nlToSpec } from './nl-spec.mjs';
import * as R from '../root.mjs';

const GEN = R.GEN_DIR;
// 📦 ידע-השפה — מאטומי-הדאטה הקיימים בלבד (§19-ד). אין פה טבלת-מילים.
const NLL = JSON.parse(fs.readFileSync(GEN + 'nl-lang.data.json', 'utf8'));
const SPL = JSON.parse(fs.readFileSync(GEN + 'spec-lang.data.json', 'utf8'));

const MIN_PFX = 3;   // תחילית קצרה מ-3 אינה ראיה — הייתה מאשרת כל שדה

/** ידע-השפה כולו מהאטומים — אפס טבלת-מילים בקוד (§19-ד · L57 ANTIPATTERN).
 *  ניתן להזרקה כדי שאפשר יהיה **להוכיח** שהוא מהדאטה (ראה --selftest). */
export function langFrom(nll = NLL, spl = SPL) {
  return {
    scaffold: new Set([
      ...(nll.leadins || []), ...(nll.fieldMarks || []), ...(nll.listConj || []),
      ...(nll.eachWords || []), spl.withWord, spl.fieldsWord, spl.fallbackField, spl.fallbackEntity,
    ].filter(Boolean)),
    prefixLetters: spl.prefixLetters || '',
    entityNouns: spl.entityNouns || [],
    createVerbs: spl.createVerbs || [],
  };
}
const LANG = langFrom();

// מילות-עברית (אות-עברית + גרשיים פנימיים), באורך 2+ — משני הצדדים באותה מידה.
const heWords = (s) => [...String(s || '').matchAll(/[א-ת][א-ת'"״׳]*/g)]
  .map((m) => m[0]).filter((w) => w.length >= 2);

// ── ליבה: האם למילת-שדה יש מקור בקלט? זהה / אות-שימוש / תחילית (משני הכיוונים) ──
const pfxHit = (a, b) => {
  const [s, l] = a.length <= b.length ? [a, b] : [b, a];
  return s.length >= MIN_PFX && l.startsWith(s);
};
function sourceOf(fieldWord, inputWords, deprefix) {
  const fv = [fieldWord, deprefix(fieldWord)];
  for (const u of inputWords) {
    const uv = [u, deprefix(u)];
    for (const f of fv) for (const x of uv) if (x === f || pfxHit(x, f)) return u;
  }
  return null;
}

/** גרעין-השער · טהור: (קלט, ספק) ⇒ כל שדה עם/בלי מקור.
 *  spec = טקסט-הספק כמו-שהוא (שורות `ישות … עם …`); input = טקסט-המקור. */
export function detectInvented(inputText, specText, lang = LANG) {
  const deprefix = (w) => (w.length > MIN_PFX ? w.replace(new RegExp('^[' + lang.prefixLetters + ']'), '') : w);
  const contentWords = (ws) => ws.filter((w) => !lang.scaffold.has(w));
  const inputWords = [...new Set(contentWords(heWords(inputText)))];
  // רק שורות-ישות. interpret הוא הצרכן האמיתי — מה שהוא לא מוציא, לא מגיע לאפליקציה.
  const entRe = new RegExp('^\\s*(?:' + lang.createVerbs.join('|') + ')?\\s*(?:' + lang.entityNouns.join('|') + ')\\s+');
  const rows = [];
  for (const line of String(specText || '').split(/\r?\n/)) {
    const t = line.trim();
    if (!t || !entRe.test(t)) continue;
    let r; try { r = interpret(t); } catch { continue; }
    for (const s of (r.schema || [])) {
      let fw = contentWords(heWords(s.label));
      if (!fw.length) fw = heWords(s.label);   // שדה שכולו-פיגום: בודקים אותו כמו-שהוא, לא פוטרים
      if (!fw.length) continue;                // אין מילה-עברית כלל ⇒ לא שדה-עברית
      let src = null;
      for (const w of fw) { src = sourceOf(w, inputWords, deprefix); if (src) break; }
      rows.push({ entity: r.entity, field: s.label, source: src });
    }
  }
  // ספירת-ישויות: כמה ישויות **כל** שדותיהן בלי-מקור (הסימן של הזרקת-ברירת-מחדל)
  const byEnt = new Map();
  for (const r of rows) { const a = byEnt.get(r.entity) || []; a.push(r); byEnt.set(r.entity, a); }
  const entsAllInvented = [...byEnt].filter(([, a]) => a.every((x) => !x.source)).map(([e]) => e);
  return {
    inputWords: inputWords.length, fields: rows.length, rows,
    invented: rows.filter((x) => !x.source), entities: byEnt.size, entsAllInvented,
  };
}

// ── אוספי-המסלולים ───────────────────────────────────────────────────────
const readIf = (f) => (fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null);

/** מסלול-הפירוקים: peruks/peruk-NN.md (קלט) מול specs-ds/perukNN.txt (ספק). */
export function routePeruks() {
  const dir = GEN + 'peruks';
  const pairs = [];
  if (!fs.existsSync(dir)) return { route: 'peruk', pairs, fields: 0, invented: [], inputWords: 0 };
  for (const f of fs.readdirSync(dir).filter((x) => /\.md$/.test(x)).sort()) {
    const m = f.match(/(\d+)/); if (!m) continue;
    const spec = readIf(path.join(GEN, 'specs-ds', 'peruk' + m[1] + '.txt'));
    if (spec == null) continue;
    pairs.push({ id: f.replace(/\.md$/, ''), input: readIf(path.join(dir, f)), spec });
  }
  return collect('peruk', pairs);
}

/** מסלול-המשפט-החופשי: כל שורה ב-nl-smoke.txt (קלט) ⇒ nlToSpec (ספק). */
export function routeNl() {
  const src = readIf(GEN + 'nl-smoke.txt');
  const pairs = [];
  for (const line of String(src || '').split(/\r?\n/)) {
    const t = line.trim(); if (!t || t.startsWith('#')) continue;
    pairs.push({ id: t.slice(0, 40), input: t, spec: nlToSpec(t) });
  }
  return collect('nl', pairs);
}

function collect(route, pairs) {
  let fields = 0, inputWords = 0, entities = 0, entsAllInvented = 0;
  const invented = []; const per = []; const broken = [];
  for (const p of pairs) {
    const r = detectInvented(p.input, p.spec);
    fields += r.fields; inputWords += r.inputWords;
    entities += r.entities; entsAllInvented += r.entsAllInvented.length;
    // 🔒 fail-closed **פר-זוג**: זוג שלא הניב שדה או שלא נקראה בו מילת-קלט לא מדולג
    // בשקט — אחרת מסמך-שבור-אחד מוריד את הספירה והשער מדווח ירוק-חלול (L27).
    if (!r.fields || !r.inputWords) broken.push({ id: p.id, fields: r.fields, inputWords: r.inputWords });
    for (const x of r.invented) invented.push({ ...x, pair: p.id });
    per.push({ id: p.id, fields: r.fields, invented: r.invented.length });
  }
  return { route, pairs: pairs.length, fields, inputWords, entities, entsAllInvented, invented, per, broken };
}

// ── דיווח ────────────────────────────────────────────────────────────────
const pct = (a, b) => (b ? Math.round((a / b) * 1000) / 10 : 0);
function report(r, list) {
  console.log(`${r.route}: ${r.pairs} זוגות · ${r.entities} ישויות · ${r.fields} שדות · `
    + `${r.invented.length} שדות בלי-מקור (${pct(r.invented.length, r.fields)}%) · `
    + `${r.entsAllInvented}/${r.entities} ישויות כולן-בלי-מקור (${pct(r.entsAllInvented, r.entities)}%)`);
  if (list) for (const x of r.invented) console.log(`   ✗ ${x.pair} · ${x.entity} · ${x.field}`);
  return r;
}
// 🔒 fail-closed (L27): 0 זוגות / 0 שדות / 0 מילות-קלט — בסך-הכל **או בזוג בודד** —
// = הכלי שבור, לא הנתונים. exit 2, לעולם לא "0 המצאות".
function assertRan(rs) {
  const f = rs.reduce((a, r) => a + r.fields, 0);
  const w = rs.reduce((a, r) => a + r.inputWords, 0);
  const p = rs.reduce((a, r) => a + r.pairs, 0);
  const broken = rs.flatMap((r) => (r.broken || []).map((b) => `${r.route}/${b.id} (${b.fields} fields · ${b.inputWords} words)`));
  if (p && f && w && !broken.length) return;
  console.error(`🛠️ hamtzaa: ${p} pairs · ${f} fields · ${w} input-words — הכלי שבור, לא הנתונים (fail-closed)`);
  for (const b of broken.slice(0, 10)) console.error(`   🛠️ ${b}`);
  if (broken.length > 10) console.error(`   🛠️ +${broken.length - 10}`);
  process.exit(2);
}

// ── הוכחת-ירי (selftest): כל כלל יורה על fixture מורעל + ביקורת-שלילית ──────
// מבודד מהדיסק: הזוגות כתובים פה. מוכיח שהשער תופס המצאה, **ולא** מאשים שדה שנאמר.
function selftest() {
  const T = [];
  const ok = (name, cond) => { T.push({ name, pass: !!cond }); };
  const inv = (i, s) => detectInvented(i, s).invented.map((x) => x.field);

  // ביקורת-שלילית: שדה שנאמר מילולית — אסור שיואשם
  ok('זהה: שדה שנאמר ⇒ אין המצאה', inv('תיק עם לקוח וטלפון', 'ישות תיק עם לקוח, טלפון').length === 0);
  // אות-שימוש: "וטלפון" בקלט ⇒ "טלפון" בספק נחשב מקור
  ok('אות-שימוש ⇒ מקור', inv('צריך תיק וטלפון', 'ישות תיק עם טלפון').length === 0);
  // תחילית: "לקוחות" בקלט ⇒ "לקוח" בספק נחשב מקור
  ok('תחילית ⇒ מקור', inv('רשימת לקוחות', 'ישות רשימה עם לקוח').length === 0);
  // 🎯 ההרעלה: שדה שלא נאמר ⇒ חייב להיתפס
  ok('המצאה נתפסת', inv('תיק עם לקוח בלבד', 'ישות תיק עם לקוח, טלפון').join() === 'טלפון');
  // 🎯 הרעלת-ברירת-מחדל (מסלול-המשפט): ארבעת שדות-הליבה שאיש לא ביקש
  ok('ברירות-מחדל מוזרקות נתפסות', inv('ניהול מלון עם חדרים', 'ישות חדרים עם שם, תיאור, תאריך, סטטוס').length === 4);
  // תווית-enum מומצאת גם כשהערכים נאמרו (צבע{אדום|צהוב|ירוק})
  ok('תווית-enum מומצאת נתפסת', inv('סמן אדום או צהוב', 'ישות ממצא עם צבע{אדום|צהוב}').join() === 'צבע');
  // fail-closed: ספק בלי שורת-ישות = 0 שדות (הקורא חייב לצאת 2, לא לדווח 0)
  ok('fail-closed: 0 שדות מסומן', detectInvented('יש כאן טקסט', 'שורה בלי ישות').fields === 0);
  ok('fail-closed: 0 מילות-קלט מסומן', detectInvented('', 'ישות תיק עם לקוח').inputWords === 0);
  // 🔬 הוכחת-עיוורון (§19-ד · L57): ידע-השפה בדאטה, לא בקוד — מוכח במוטציה.
  // מרוקנים את `prefixLetters` באטום ⇒ אות-השימוש מפסיקה להתאים ⇒ הפסק-דין משתנה.
  // אם הפסק-דין **לא** משתנה, סימן שהאות קשיחה בקוד ⇒ ההוכחה נכשלת.
  const noPfx = langFrom(NLL, { ...SPL, prefixLetters: '' });
  ok('עיוורון: prefixLetters מהדאטה (מוטציה משנה פסק-דין)',
    detectInvented('צריך תיק וטלפון', 'ישות תיק עם טלפון', noPfx).invented.length === 1);
  // מרוקנים את מילות-הפיגום ⇒ מילת-פיגום בקלט הופכת ל"מקור" ⇒ הפסק-דין משתנה.
  const noScaf = langFrom({ ...NLL, leadins: [], fieldMarks: [], listConj: [], eachWords: [] }, SPL);
  ok('עיוורון: מילות-הפיגום מהדאטה (מוטציה משנה פסק-דין)',
    detectInvented('רשימה של דברים', 'ישות פריט עם רשימה').invented.length === 1
    && detectInvented('רשימה של דברים', 'ישות פריט עם רשימה', noScaf).invented.length === 0);

  const bad = T.filter((t) => !t.pass);
  for (const t of T) console.log(`${t.pass ? '✅' : '🚨'} ${t.name}`);
  console.log(`selftest: ${T.length - bad.length}/${T.length}`);
  process.exit(bad.length ? 1 : 0);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const A = process.argv.slice(2);
  const has = (f) => A.includes(f);
  const list = has('--list'), json = has('--json');
  if (has('--selftest')) selftest();
  let rs = [];
  if (has('--file')) {
    const i = A.indexOf('--file');
    const inp = readIf(A[i + 1]), spec = readIf(A[i + 2]);
    if (inp == null || spec == null) { console.error('🛠️ hamtzaa: --file <input> <spec> — קובץ חסר (fail-closed)'); process.exit(2); }
    rs = [collect('file', [{ id: path.basename(A[i + 1]), input: inp, spec }])];
  } else if (has('--peruk')) {
    const n = String(A[A.indexOf('--peruk') + 1] || '').padStart(2, '0');
    const inp = readIf(GEN + `peruks/peruk-${n}.md`), spec = readIf(GEN + `specs-ds/peruk${n}.txt`);
    if (inp == null || spec == null) { console.error(`🛠️ hamtzaa: peruk ${n} — זוג חסר (fail-closed)`); process.exit(2); }
    rs = [collect('peruk' + n, [{ id: 'peruk-' + n, input: inp, spec }])];
  } else if (has('--peruks')) rs = [routePeruks()];
  else if (has('--nl')) rs = [routeNl()];
  else if (has('--gate') || !A.length) rs = [routePeruks(), routeNl()];
  else { console.log('usage: node hamtzaa.mjs [--gate|--peruks|--nl|--peruk N|--file <in> <spec>] [--list] [--json]'); process.exit(0); }

  assertRan(rs);
  if (json) console.log(JSON.stringify(rs, null, 2));
  else rs.forEach((r) => report(r, list || !has('--gate')));
  const bad = rs.reduce((a, r) => a + r.invented.length, 0);
  const all = rs.reduce((a, r) => a + r.fields, 0);
  if (has('--gate')) {
    if (bad) { console.error(`🚨 hamtzaa: ${bad}/${all} שדות בלי מקור בקלט — המצאה (L57 · אין המצאה)`); process.exit(1); }
    console.log(`✅ hamtzaa: ${all}/${all} שדות עם מקור בקלט`);
  }
}
