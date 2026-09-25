#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════
//  purpose.mjs — הגשר: **חיפוש-לפי-מטרה ⇒ מסמך שהישיבתי יודע לקרוא**.
//  ────────────────────────────────────────────────────────────────────────
//  הבעיה שזה פותר: הישיבתי עובד בשיטת «השווה A ל-B» — הספק מול מסמך-הבעלים.
//  במשפט-חופשי אין מסמך, ולכן הוא לא רץ שם בכלל — וזה בדיוק המסלול שבו
//  המחולל ממציא הכי הרבה. ה-B החסר הוא **המטרה**: אילו שדות נדרשים כדי
//  להגשים את מה שנאמר, נגזר משרשרת-המקור (חבילות-ורטיקל ⇒ סכמה), עם ראיה.
//
//  ⚙️ לפי **צורה**, לא לפי מילים (L107): המקור הוא `tzinor.toSwitches` —
//  מילה ⇒ מועמדי-סכמה עם `fields[].src`. חיפוש-לפי-מילים (`match.retrieve`)
//  נמדד ונפסל: «תורים» ⇒ DotsLoader («נקודות קופצות בתור») — אותה מחלקת-
//  תקלה של התאמה-מקרית שהמנוע נועד למנוע.
//
//  🔒 אפס-המצאה: שדה בלי `src` לא נכנס למסמך. מילה בלי מועמד-סכמה ⇒ ∅
//  מדווח, לא ניחוש (L57). ישות עם כמה מועמדים ⇒ **לא מכריעים** — זה מתג.
//
//  שימוש: node yeshiva/purpose.mjs "<משפט חופשי>"
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { toSwitches, soleClassOf, slotSources } from '../machtzev/generator/tzinor.mjs';
import { stem } from '../machtzev/generator/match.mjs';
import { check, parseSpec, STOP } from './read.mjs';
import { pasak, applyPsak } from './apply.mjs';
import { rminhu, had, pliga, lo } from './rminhu.mjs';
import { askMaimatai, kasheQuestions, askFor } from './kashe.mjs';   // 🕯️ המקשה (חוט-1): דיווח מגודר KASHE_WIRE + שאלה על המתג (§20-ג)   // 🕯️ ∅ הוא «אין» — ופסק עליו נרשם בפנקס (הכרעה-23 · L114)

