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
import { toSwitches, soleClassOf } from '../machtzev/generator/tzinor.mjs';
import { stem } from '../machtzev/generator/match.mjs';
import { check, parseSpec, STOP } from './read.mjs';
import { pasak, applyPsak } from './apply.mjs';

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
// רמזי-הטיפוס של דקדוק-האפיון: **כל** מפתח `type*` באטום — נקרא, לא נכתב.
const TYPE_KEYS = Object.keys(SPL).filter((k) => /^type[A-Z]/.test(k) && Array.isArray(SPL[k]));
// צורת-הערך שרמז-טיפוס דורש משקע-סכמה. מיפוי **צורה⇒צורה**, לא מילון-דומייני:
// רק שלוש צורות חד-משמעיות; רמז בלי צורה מוכרת אינו נקשר לשקע (∅, לא ניחוש).
const TYPE_SHAPE = { typeDate: /date/i, typeNum: /number/i, typePercent: /number/i, typeBool: /bool/i };
const CMP_WORDS = [['מעל', SPL.amountAbove || []], ['מתחת', SPL.amountBelow || []]];

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
  if (!cands.some((v) => v.length >= 4 && v[0] === 'ל' && !SCAF.has(v))) return false;
  // ל־ היא גם אות-שימוש על שם-עצם («למתנדב»). ההכרעה נופלת על **שרשרת-המקור**,
  // לא על מילון: מה שיש לו מחלקת-סכמה או רמז-טיפוס הוא שם-עצם, ולא פועל-מטרה.
  return !classOf(w) && !typeHint(w);
}

/** מטרה ⇒ תביעות. חיתוך בכל פועל-מטרה; מקטע-פתיחה בלי פועל נצמד לתביעה שאחריו
 *  (‏«כל בוקר» הוא ההקשר של «לדעת», לא תביעה בפני עצמה). אין פועל ⇒ אין תביעות,
 *  והשכבה שותקת — משפט-ישות ממשיך בדיוק כמו קודם (ביט-זהה). */
export function demandsOf(text) {
  const segs = []; let cur = [];
  for (const tok of String(text || '').split(/\s+/).filter(Boolean)) {
    const w = heW(tok)[0] || '';
    if (w && isGoalVerb(w) && cur.length) { segs.push(cur.join(' ')); cur = []; }
    cur.push(tok);
  }
  if (cur.length) segs.push(cur.join(' '));
  const out = []; let lead = '';
  for (const seg of segs) {
    const verb = heW(seg).find(isGoalVerb);
    if (!verb) { lead = lead ? lead + ' ' + seg : seg; continue; }
    out.push({ verb, text: (lead ? lead + ' ' : '') + seg });
    lead = '';
  }
  if (out.length && lead) out[out.length - 1].text += ' ' + lead;   // זנב בלי פועל שייך לתביעה האחרונה
  return out;
}

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
export function goalPsak(sentence, origin = 'מטרה') {
  const demands = demandsOf(sentence);
  const reqs = []; const claimed = new Set();
  demands.forEach((d, di) => {
    // הפועל עצמו הוא דרישה: **פעולה**. מקורו — הליטרל במטרה (סוג-המקור השלישי).
    // כך תביעה אינה נעלמת מהמדידה גם כשאין לה שדה, וזה הסימן שצריך לה חלקיק.
    reqs.push({ kind: 'פעולה', demand: di, verb: d.verb, word: d.verb, src: `${origin}#תביעה${di + 1} (פועל-מטרה "${d.verb}")` });
    const words = [...new Set(contentW(heW(d.text)))].filter((w) => !isGoalVerb(w));
    // (1) ישויות — קודם, כדי שהשקעים שלהן יהיו זמינים לקשירת-הקבועים
    for (const w of words) {
      const k = classOf(w); if (!k) continue;
      claimed.add(w);
      if (k.cls) reqs.push({ kind: 'ישות', demand: di, verb: d.verb, word: w, cls: k.cls, slots: k.fields.length, src: k.src });
      else reqs.push({ kind: 'ישות', demand: di, verb: d.verb, word: w, cls: null, options: k.options, src: null, why: `${k.options.length} מועמדי-סכמה — לא מכריעים` });
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
    for (const w of words) if (!claimed.has(w)) reqs.push({ kind: '∅', demand: di, verb: d.verb, word: w, src: null, why: 'אין מקור בשרשרת-המטרה' });
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
const CMP_TAG = { 'מעל': 'Over', 'מתחת': 'Under' };
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
    for (const { r, s } of thr) {
      const tag = CMP_TAG[r.cmp] || r.cmp; const K = r.word; const F = s.field; const Fc = cap(F);
      const src = [{ token: `'${F}'`, src: s.src }, { token: K, src: r.src }];
      ids.push(mk(`g${i + 1}.clock.${F}Days`, { shape: 'מועד', demand: purp([F]), params: ['String'], ret: 'num',
        clock: { type: 'String' }, sources: [src[0]], derive: { kind: 'daysSince', cls: s.cls, field: F } }));
      ids.push(mk(`g${i + 1}.predicate.${F}${tag}${K}`, { shape: 'מועד', demand: purp([F, r.cmp]), params: ['String'], ret: 'bool',
        clock: { type: 'String' }, consts: [K], sources: src, derive: { kind: 'threshold', cls: s.cls, field: F, k: Number(K), cmp: r.cmp } }));
      ids.push(mk(`g${i + 1}.predicate.record${Fc}${tag}${K}`, { shape: 'רשומות', demand: purp([F, r.cmp]), params: ['dynamic'], ret: 'bool',
        clock: { type: 'String' }, consts: [`'${F}'`, K], entity: s.cls, sources: src,
        derive: { kind: 'recordThreshold', cls: s.cls, field: F, k: Number(K), cmp: r.cmp } }));
      ids.push(mk(`g${i + 1}.collection.${F}${tag}${K}List`, { shape: 'רשומות', demand: purp([F, r.cmp]), params: ['List<dynamic>'], ret: 'List<dynamic>',
        clock: { type: 'String' }, consts: [`'${F}'`, K], entity: s.cls, sources: src,
        derive: { kind: 'filterThreshold', cls: s.cls, field: F, k: Number(K), cmp: r.cmp } }));
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
      // תביעה בלי חוזה — **השאלה המדויקת**, לא ניחוש ולא השמטה (L57)
      const q = amb.length
        ? `«${amb[0].word}» — ${(amb[0].options || []).length} מועמדי-סכמה (${(amb[0].options || []).slice(0, 4).join(', ')}): איזה?`
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