const HE_RE = /[\u05d0-\u05ea]/;   // שם-שדה בלי אות-עברית = מפתח-סכמה, לא מונח
const norm = (s) => String(s).replace(/[״"'׳]/g, '').replace(/\s+/g, ' ').trim();

/** מועמד-אמת יחיד: יש מחלקה · יש שדות · לא רופף. אין יחיד ⇒ null (מתג, לא הכרעה). */
const soleOption = (e) => {
  const real = (e.options || []).filter((o) => o.cls && (o.fields || []).length && o.strict !== false);
  return real.length === 1 ? real[0] : null;
};

// ══ שכבת-המטרה (הכרעה-20 «אין-יחיד ⇒ שלב» · הבעלים 17.9 «קודם ישיבה מלאה») ══
//  הפער שנמדד לפני: על מטרה עם **פעולות** («כל בוקר לדעת … ולשלוח …») החזיר
//  הפסק 0 שקעי-חובה · 0 מקורות · 3 מתגים — כי `toSwitches` מחפש **ישות עם שדות**,
//  ומטרה אינה ישות. מטרה היא **תביעות**: פועל + מה שהוא דורש. השכבה כאן מפרקת
//  אותה למה שצריך כדי להגשים אותה — ישויות · שדות · קבועים — וכל דרישה נושאת
//  את מקורה או ∅. אפס מילון-דומייני: כל מילת-עברית מגיעה מאטומי-הדאטה הקיימים
//  (`nl-lang.data.json` · `spec-lang.data.json`), וההתאמה היא `stem` של המדף.
const GENU = (f) => new URL('../machtzev/generator/' + f, import.meta.url);
const SPL = JSON.parse(fs.readFileSync(GENU('spec-lang.data.json'), 'utf8'));
const NLL = JSON.parse(fs.readFileSync(GENU('nl-lang.data.json'), 'utf8'));
export const GOAL_SRC = { spl: 'machtzev/generator/spec-lang.data.json', nll: 'machtzev/generator/nl-lang.data.json' };

// פיגום-השפה — מהאטומים בלבד (§19-ד). מילת-פיגום אינה דרישה ואינה פועל-מטרה.
//  ‏STOP הוא לקסיקון-הצורה שכבר קיים בקורא (read.mjs:19) — מילות-דקדוק, לא דומיין.
//  מילות-ההשוואה (`amountAbove`/`amountBelow`/`rangeWords`) הן **מבנה** (סף), לא שדה:
//  בלעדיהן «מעל» נקשר ל-`typeNum("עלות")` דרך גזע משותף — מקור-שווא (נמדד).
const GRAM = [...(SPL.amountAbove || []), ...(SPL.amountBelow || []), ...(SPL.rangeWords || [])]
  .flatMap((x) => String(x).split(/[\s-]+/)).filter((x) => /^[\u05d0-\u05ea]{2,}$/.test(x));
const SCAF = new Set([...(NLL.leadins || []), ...(NLL.fieldMarks || []), ...(NLL.listConj || []),
  ...(NLL.eachWords || []), NLL.impliedMark, SPL.withWord, SPL.fieldsWord, SPL.fallbackField, SPL.fallbackEntity,
  ...STOP, ...GRAM].filter(Boolean));
// 🕯️ **שרשרת-המקור של שפת-האפיון** (w-verb-147 · 18.9 · PLAN-100 §3-שלב-1).
//  הפער שנמדד: `isGoalVerb` הוא מבחן-**צורה** (ל… באורך ≥4 אחרי קילוף אות-שימוש
//  אחת), וה«משמר היחיד שמונע שם-עצם» הוא שרשרת-המקור — אלא ששני אטומי-דאטה
//  שמצהירים מילות-דקדוק **לא נקראו כאן מעולם**: `knowledge/lexicon.json`
//  (מילת-חלק ⇒ תפקיד-צורני, 120 מילים) ומפתחות-הסימון של `spec-lang`
//  (‏sectionMarkers · stagePrefixes · markRules · markDelete · markGuards ·
//  entityNouns). התוצאה נמדדה: «שלבים» (‏ש∈prefixLetters ⇒ «לבים») נקרא כפועל-
//  מטרה ב-120 תביעות · 74 יחידות — מילה שמוצהרת **בשני** מקורות כסימן-מקטע.
//  כאן היא נכנסת לשרשרת, והמשמר הקיים עובד מעצמו: אפס כלל-מורפולוגיה חדש.
//  ‏**לא** מצורף ל-SCAF: SCAF מסנן גם את `contentW`, ושם המילים האלה כן דרישות
//  («תאריך» · «מספר» · «כתובת» הם רמזי-טיפוס אמיתיים). זהו משמר של פועל בלבד.
const LEX = JSON.parse(fs.readFileSync(GENU('knowledge/lexicon.json'), 'utf8'));
export const LEX_SRC = 'machtzev/generator/knowledge/lexicon.json';
const LEX_KEYS = Object.keys(LEX).filter((k) => !k.startsWith('_'));
//  ‏`MARK_KEYS` — מה שמצהיר **מקטע-התנהגות** בשפת-האפיון: שלבים · סטטוסים · מצבים ·
//  חוקים · ולידציה · מחיקה · מעברים · שערים. ‏`GRAM_ONLY` — מה שמצהיר **מבנה** ולא
//  התנהגות (ישות · טבלה · טופס): הוא משמר-פועל בלבד, ואינו הצהרת-תביעה.
const MARK_KEYS = ['sectionMarkers', 'stagePrefixes', 'markRules', 'markDelete', 'markGuards'];
const GRAM_ONLY = ['entityNouns'];
const MARKW = MARK_KEYS.flatMap((k) => (Array.isArray(SPL[k]) ? SPL[k] : []));
/** מילה ⇒ המקור שמצהיר אותה כדקדוק-שפת-האפיון (ולכן אינה פועל-מטרה). */
const GRAMW = new Map([
  ...LEX_KEYS.map((w) => [w, `${LEX_SRC}:${LEX[w]} ("${w}")`]),
  ...[...MARK_KEYS, ...GRAM_ONLY].flatMap((k) => (Array.isArray(SPL[k]) ? SPL[k] : []).map((w) => [w, `${GOAL_SRC.spl}:${k} ("${w}")`])),
]);
// רמזי-הטיפוס של דקדוק-האפיון: **כל** מפתח `type*` באטום — נקרא, לא נכתב.
const TYPE_KEYS = Object.keys(SPL).filter((k) => /^type[A-Z]/.test(k) && Array.isArray(SPL[k]));
// צורת-הערך שרמז-טיפוס דורש משקע-סכמה. מיפוי **צורה⇒צורה**, לא מילון-דומייני:
// רק שלוש צורות חד-משמעיות; רמז בלי צורה מוכרת אינו נקשר לשקע (∅, לא ניחוש).
const TYPE_SHAPE = { typeDate: /date/i, typeNum: /number/i, typePercent: /number/i, typeBool: /bool/i };
const DATE_SHAPE = TYPE_SHAPE.typeDate;   // צורת-הערך של שקע-תאריך — **אותו** ביטוי, לא עותק שני
const CMP_WORDS = [[SPL.cmpLabels['>'], SPL.amountAbove || []], [SPL.cmpLabels['<'], SPL.amountBelow || []]];   // תוויות-הכיוון מהדאטה (P1)
const CMP_DIR = { [SPL.cmpLabels['>']]: '>', [SPL.cmpLabels['<']]: '<' };

const heW = (s) => [...String(s || '').matchAll(/[א-ת][א-ת'"״׳]*/g)].map((m) => m[0]);
const stemsOf = (s) => heW(s).map(stem).filter((w) => w.length > 1);
const contentW = (ws) => ws.filter((w) => w.length > 1 && !SCAF.has(w));

/** פועל-מטרה **לפי מבנה**: תחילית מ-`prefixLetters` + שם-פועל (ל…), 4 אותיות ומעלה,
 *  ואינו מילת-פיגום. «לניהול»/«לעקוב»/«לנהל» הם פיגום באטום ⇒ אינם תביעה. */
export function isGoalVerb(w) {
  const PFX = SPL.prefixLetters || '';
  // שתי הקריאות נבדקות, לא אחת: «להפיק» מתחיל ב-ל שהיא גם אות-שימוש, וקילוף-תמיד
  // היה משאיר «הפיק» ומפספס את הפועל (נמדד — «לרשום»/«להפיק» נפלו ל-∅).
  const cands = [w]; if (w.length > 4 && PFX.includes(w[0])) cands.push(w.slice(1));
  if (SCAF.has(w)) return false;
  // מילה שמוצהרת כדקדוק-שפת-האפיון (לקסיקון-החלקים · סימני-המקטע) אינה פועל.
  if (GRAMW.has(w)) return false;
  if (!cands.some((v) => v.length >= 4 && v[0] === SPL.infinitivePrefix && !SCAF.has(v))) return false;
  // ל־ היא גם אות-שימוש על שם-עצם («למתנדב»). ההכרעה נופלת על **שרשרת-המקור**,
  // לא על מילון: מה שיש לו מחלקת-סכמה או רמז-טיפוס הוא שם-עצם, ולא פועל-מטרה.
  return !classOf(w) && !typeHint(w);
}

// ══ תביעה **מוצהרת** — מה שכבר נכתב בשפת-האפיון, עם מוצא ═══════════════════
//  ‏`isGoalVerb` הוא מבחן-צורה, ולכן הוא רואה **רק** שם-פועל (ל…). מה שנמדד:
//  תביעות שכבר **הוצהרו במפורש** בטקסט — בשפה שהמחולל עצמו כותב וקורא —
//  היו בלתי-נראות לו, ונתפסו רק במקרה דרך שם-עצם עם ל־ שבתוכן («חישוב תאריך
//  ‏**לתצוגה** (fmtDate)» נספר 27 פעם כ«פועל-מטרה לתצוגה»). זה בדיוק אותו
//  גידור-שווא של שלב-3: היכולת הייתה, הקורא לא היה.
//
//  🔒 שני מקורות, שניהם קיימים בדיסק, ושניהם נותנים **מוצא** — אפס מורפולוגיה:
//   (1) **הצהרת-מקטע** `<סימן>: ע1, ע2…` — `spec-lang.data.json` כבר מצהיר את
//       הסימנים (`sectionMarkers`/`stagePrefixes`), והמחולל כבר בונה מהם מכונת-
//       מצבים (שער `coredart`: «מצבים חצובים · advanceStatus/nextStage»).
//       הצהרת-שלבים היא התנהגות, והמוצא הוא מפתח-האטום שמצהיר את הסימן.
//   (2) **עיגון-אטום מפורש** `… (fnName)` בסוף שורת-חלק — התחביר שהמחולל
//       עצמו פולט (`entity.mjs:142` · `genesis-gen.mjs:239` «⇒ האטום המדויק»).
//       המוצא אינו מילה אלא **האטום עצמו**: הוא חייב להיות שכבת-לוגיקה
//       באורקל (`atom-index-full.json`), אחרת אין תביעה. שם שאינו במדף ⇒ ∅.
//
//  ⚠️ מה שזה **לא**: לא רשימת-פעלים, לא זיהוי-ציווי, ולא תפקיד-לקסיקון שנבחר
//  ביד. מילת-החלק נלקחת מהלקסיקון **כפי שהיא**, וההכרעה נופלת על האטום המעוגן.
const MARK_SRC = new Map(MARK_KEYS.flatMap((k) => (Array.isArray(SPL[k]) ? SPL[k] : []).map((w) => [w, k])));
const esc = (x) => String(x).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const MARK_RE = MARKW.length
  ? new RegExp(`(?:^|[\\n;·|])\\s*(${[...new Set(MARKW)].map(esc).join('|')})\\s*:\\s*\\S`, 'g') : null;
const PART_RE = /^[ \t]*(\S+)[ \t]+.*\(([A-Za-z_]\w*)\)[ \t]*$/;

/** אטום-לוגיקה לפי שם — מהאורקל המאוחד, בטעינה עצלה (825KB נקראים רק אם יש עוגן). */
let LOGIC = null;
function logicAtom(name) {
  if (LOGIC === null) {
    LOGIC = new Map();
    try {
      for (const a of JSON.parse(fs.readFileSync(GENU('atom-index-full.json'), 'utf8')))
        if (a && a.layer === 'logic' && a.id && !LOGIC.has(a.id)) LOGIC.set(a.id, a);
    } catch { /* אין אורקל ⇒ אין תביעה-מעוגנת; נרשם ב-`declaredSearched` */ }
  }
  return LOGIC.get(name) || null;
}
// 🎬 **תפקיד-פעולה — נגזר משני האטומים, לא נבחר ביד.** `spec-lang.pAct` מצהיר
//  את מילת-**צורת-הפעולה** של דקדוק-החלקיקים (G23: «צורה⇒פעולות»), והלקסיקון
//  מצהיר לאיזה תפקיד-צורני אותה מילה שייכת. חיתוך השניים נותן את התפקיד שהוא
//  פעולה — ולא מפני שבחרתי שם-תפקיד: `pAct=["פעולה"]` ∩ `lexicon["פעולה"]="button"`
//  ⇒ `{button}`. מילת-חלק בתפקיד הזה היא הצהרת-פעולה, והמוצא הוא שני האטומים.
const ACTION_ROLES = new Set((SPL.pAct || []).map((w) => LEX[w]).filter(Boolean));
const ACTION_WORDS = new Map(LEX_KEYS.filter((w) => ACTION_ROLES.has(LEX[w]))
  .map((w) => [w, `${GOAL_SRC.spl}:pAct ("${(SPL.pAct || []).find((x) => LEX[x] === LEX[w]) || ''}") · ${LEX_SRC}:${LEX[w]} ("${w}")`]));

/** מה נסרק בדרך לתביעה-מוצהרת — נאמר בשמו בפנקס, גם כשלא נמצא דבר. */
export const declaredSearched = () => [
  `הצהרת-מקטע «<סימן>: ערכים» (${GOAL_SRC.spl}:${MARK_KEYS.join('/')} · ${new Set(MARKW).size} סימנים)`,
  `עיגון-אטום מפורש «חלק … (fn)» (${LEX_SRC} · ${LEX_KEYS.length} מילות-חלק) מול שכבת-הלוגיקה באורקל (atom-index-full.json)`,
  `חלק בתפקיד-פעולה (${GOAL_SRC.spl}:pAct ∩ ${LEX_SRC} ⇒ ${[...ACTION_WORDS.keys()].join('/') || '—'})`,
];

/** טקסט ⇒ מילות-התביעה שהוצהרו בו, כל אחת עם מוצאה. Map<מילה, {src, kind}>. */
export function declaredDemands(text) {
  const out = new Map(); const s = String(text || '');
  if (MARK_RE) { MARK_RE.lastIndex = 0;
    for (const m of s.matchAll(MARK_RE)) if (!out.has(m[1]))
      out.set(m[1], { kind: 'הצהרת-מקטע', src: `${GOAL_SRC.spl}:${MARK_SRC.get(m[1])} ("${m[1]}")` });
  }
  for (const line of s.split('\n')) {
    const mm = line.match(PART_RE); if (!mm) continue;
    const [, head, fn] = mm;
    if (!LEX_KEYS.includes(head) || out.has(head)) continue;   // מילת-החלק חייבת להיות בלקסיקון
    const a = logicAtom(fn); if (!a) continue;                 // והעוגן חייב להיות אטום-לוגיקה קיים
    out.set(head, { kind: 'עיגון-אטום', src: `new/${a.file} (${fn}) · ${LEX_SRC}:${LEX[head]} ("${head}")` });
  }
  // מעבר שני ולא מיזוג: עוגן-אטום גובר על תפקיד-פעולה **בכל הטקסט**, לא רק בשורה
  // שלו — שורה עם `(fn)` נותנת מוצא חזק יותר לאותה מילת-חלק מאשר תפקיד-הלקסיקון.
  for (const line of s.split('\n')) {
    const head = line.trim().split(/\s+/)[0] || '';
    if (!ACTION_WORDS.has(head) || out.has(head)) continue;     // מילת-חלק בתפקיד-פעולה בראש שורה
    out.set(head, { kind: 'תפקיד-פעולה', src: ACTION_WORDS.get(head) });
  }
  return out;
}

/** מטרה ⇒ תביעות. חיתוך בכל **מילת-תביעה** — פועל-מטרה מבני או תביעה-מוצהרת.
 *  מקטע-פתיחה בלי תביעה נצמד לזו שאחריו (‏«כל בוקר» הוא ההקשר של «לדעת»).
 *  אין תביעה ⇒ אין תביעות, והשכבה שותקת — משפט-ישות ממשיך ביט-זהה. */
export function demandsOf(text) {
  const decl = declaredDemands(text);
  const isD = (w) => isGoalVerb(w) || decl.has(w);
  const segs = []; let cur = [];
  for (const tok of String(text || '').split(/\s+/).filter(Boolean)) {
    const w = heW(tok)[0] || '';
    if (w && isD(w) && cur.length) { segs.push(cur.join(' ')); cur = []; }
    cur.push(tok);
  }
  if (cur.length) segs.push(cur.join(' '));
  const out = []; let lead = '';
  for (const seg of segs) {
    const verb = heW(seg).find(isD);
    if (!verb) { lead = lead ? lead + ' ' + seg : seg; continue; }
    const d = decl.get(verb) || null;
    out.push({ verb, text: (lead ? lead + ' ' : '') + seg, src: d ? d.src : null, declared: d ? d.kind : null });
    lead = '';
  }
  if (out.length && lead) out[out.length - 1].text += ' ' + lead;   // זנב בלי תביעה שייך לאחרונה
  return out;
}

/** האם המילה היא מילת-תביעה בטקסט הזה (פועל-מבני או מוצהרת). */
export const isDemandWord = (w, decl) => isGoalVerb(w) || (decl ? decl.has(w) : false);

/** מילה ⇒ רמז-טיפוס מדקדוק-האפיון, בהתאמת-`stem` של המדף (לא מחרוזת, לא מילון חדש). */
export function typeHint(word) {
  const ws = stemsOf(word);
  if (!ws.length) return null;
  const hits = [];
  for (const k of TYPE_KEYS) for (const form of SPL[k]) {
    const fsw = stemsOf(form);
    if (fsw.length && fsw.every((x) => ws.includes(x))) hits.push({ type: k, form, src: `${GOAL_SRC.spl}:${k} ("${form}")` });
  }
  if (!hits.length) return null;
  const exact = hits.find((h) => h.form === word || stemsOf(h.form).join(' ') === ws.join(' '));
  const kinds = [...new Set(hits.map((h) => h.type))];
  // שני רמזי-טיפוס שונים על אותה מילה = ספק ⇒ **מתג**, לא הכרעה (§20 · הכרעה-24)
  if (kinds.length > 1 && !(exact && hits.filter((h) => h.form === word).length)) return { type: null, options: kinds, forms: hits.map((h) => h.form), src: null };
  return exact || hits[0];
}

/** מילה ⇒ מחלקת-סכמה יחידה (אותה שרשרת-מקור: חבילות-ורטיקל ⇒ entity-terms ⇒ schema-fields).
 *  כמה מועמדים ⇒ `{ options }` ו**לא** מכריעים (§20 · הכרעה-24). */
export const classOf = soleClassOf;   // כלל-ההכרעה חי ב-tzinor (מקור אחד לשני הצרכנים)

/**
 * 🎯 **הפסק על מטרה חופשית.** מטרה ⇒ תביעות ⇒ דרישות (ישות · שדה · קבוע), לכל
 * דרישה מקור או ∅. שלושה סוגי-מקור, לפי הסדר:
 *   1. שרשרת-הסכמה — `candidatesFor` (חבילות-ורטיקל ⇒ entity-terms ⇒ schema-fields)
 *   2. רמז-טיפוס מדקדוק-האפיון — `spec-lang.data.json:type*` (צורת-הערך)
 *   3. ליטרל במטרה עצמה — מספר שנכתב במטרה הוא מקור לעצמו
 * מה שאין לו אף אחד מהשלושה **אינו מנוחש** — הוא ∅/מתג (L57).
 */
/**
 * 🕯️ חוט-1 (WIRE-PLAN §3, צעד 1): המקשה נשאל לפני ההכרעה — **דיווח בלבד**.
 * מגודר `KASHE_WIRE`: כבוי כברירת-מחדל ⇒ כל ריצה קיימת ביט-זהה ומהירה.
 * אין ישיבה ⇒ נרשמת הסיבה, וההתנהגות נשארת של-היום (L27 · L110). אפס חסימה.
 */
function kasheObserve(sentence, demands, origin) {
  let k;
  try { k = askMaimatai(sentence); } catch (e) { process.stderr.write(`מקשה: תקלת-גשר — ${e.message}\n`); return; }
  if (!k.available) { process.stderr.write(`מקשה: לא-נמדד — ${k.reason}\n`); return; }
  if (!k.ok) { process.stderr.write(`מקשה: ${k.reason}\n`); return; }
  const asked = k.seeds.filter((s) => s.kind === 'מאי' || s.kind === 'מאן קתני').map((s) => s.kind);
  const nWith = demands.filter((d) => d && d.src).length;
  process.stderr.write(`מקשה [${origin}]: ${k.seeds.length} זרעים (${asked.join('/') || '—'}); ${nWith}/${demands.length} דרישות עם מקור · ${k.wall}ms\n`);
}

export function goalPsak(sentence, origin = 'מטרה') {
  const demands = demandsOf(sentence);
  if (process.env.KASHE_WIRE) kasheObserve(sentence, demands, origin);   // חוט-1: המקשה לפני ההכרעה — דיווח בלבד, לא חוסם
  const decl = declaredDemands(sentence);   // אותו קורא, פעם אחת — מילת-תביעה אינה גם דרישה
  //  🕯️ «אין פועל-מטרה» — הפער הגדול ביותר במדידה (148 מתוך 319, PLAN-100 §2-א). עד כה
  //  השכבה **שתקה** כאן במכוון («משפט-ישות ממשיך ביט-זהה»), והשתיקה נכונה לפלט אבל לא
  //  לדיווח: 148 משפטים נשרו בלי שאיש יֵדע על אילו מילים. עכשיו כל מילת-תוכן נפסקת מול
  //  אותו משמר שפסל אותה — `isGoalVerb` נופל על שרשרת-המקור, לא על מילון — והפלט לא זז.
  if (!demands.length) {
    const ws = [...new Set(contentW(heW(sentence)))];
    // 🕯️ «אין תביעה» עובר ורמינהו על **שני** מסלולי-התביעה, לא על אחד: המבני
    //    (שם-פועל) והמוצהר (הצהרת-מקטע · עיגון-אטום). פסק על כל מסלול בשמו.
    const declMiss = [
      lo('הצהרת-מקטע', `אין בטקסט שורה בצורת «<סימן>: ערכים» מתוך ${new Set(MARKW).size} הסימנים המוצהרים ב-${GOAL_SRC.spl} (${MARK_KEYS.join('/')}) — ולכן אין הצהרת-שלבים/מקטע לפסוק עליה`),
      lo('עיגון-אטום', `אין בטקסט שורת-חלק שמסתיימת ב-«(fn)» עם שם שהוא אטום-שכבת-לוגיקה באורקל (atom-index-full.json), ומילת-החלק שלה בלקסיקון (${LEX_SRC}) — ולכן אין אטום מעוגן שיהיה מקור לתביעה`),
      lo('תפקיד-פעולה', `אין שורה שראשה אחת ממילות-החלק שתפקידן פעולה (${[...ACTION_WORDS.keys()].join('/') || '—'}, נגזר מ-${GOAL_SRC.spl}:pAct ∩ ${LEX_SRC}) — ולכן אין הצהרת-פעולה`),
    ];
    rminhu({ engine: 'purpose.demandsOf', matter: `מטרה בלי תביעת-התנהגות (${origin}): «${String(sentence).slice(0, 60)}»`,
      searched: [`spec-lang.prefixLetters="${SPL.prefixLetters || ''}"`, 'שם-פועל ל… באורך ≥4', 'שרשרת-הסכמה (מה שיש לו מחלקה/רמז-טיפוס הוא שם-עצם, לא פועל)', ...declaredSearched()],
      rulings: declMiss.concat(ws.map((w) => {
        const PFX = SPL.prefixLetters || '';
        const cands = [w]; if (w.length > 4 && PFX.includes(w[0])) cands.push(w.slice(1));
        if (!cands.some((v) => v.length >= 4 && v[0] === SPL.infinitivePrefix)) return lo(w, 'אינה בצורת שם-פועל (ל… באורך ≥4) — אינה מועמדת לפועל-מטרה מבנית, ולא נפסלה בשרשרת');
        const k = (() => { try { return classOf(w); } catch { return null; } })();
        const t = typeHint(w);
        if (k || t) return pliga(w, `בצורת ל… אך ${k ? `יש לה מחלקת-סכמה (${k.cls || (k.options || []).join('/')})` : `יש לה רמז-טיפוס (${t.type || (t.options || []).join('/')})`} — ל־ כאן היא אות-שימוש על שם-עצם, לא שם-פועל; המשמר הוא שרשרת-המקור ולא מילון`);
        if (GRAMW.has(w)) return pliga(w, `בצורת ל… אך מוצהרת כדקדוק-שפת-האפיון (${GRAMW.get(w)}) — מילת-חלק/סימן-מקטע אינה פועל-מטרה; המשמר הוא שרשרת-המקור ולא מילון`);
        return pliga(w, 'בצורת ל… ואין לה מחלקה ואין רמז-טיפוס — כלומר `isGoalVerb` כן אמור להדליק אותה; אם התביעה לא נוצרה, הפער הוא בחיתוך-התביעות ולא בזיהוי-הפועל');
      })) });
  }
  const reqs = []; const claimed = new Set();
  //  🕯️ חוט-1 צעד-2: שאלת-המקשה רוכבת על המתג (§20-ג). **עצל** — python נקרא רק
  //  כשיש מתג בפועל, ו**פעם אחת** למשפט (L114). כיבוי: KASHE_OFF=1. אין ישיבה/python
  //  ⇒ מפה ריקה, וה-∅ נשאר כפי שהיה — התנהגות-של-היום (L27 · L110).
  let _kq; const KQof = () => process.env.KASHE_OFF ? null : (_kq !== undefined ? _kq : (_kq = kasheQuestions(sentence)));
  demands.forEach((d, di) => {
    // הפועל עצמו הוא דרישה: **פעולה**. מקורו — הליטרל במטרה (סוג-המקור השלישי).
    // כך תביעה אינה נעלמת מהמדידה גם כשאין לה שדה, וזה הסימן שצריך לה חלקיק.
    reqs.push({ kind: 'פעולה', demand: di, verb: d.verb, word: d.verb, declared: d.declared || null,
      src: d.src || `${origin}#תביעה${di + 1} (פועל-מטרה "${d.verb}")` });
    const words = [...new Set(contentW(heW(d.text)))].filter((w) => !isDemandWord(w, decl));
    // (1) ישויות — קודם, כדי שהשקעים שלהן יהיו זמינים לקשירת-הקבועים
    for (const w of words) {
      const k = classOf(w); if (!k) continue;
      claimed.add(w);
      if (k.cls) reqs.push({ kind: 'ישות', demand: di, verb: d.verb, word: w, cls: k.cls, slots: k.fields.length, src: k.src });
      // 🕯️ `psak`/`question` באים מ-`soleClassOf` כשהישיבה כבר דנה במילה (‏entity-psak · L114).
      //    תיקו ⇒ **השאלה המדויקת של הישיבה** נוסעת עם המתג, ולא הניסוח הגנרי «איזה?» (§20-ג).
      else reqs.push({ kind: 'ישות', demand: di, verb: d.verb, word: w, cls: null, options: k.options, src: null,
        psak: k.psak || null, ask: k.question || null,
        why: `${k.options.length} מועמדי-סכמה — לא מכריעים${k.psak ? ` · ${k.psak} בישיבה` : ''}` });
    }
    // (2) שדות — רמז-טיפוס; נקשר לשקע-סכמה של ישות שהוכרעה, לפי **צורת-הערך**
    for (const w of words) {
      if (claimed.has(w)) continue;
      const t = typeHint(w); if (!t) continue;
      claimed.add(w);
      // שני רמזי-טיפוס על אותה מילה ⇒ מתג, לא הכרעה
      if (!t.type) { reqs.push({ kind: 'שדה', demand: di, verb: d.verb, word: w, type: null, options: t.options, src: null, why: `${t.options.length} רמזי-טיפוס — לא מכריעים` }); continue; }
      reqs.push({ kind: 'שדה', demand: di, verb: d.verb, word: w, type: t.type, src: t.src, slot: null });
    }
    // (3) קבועים — ליטרל-מספר במטרה. היחידה = המילה שאחריו; המשווה = מילת-השוואה מהאטום
    for (const m of String(d.text).matchAll(/(\d[\d.,]*)/g)) {
      const tail = d.text.slice(m.index + m[0].length);
      const head = d.text.slice(0, m.index);
      const unit = heW(tail)[0] || null;
      const cmp = CMP_WORDS.find(([, ws]) => ws.some((x) => head.trim().endsWith(x)))?.[0] || null;
      const t0 = unit ? typeHint(unit) : null; const t = (t0 && t0.type) ? t0 : null;
      if (unit) claimed.add(unit);
      reqs.push({ kind: 'קבוע', demand: di, verb: d.verb, word: m[1], unit, cmp, type: t ? t.type : null, src: `${origin}#תביעה${di + 1} (ליטרל "${m[1]}")`, slot: null });
    }
    // (4) ∅ — מילת-תוכן שאין לה אף מקור. מדווחת, לא מנוחשת.
    //  🕯️ וכאן ה«אין» של המחולל בגדול שלו: זה הפער ש-PLAN-100 §2 מודד (148 «אין פועל-מטרה» ·
    //  88 «אין-ישות» · 53 «ישות-בלי-שקע»). עד כה ∅ נשא סיבה אחת — «אין מקור בשרשרת-המטרה» —
    //  שאינה אומרת **איזה** מקור נבדק ונפל. הדוקבלוק למעלה כבר נוקב שלושה סוגי-מקור; עכשיו
    //  כל אחד משלושתם נפסק בשמו, לכל מילה, ונרשם בפנקס. הפנקס הופך למפת-העבודה של שלבים 1-4.
    for (const w of words) if (!claimed.has(w)) {
      const k = (() => { try { return classOf(w); } catch { return null; } })();
      const t = typeHint(w);
      const r = rminhu({ engine: 'purpose.goalPsak', matter: `מילת-תוכן «${w}» בתביעה «${d.verb}» (${origin})`,
        searched: ['שרשרת-הסכמה (חבילות-ורטיקל ⇒ entity-terms ⇒ schema-fields)', `רמז-טיפוס (${GOAL_SRC.spl})`, 'ליטרל במטרה עצמה'],
        rulings: [
          k && k.cls ? had(`סכמה:${k.cls}`, `מחלקה יחידה · ${(k.fields || []).length} שקעים`)
            : k ? pliga(`סכמה:${(k.options || []).join('/')}`, `${(k.options || []).length} מועמדי-סכמה — ישות-לא-מוכרעת, ולכן מתג-לבעלים ולא הכרעה-במנוע (L114 · PLAN-100 §2-ה)`)
              : lo('שרשרת-הסכמה', 'אין למילה מחלקת-סכמה באף אחד משלושת מקורות-השרשרת — «אין-ישות» (PLAN-100 §2-ב), וזה חסר-מקור, לא חסר-יכולת'),
          t && t.type ? had(`טיפוס:${t.type}`, `רמז-טיפוס מדקדוק-האפיון · ${t.src}`)
            : t ? pliga(`טיפוס:${(t.options || []).join('/')}`, `${(t.options || []).length} רמזי-טיפוס שונים על אותה מילה — ספק, ולכן מתג ולא הכרעה (§20 · הכרעה-24)`)
              : lo('רמז-טיפוס', `אין למילה צורת-ערך מוכרת ב-${GOAL_SRC.spl} (typeDate/typeNum/typePercent/typeBool) — לא נקשר לשקע, ו∅ אינו ניחוש (L57)`),
          lo('ליטרל במטרה', 'המילה אינה מספר ואינה יחידה שאחרי מספר — סוג-המקור השלישי אינו חל עליה'),
        ] });
      //  🕯️ §20-ג: מה שאין לו מקור הוא מתג-לבעלים **עם השאלה המדויקת**. השאלה היא
      //  של המקשה כלשונו (`מאן קתני`/`מאי`) — לא ניסוח גנרי «איזה?». אין שאלה ⇒ null.
      const _kq2 = KQof();
      reqs.push({ kind: '∅', demand: di, verb: d.verb, word: w, src: null, why: `אין מקור בשרשרת-המטרה · ורמינהו: ${r.digest}`, rminhu: r.rulings,
        ask: askFor(_kq2, w), askSrc: _kq2 && _kq2.ok ? 'maimatai/gate detect' : null });
    }
  });
  // קשירת-שקע: שדה/קבוע עם צורת-ערך ⇒ שקע-סכמה באותה צורה, מהישויות שהוכרעו.
  const cls = reqs.filter((r) => r.kind === 'ישות' && r.cls);
  const slotsOf = (c) => { try { return (classOf(c.word) || {}).fields || []; } catch { return []; } };
  const pool = cls.flatMap((c) => slotsOf(c).map((f) => ({ cls: c.cls, ...f })));
  for (const r of reqs) {
    const shape = TYPE_SHAPE[r.type]; if (!shape) continue;
    const hit = pool.find((f) => shape.test(String(f.type || '')));
    if (hit) { r.slot = `${hit.cls}.${hit.name}`; r.slotSrc = hit.src; }
  }
  const sourced = reqs.filter((r) => r.src);
  return {
    sentence, demands, requirements: reqs, sourced,
    missing: reqs.filter((r) => !r.src),
    byKind: Object.fromEntries(['פעולה', 'ישות', 'שדה', 'קבוע', '∅'].map((k) => [k, reqs.filter((r) => r.kind === k).length])),
  };
}

/** מפתחות-הסכמה שהמטרה מצדיקה (מפתח-אנגלית ⇒ מוצא) — שרשרת-המקור לשער-ההמצאה. */
export function goalSlots(sentence, origin = 'מטרה') {
  const out = new Map();
  for (const r of goalPsak(sentence, origin).requirements) {
    if (r.kind !== 'ישות' || !r.cls) continue;
    for (const f of ((classOf(r.word) || {}).fields || [])) if (!out.has(f.name)) out.set(f.name, { src: f.src, cls: r.cls, word: r.word });
  }
  return out;
}

// ══ צעד «פירוק»: מטרה ⇒ **חוזי-צרכים** (הכרעה-22 «כל מטרה», הבעלים 17.9 22:40) ══
//  הפער שנמדד לפני: `behavior-plan --goal` דרש `needs` שנכתבו **ביד** — כלומר הצעד
//  שהופך מטרה לחלקיקים לא נעשה ע"י המחולל, והמטרה היחידה שעבדה הייתה זו שלה
//  נכתבו הצרכים. כאן נגזר החוזה מהפסק עצמו, ולכן **אותו** קוד רץ על כל מטרה.
//
//  🔒 שלושה מקורות בלבד לכל שדה בחוזה, בדיוק אותם שלושה של `goalPsak`:
//    (1) **שם-שדה** — רק שקע-סכמה שהפסק קשר (`r.slot`), עם `src`. אין שם-שדה מהיד.
//    (2) **קבוע** — רק ליטרל שנכתב במטרה (`kind:'קבוע'`), עם המשווה מהאטום.
//    (3) **מילות-הייעוד** (`demand`) — רק מילות-המטרה עצמה + המונח-העברי של השקע.
//  אות-סימן לאגרגציה נלקחת מדקדוק-החלקיקים הקיים (`spec-lang.data.json:pSum/pCount/
//  pAvg/pTable`) בהתאמת-`stem` — אטום-דאטה קיים, לא מילון חדש (§19-ד).
//
//  מה שאין לו מקור **אינו מומצא ואינו נשמט**: התביעה יוצאת כ-`owner` — מתג-לבעלים
//  עם השאלה המדויקת (L57). הדוגמאות עצמן אינן כאן: החוזה מצהיר `derive` (הסמנטיקה
//  המבנית), והמקור-לדוגמאות נבחר ע"י הפקודה-האחת מנתוני-fixture שקיימים בריפו.
const SIGNALS = { sum: SPL.pSum || [], count: SPL.pCount || [], avg: SPL.pAvg || [], list: SPL.pTable || [] };
const CMP_TAG = { [SPL.cmpLabels['>']]: 'Over', [SPL.cmpLabels['<']]: 'Under' };
const cap = (s) => String(s).charAt(0).toUpperCase() + String(s).slice(1);
/** האם מילות-התביעה נושאות אות-סימן מדקדוק-החלקיקים (התאמת-`stem` של המדף). */
const signalsIn = (words) => {
  const st = new Set(words.flatMap(stemsOf));
  return Object.fromEntries(Object.entries(SIGNALS).map(([k, forms]) => [k,
    forms.map((f) => ({ f, s: stemsOf(f) })).filter((x) => x.s.length && x.s.every((y) => st.has(y)))[0] || null]));
};
/** שקע-הסכמה של דרישה ⇒ {cls, field, type, src}. הטיפוס/המוצא מגיעים מ**מאגר
 *  השקעים של הישויות שהפסק הכריע** (‏`classOf(<מילת-ישות>).fields`) — לא מ-`classOf`
 *  של מילת-הדרישה עצמה, שעבור קבוע היא מספר ואין לה מחלקה (נמדד). */
const slotPool = (psak) => psak.requirements.filter((r) => r.kind === 'ישות' && r.cls)
  .flatMap((e) => ((classOf(e.word) || {}).fields || []).map((f) => ({ cls: e.cls, ...f })));
const slotOf = (r, pool) => {
  if (!r.slot) return null;
  const [cls, field] = String(r.slot).split('.');
  const f = pool.find((x) => x.cls === cls && x.name === field) || null;
  return { cls, field, type: f ? f.type : null, src: r.slotSrc || (f ? f.src : null) };
};

/**
 * 🧩 **הפירוק**: מטרה-בעברית ⇒ `{ needs, owner, claims }` — חוזי-צרכים בפורמט
 * ש-`behavior-plan --needs` צורך (‏shape · demand · params · ret · consts · clock ·
 * world · entity), **בלי דוגמאות** (אלה מגיעות ממקור-דוגמאות, לא מהחוזה).
 * כל צורך נושא `sources` (file:key לכל אסימון) ו-`derive` (הסמנטיקה המבנית).
 */
export function goalNeeds(sentence, origin = 'מטרה') {
  const g = goalPsak(sentence, origin);
  const pool = slotPool(g);
  const needs = {}; const owner = []; const claims = [];
  g.demands.forEach((d, i) => {
    const reqs = g.requirements.filter((r) => r.demand === i);
    const words = reqs.map((r) => r.word);
    const sig = signalsIn(heW(d.text));
    const ents = reqs.filter((r) => r.kind === 'ישות' && r.cls);
    const amb = reqs.filter((r) => r.kind === 'ישות' && !r.cls);
    // קבוע-סף שהפסק קשר לשקע-סכמה = הסמנטיקה היחידה שהמבנה מכריע לבד
    const thr = reqs.filter((r) => r.kind === 'קבוע' && r.cmp && r.slot).map((r) => ({ r, s: slotOf(r, pool) }));
    const nums = reqs.filter((r) => r.kind === 'שדה' && r.type === 'typeNum' && r.slot).map((r) => ({ r, s: slotOf(r, pool) }));
    const mk = (id, need) => { needs[id] = need; return id; };
    const ids = [];
    // מילות-הייעוד = מילות-**התוכן** של התביעה (בלי פיגום) + שם-השקע. מקור: המטרה עצמה.
    const purp = (extra) => [...new Set([...contentW(heW(d.text)), ...extra])].join(' ');
    // 🕯️ **צורך-השעון** — חולץ מלולאת-הסף כדי שיהיה לו **קורא שני** (שלב-3 · PLAN-100).
    //  הוא לא השתנה בבייט: אותו `shape` · אותו `derive:daysSince` · אותו מקור-יחיד
    //  (שם-השקע). מה שהשתנה הוא מי רשאי לקרוא לו — ראה `dates` מתחת ללולאה.
    const clockSeen = new Set();
    const clockNeed = (s) => {
      const F = s.field; const id = `g${i + 1}.clock.${F}Days`;
      if (clockSeen.has(id)) return null; clockSeen.add(id);
      return mk(id, { shape: 'מועד', demand: purp([F]), params: ['String'], ret: 'num',
        clock: { type: 'String' }, sources: [{ token: `'${F}'`, src: s.src }], derive: { kind: 'daysSince', cls: s.cls, field: F } });
    };
    for (const { r, s } of thr) {
      const tag = CMP_TAG[r.cmp] || r.cmp; const K = r.word; const F = s.field; const Fc = cap(F);
      const src = [{ token: `'${F}'`, src: s.src }, { token: K, src: r.src }];
      const c0 = clockNeed(s); if (c0) ids.push(c0);
      ids.push(mk(`g${i + 1}.predicate.${F}${tag}${K}`, { shape: 'מועד', demand: purp([F, r.cmp]), params: ['String'], ret: 'bool',
        clock: { type: 'String' }, consts: [K], sources: src, derive: { kind: 'threshold', cls: s.cls, field: F, k: Number(K), cmp: r.cmp, dir: CMP_DIR[r.cmp] } }));
      ids.push(mk(`g${i + 1}.predicate.record${Fc}${tag}${K}`, { shape: 'רשומות', demand: purp([F, r.cmp]), params: ['dynamic'], ret: 'bool',
        clock: { type: 'String' }, consts: [`'${F}'`, K], entity: s.cls, sources: src,
        derive: { kind: 'recordThreshold', cls: s.cls, field: F, k: Number(K), cmp: r.cmp, dir: CMP_DIR[r.cmp] } }));
      ids.push(mk(`g${i + 1}.collection.${F}${tag}${K}List`, { shape: 'רשומות', demand: purp([F, r.cmp]), params: ['List<dynamic>'], ret: 'List<dynamic>',
        clock: { type: 'String' }, consts: [`'${F}'`, K], entity: s.cls, sources: src,
        derive: { kind: 'filterThreshold', cls: s.cls, field: F, k: Number(K), cmp: r.cmp, dir: CMP_DIR[r.cmp] } }));
    }
    // ── 🕯️ שקע-תאריך שהתביעה **כבר קשרה**, בלי קבוע-סף (שלב-3 · PLAN-100 §3) ──────
    //  מה שנמדד: 40 מתוך 75 התביעות שנפלו על «ישות-בלי-שקע» נושאות דרישה שכבר
    //  נקשרה לשקע-תאריך של הישות שהוכרעה (`r.slot` + `r.slotSrc`, שניהם עם מוצא) —
    //  ואז נזרקה, כי `goalNeeds` צרך **שתי** צורות בלבד: סף (קבוע+משווה) ואגרגציה
    //  (שדה-מספר+אות-סימן). הקשירה הייתה, החוזה לא נגזר.
    //
    //  ‏**אפס סמנטיקה חדשה:** הצורך היחיד שנגזר כאן הוא `clock.<F>Days` — בדיוק
    //  אותו חוזה שהמנוע כבר פולט בלולאת-הסף שמעל, ושמקור-הדוגמאות שלו כבר יודע
    //  לגזור בלי סף («אין סף — פריסה על ציר-הזמן», behavior-plan.mjs:goalExamples).
    //  המשווה והקבוע אינם משתתפים בו כלל, ולכן הגידור מאחוריהם היה **צימוד-שווא**.
    //  שלושת הצרכים שכן צורכים אותם (predicate · record · filter) נשארים מגודרים.
    //
    //  ⚠️ ולא יותר מזה: שקע שאין מילה בתביעה שקושרת אליו **אינו** נבחר כאן. בחירת-
    //  שקע-במנוע היא הכרעה אסורה (L114 · §20-ג) — היא נשארת מתג-בעלים.
    //
    //  🔒 **ובדיוק כאן נעצרים:** קשירת-השקע נעשית לפי **צורת-הערך** (`TYPE_SHAPE`), והיא
    //  לוקחת את השקע ה**ראשון** שצורתו מתאימה. כשלישות יש שקע-תאריך אחד — זו ממה-נפשך.
    //  כשיש כמה (‏`Supporter.first/last/nextDate` — נמדד: 25 תביעות ב-24 יחידות) — «הראשון»
    //  הוא **הכרעה-במנוע**, ו-L114 אוסר אותה. אין מונח-עברי לשקע באף מקור (נמדד: 0 מתוך
    //  492 שדות ב-`schema-fields` נושאים אות עברית), ולכן אין דרך לפסוק מי מהם — ⇒ מתג.
    //
    //  ורדיוס-הפגיעה מצומצם לפער שנמדד בלבד: דרישה שלולאת-הסף כבר צרכה **אינה**
    //  נכנסת לכאן (נמדד: 3 תביעות-סף בקורפוס, אחת מהן על בריכה עם 3 שקעי-תאריך).
    //  הקשירה-השרירותית שבמסלול-הסף היא ממצא לבעלים, לא שינוי של הגל הזה.
    const thrReqs = new Set(thr.map((x) => x.r));
    const poolDates = pool.filter((f) => DATE_SHAPE.test(String(f.type || '')));
    const dates = reqs.filter((r) => r.slot && !thrReqs.has(r)).map((r) => ({ r, s: slotOf(r, pool) }))
      .filter((x) => x.s && DATE_SHAPE.test(String(x.s.type || '')));
    const askedDate = new Set();
    for (const { r, s } of dates) {
      if (poolDates.length > 1) {
        if (askedDate.has(r.word)) continue; askedDate.add(r.word);
        owner.push({ claim: i + 1, verb: d.verb, word: r.word, kind: 'שקע-תאריך-לא-מוכרע',
          question: `«${r.word}» בתביעה «${d.verb}»: ${poolDates.length} שקעי-תאריך מועמדים (${poolDates.map((f) => f.cls + '.' + f.name).join(' · ')}) — הקשירה לפי צורת-הערך אינה מבדילה ביניהם, ולשקע אין מונח-עברי באף מקור, ולכן הבחירה אינה של המנוע (L114). איזה מהם?` });
        continue;
      }
      const c = clockNeed(s); if (c) ids.push(c);
    }
    for (const { r, s } of nums) {
      const hit = sig.sum || sig.avg || sig.count;
      if (!hit) { owner.push({ claim: i + 1, verb: d.verb, word: r.word, kind: 'אגרגציה-בלי-אות-סימן',
        question: `«${d.verb}» על ${s.cls}.${s.field}: יש שקע-מספר אך אין אות-סימן-אגרגציה במטרה (${[...Object.values(SIGNALS)].flat().slice(0, 4).join('/')}) — סכום? מונה? ממוצע?` }); continue; }
      const fam = sig.sum ? 'sum' : sig.avg ? 'avg' : 'count';
      ids.push(mk(`g${i + 1}.measure.${fam}${cap(s.field)}`, { shape: 'רשומות', demand: purp([s.field, hit.f]), params: ['List<dynamic>'], ret: 'num',
        consts: [`'${s.field}'`], entity: s.cls, sources: [{ token: `'${s.field}'`, src: s.src }, { token: hit.f, src: `${GOAL_SRC.spl}:p${cap(fam)} ("${hit.f}")` }],
        derive: { kind: fam + 'By', cls: s.cls, field: s.field } }));
    }
    if (!ids.length) {
      // ── 🕯️ ורמינהו לפני «ישות-בלי-שקע» (שלב-3 · PLAN-100 §3) ──────────────────
      //  «אין» = «לא-חיפשת» (LAW.md · הכרעה-23). עד כה הטענה «אין שקע-סכמה מחובר»
      //  נכתבה 59 פעמים בלי לנקוב **איזה** מקור-שקע נבדק — ושתי משפחות-חיפוש,
      //  **חציבה** ו**כפילות**, מעולם לא רצו על העניין. `slotSources` (tzinor) מביא
      //  את שלושתן בשמן; הפסק כאן אומר על כל אחת למה היא אינה סוגרת את התביעה.
      //
      //  ⚠️ ואי-אפשר שיהיה כאן «חד שיעורא»: אנו בענף הזה **מפני** שאף מילה בתביעה
      //  לא נקשרה לשקע. מקור שנושא שקעים ואין מילה שקושרת אליהם אינו תשובה — בחירה
      //  בו הייתה הכרעה-במנוע (L114). לכן הפסק הוא «פליגא» מנומק, והמתג נשאר לבעלים.
      if (ents.length) {
        const conn = reqs.filter((r) => r.slot).length;
        for (const e of ents) {
          const srcs = (() => { try { return slotSources(e.cls); } catch { return []; } })();
          rminhu({ engine: 'purpose.goalNeeds', matter: `שקע לתביעה «${d.verb}» על ${e.cls} (${origin})`,
            searched: ['שרשרת (schema-fields)', 'חציבה (shape-ops · screen-decomp ש8)', 'כפילות (מחלקת-אח באותו סט-שמות-שדות)'],
            rulings: srcs.map((x) => (x.slots.length
              ? pliga(x.src, `${x.family}: נושא ${x.slots.length} שקעים ל-${e.cls}${x.family === 'שרשרת' ? '' : x.adds.length ? ` (${x.adds.length} מהם אינם ב-schema-fields: ${x.adds.slice(0, 4).join(',')})` : ' — 0 שקעים שאינם כבר בשרשרת, כלומר אותו מקור בצורה שנייה ולא מקור נוסף'}, אך ${conn ? 'אף אחד מהם אינו השקע שהתביעה קשרה' : 'אף מילה בתביעה אינה נקשרת לאף אחד מהם'}; בחירת-שקע בלי מילה שקושרת אליו היא הכרעה-במנוע (L114) ⇒ מתג-לבעלים`)
              : lo(x.src, `${x.family}: ${x.why}`))) });
        }
      }
      // תביעה בלי חוזה — **השאלה המדויקת**, לא ניחוש ולא השמטה (L57)
      const q = amb.length
        ? (amb[0].ask || `«${amb[0].word}» — ${(amb[0].options || []).length} מועמדי-סכמה (${(amb[0].options || []).slice(0, 4).join(', ')}): איזה?`)
        : !ents.length
          ? `«${d.verb}»: אין מילה בתביעה שיש לה מחלקת-סכמה (${words.filter((w) => w !== d.verb).slice(0, 6).join(' · ') || '—'}) — על איזו ישות?`
          : `«${d.verb}» על ${ents.map((e) => e.cls).join('/')}: אין שקע-סכמה מחובר ואין קבוע-סף במטרה — מה נמדד ומול מה?`;
      owner.push({ claim: i + 1, verb: d.verb, kind: ents.length ? 'ישות-בלי-שקע' : amb.length ? 'ישות-לא-מוכרעת' : 'אין-ישות', question: q });
    }
    // תביעה שנגזר לה חוזה אך נשארו בה מילות-∅ — **לא נשמטת בשקט**: מה שלא נגזר נרשם.
    const nil = reqs.filter((r) => r.kind === '∅').map((r) => r.word);
    if (ids.length && nil.length) owner.push({ claim: i + 1, verb: d.verb, kind: 'תביעה-חלקית',
      question: `«${d.verb}»: ${ids.length} חוזים נגזרו, אך ${nil.length} מילים בתביעה בלי מקור (${nil.slice(0, 8).join(' · ')}) — האם אחת מהן שדה/ישות שדרוש לה חוזה?` });
    claims.push({ claim: i + 1, verb: d.verb, text: d.text, needs: ids, entities: ents.map((e) => e.cls) });
  });
  return { sentence, needs, owner, claims, psak: g };
}

/**
 * משפט-חופשי ⇒ אובייקט בצורת-`doc` של read.mjs (‏title · sections · optional · mandatory).
 * `check(doc, spec)` רץ עליו בלי שינוי — אותם שבעה מהלכים, אותו פסק.
 * מחזיר גם `sources` (שדה ⇒ מוצא) ו-`open` (ישויות שלא הוכרעו — מתגים).
 */
export function purposeDoc(sentence, origin = 'משפט') {
  const sw = toSwitches(sentence, origin);
  const doc = {
    lines: [sentence], title: norm(sentence), sections: {}, optional: [], mandatory: [],
    sources: new Map(), open: [], domain: sw.domain, entities: [],
  };
  const ev = [];
  for (const e of sw.entities) {
    const o = soleOption(e);
    if (!o) {
      const n = (e.options || []).filter((x) => x.cls).length;
      doc.open.push({ word: e.word, options: n, fields: [], from: 'אין מועמד-סכמה יחיד', srcs: [] });
      ev.push(`- «${e.word}» — ${n} מועמדי-סכמה, אין יחיד ⇒ מתג (לא הוכרע)`);
      continue;
    }
    doc.entities.push({ word: e.word, cls: o.cls });
    const noTerm = [];
    for (const f of o.fields) {
      if (!f.src) continue;                                  // שדה בלי מוצא אינו ראיה
      const n = norm(f.name); if (!n || doc.sources.has(n)) continue;
      doc.sources.set(n, f.src);
      // 🔤 שפת-האפיון עברית-בלבד: שקע בלי מונח-עברי **אינו נכנס לחובה/רשות**,
      // כי אז הישיבתי היה מיישם אותו כשדה ו-`interpret` היה מתייג אותו «שדה»
      // (נמדד). אין מונח ⇒ מתג עם מוצא. הישיבתי לא ממציא שם — זה בדיוק תפקידו.
      if (!HE_RE.test(n)) { noTerm.push(n); continue; }
      (f.optional ? doc.optional : doc.mandatory).push(n);
    }
    if (noTerm.length) doc.open.push({ word: e.word, cls: o.cls, options: noTerm.length, fields: noTerm, from: 'שקע-סכמה בלי מונח-עברי', srcs: [...new Set(o.fields.filter((f) => noTerm.includes(norm(f.name))).map((f) => f.src))] });
    ev.push(`- «${e.word}» ≡ ${o.cls} (${o.fields.length} שקעים) · ${(o.evidence || []).join(' · ')}`);
  }
  doc.sections['חובה'] = ev;
  // 🎯 שכבת-המטרה: תביעות ודרישותיהן. לא נוגעת ב-`חובה`/`רשות` ולא בסעיפים שה-
  // מהלכים קוראים — `check(doc, spec)` נשאר ביט-זהה. מה שהיא מוסיפה: **מקורות**
  // (שרק-עולים) ו**מתגים** על מה שאין לו מקור — בדיוק מה שחסר במטרה עם פעולות.
  const g = goalPsak(sentence, origin);
  doc.goal = g;
  doc.sections['מטרה'] = g.demands.map((d, i) => `- תביעה${i + 1} «${d.verb}»: ${g.requirements.filter((r) => r.demand === i).map((r) => `${r.kind}:${r.word}${r.cls ? '≡' + r.cls : ''}${r.type ? '≡' + r.type : ''}${r.slot ? '⇒' + r.slot : ''}${r.src ? '' : ' ∅'}`).join(' · ')}`);
  for (const r of g.requirements) {
    if (r.src && !doc.sources.has(r.word)) doc.sources.set(r.word, r.src);
    if (!r.src) doc.open.push({ word: r.word, options: (r.options || []).length, fields: [], from: `מטרה·${r.kind}: ${r.why || 'אין מקור'}`, srcs: [] });
  }
  return doc;
}

/**
 * 🔨 **הישיבתי לפני הבנייה** — זה מה שהופך אותו משופט-שמודד לשופט-שמבצע.
 * טיוטת-ספק + משפט ⇒ מסמך-המטרה ⇒ שבעת המהלכים ⇒ פסק ⇒ **ספק מתוקן**.
 * מה שהוכרע מיושם; מה שלא — נשאר מתג, ולא מומצא (L57).
 * מחזיר `{ spec, rulings, decided, switches, changed }`.
 */
export function rule(sentence, draftSpec, origin = 'משפט') {
  const doc = purposeDoc(sentence, origin);
  const spec = parseSpec(draftSpec);
  const findings = check(doc, spec);
  const rulings = findings.map((f) => pasak(f, doc, spec));
  const built = applyPsak(spec, rulings);
  return {
    spec: built.text, changed: built.changed, rulings,
    decided: rulings.filter((r) => r.decided).length,
    switches: rulings.filter((r) => !r.decided),
    open: doc.open, sources: doc.sources,
  };
}

/** שמות-השדות שיש להם מוצא מוצהר בשרשרת-המטרה — סוג-המקור השני של שער-ההמצאה. */
export function purposeSources(sentence, origin = 'משפט') { return purposeDoc(sentence, origin).sources; }

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const s = process.argv.slice(2).filter((a) => !a.startsWith('--')).join(' ');
  if (!s) { console.log('usage: node yeshiva/purpose.mjs "<משפט חופשי>"'); process.exit(0); }
  const d = purposeDoc(s);
  console.log('משפט: ' + d.title);
  console.log('תחום: ' + (d.domain.pick || '(אין)') + (d.domain.ranked?.[0]?.src ? ' · ' + d.domain.ranked[0].src : ''));
  for (const l of d.sections['חובה']) console.log(l);
  console.log(`\nשקעי-חובה (${d.mandatory.length}): ${d.mandatory.join(', ') || '—'}`);
  console.log(`שקעי-רשות (${d.optional.length}): ${d.optional.join(', ') || '—'}`);
  console.log(`מתגים (${d.open.length}): ${d.open.map((o) => `${o.word}[${o.options}]`).join(' · ') || '—'}`);
  const srcs = [...new Set(d.sources.values())];
  console.log(`מקורות (${srcs.length}): ${srcs.slice(0, 3).join(' · ')}${srcs.length > 3 ? ' …' : ''}`);
  const g = d.goal;
  console.log(`\nתביעות (${g.demands.length}): ${g.demands.map((x) => `«${x.verb}»`).join(' · ') || '—'}`);
  console.log(`דרישות: ${Object.entries(g.byKind).map(([k, v]) => `${k} ${v}`).join(' · ')} — ${g.sourced.length} עם מקור · ${g.missing.length} ∅`);
  for (const r of g.requirements) {
    const tag = r.cls || r.type || (r.unit ? `יחידה:${r.unit}` : '') || '';
    console.log(`  ${r.src ? '✓' : '∅'} ${r.kind} «${r.word}»${tag ? ' ≡ ' + tag : ''}${r.cmp ? ' · ' + r.cmp : ''}${r.slot ? ' ⇒ ' + r.slot : ''} — ${r.src || r.why || 'אין מקור בשרשרת-המטרה'}`);
  }
  if (process.argv.includes('--json')) console.log(JSON.stringify({ sentence: d.title, mandatory: d.mandatory, optional: d.optional, sources: Object.fromEntries(d.sources), open: d.open, goal: g }, null, 2));
}
