// ══════════════════════════════════════════════════════════════════════════
//  yeshiva/mavin.mjs — 🧭 **מנוע 2 · המבין.** צורת-הצורך מתוך צורת-המשפט. אפס פירוש.
//  ────────────────────────────────────────────────────────────────────────
//  הכרעת-בעלים (22.9): «אני לא רוצה שיפרש את המילה או יחפש אותה — אני רוצה שיבין
//  איזה חלקיק הוא מחפש». לכן המילה נשארת סגורה (תווית בלבד), והמנוע מוציא רק **צורה**:
//    · הרבה / אחד            · אילו שדות, ומכל שדה רק הסוג (טקסט · מספר · תאריך · כן-לא · מצביע)
//    · מה עושים (6 צורות)    · מה מצביע למה
//  מה שהמשפט לא אומר ⇒ שאלה סגורה לבעלים (askFor-style), לא ניחוש. התשובה נרשמת
//  (`remember`) ומוצעת בפעם הבאה כהצעה, לא כעובדה («גם אם ענית בעבר אולי הפעם משהו אחר»).
//
//  🔒 אפס-עברית בלוגיקה (L107): אין רשימת-מילים. שלושה כללי-אותיות בלבד, מוצהרים כאן:
//    (א) סיומת «ים»/«ות» על מילה ≥4 אותיות ⇒ הרבה          (כמו gate.py: `\S{2,}(ין|ים)`)
//    (ב) האיבר האחרון ברשימה שמתחיל ב-«ו» ⇒ «ו»-החיבור מוסרת    (צורת-רשימה: פסיקים + ו)
//    (ג) הסרת 1–2 אותיות פותחות להשוואת-גזע (כמו gate.py `_variants`, tzinor.scoreForm)
//  «מילת-קישור» אינה רשימה אלא **מדידה**: מילה שכתובה על חלקיקים מ-≥SPREAD מינים שונים
//  («עם» = 20 מינים, «תורמים» = 4) אינה מצביעה לשום מקום ⇒ אינה «דבר». נגזר מהקטלוג.
//
//  שימוש:  node yeshiva/mavin.mjs "<משפט>" [--answers f.json]   ·  node yeshiva/mavin.mjs --smoke
//          import { mavin } from './yeshiva/mavin.mjs'; mavin(sentence, { answers })
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as R from '../machtzev/root.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const SPREAD = () => +(process.env.MAVIN_SPREAD || Math.ceil(opsCount() / 3));   // ≥ שליש מהמינים ⇒ מילה מפוזרת (לא דבר). נגזר מהקטלוג, לא קבוע
export const TYPES = ['text', 'num', 'date', 'bool', 'ref'];            // 5 סוגי-שדה
export const ACTS = ['list', 'one', 'add', 'edit', 'del', 'sum', 'search', 'filter', 'empty', 'export', 'message'];   // צורות-עשייה = תגי-האפיון הקיימים (spec-lang: pTable/pAct/pCount/pSearch/pFilter/pEmpty/pExport/pMessage)
const ANSWERS = () => process.env.MAVIN_ANSWERS || path.join(R.ROOT, '.maimatai', 'mavin-answers.jsonl');

// מילה עברית = רצף אותיות, גם עם גרשיים/גרש בפנים («ת"ז», «ח"פ», «צה"ל») — ראשי-תיבות של הבעלים הם מילה אחת, לא שתיים
//   «_» בתוך מילה = רווח של ערך רב-מילי בסוגריים («חבר קהילה» ⇒ «חבר_קהילה» ב-formOf; enumOf מחזיר את הרווח)
export const toks = (s) => [...String(s || '').matchAll(/[֐-׿]+(?:["״׳'_][֐-׿]+)*(?:\s*\/\s*[֐-׿]+(?:["״׳'_][֐-׿]+)*)+|[֐-׿]+(?:["״׳'_][֐-׿]+)*|\d+|[A-Za-z]+/g)].map((m) => m[0].replace(/\s*\/\s*/g, '/'));   // «בעד/נגד/נמנע» = אסימון אחד: בחירה-אחת-מכמה (צורה)
const stripLead = (w) => { const out = [w]; for (let k = 1; k <= 2 && w.length - k >= 3; k++) out.push(w.slice(k)); return out; };   // (ג)
const isMany = (w) => w.length >= 4 && /(ים|ות)$/.test(w) && !SINGULAR.has(w);                                                 // (א) · «כמות»/«נוכחות» = יחיד (דאטה של gen/lang)
const stem = (w) => w.replace(/(ים|ות|ה)$/, '');
/** אותו גזע: מילה (אולי עם 1–2 אותיות פותחות) ⇔ תווית. צורה בלבד — לשימוש הדלת (הגדרות-מילים). */
export const sameStem = (w, label) => toks(label).some((lw) => stripLead(stem(w)).some((f) => f.length >= 3 && f === stem(lw)));
/** האות-הפותחת של מילה שגזעה = תווית (כש+תלמיד ⇒ «כש»); null כשאין התאמה. */
export const leadOf = (w, label) => { const sw = stem(w); for (let k = 0; k <= 2; k++) { if (sw.length - k < 3) break; if (toks(label).some((lw) => sw.slice(k) === stem(lw))) return w.slice(0, k); } return null; };   // (ג') גם «ה» סופית להשוואת יחיד↔רבים (משימה↔משימות)
const itemMany = (item) => isMany(item[0]) || isMany(item[item.length - 1]) || (item.length > 1 && /י$/.test(item[0]));   // «קבלני משנה» — סמיכות-רבים (י + מילה שנייה)

// ── פיזור מהקטלוג: על כמה מינים שונים של חלקיקים כתובה המילה (משפט-המטרה בראש הקובץ), לפי שכבה ──
let _spread = null, _ops = 0;
export const opsCount = () => (spreadIndex(), _ops);
export function spreadIndex() {
  if (_spread) return _spread;
  const map = JSON.parse(fs.readFileSync(R.GEN_DIR + 'ops-map.json', 'utf8'));
  const idx = new Map(); const ops = new Set();
  for (const a of map) { ops.add(a.op);
    let head = '';
    try { head = fs.readFileSync(R.NEW + a.file, 'utf8').split('\n').filter((l) => /^\s*\/\/\/?/.test(l)).slice(0, 4).join(' '); } catch { continue; }
    for (const w of new Set(toks(head))) { if (!idx.has(w)) idx.set(w, { logic: new Set(), display: new Set(), data: new Set() }); (idx.get(w)[a.layer] || idx.get(w).data).add(a.op); }
  }
  _ops = ops.size;
  return (_spread = idx);
}
const entryOf = (w) => { const idx = spreadIndex(); for (const f of stripLead(w)) if (idx.has(f)) return { form: f, e: idx.get(f) }; return null; };
/** על אילו חלקיקים כתובה המילה (לפי שכבה, בשמות-הפעולה). «אין» בלי זה אסור (הכרעת-בעלים 23.9: «אין» בלי חיפוש נחסם). */
export function carriersOf(w) { const x = entryOf(w); return x ? { form: x.form, logic: [...x.e.logic], display: [...x.e.display], data: [...x.e.data] } : { form: w, logic: [], display: [], data: [] }; }
export function spreadOf(w) { const x = entryOf(w); return x ? { form: x.form, ops: x.e.logic.size + x.e.display.size + x.e.data.size } : { form: w, ops: 0 }; }
const isSpread = (w) => spreadOf(w).ops >= SPREAD();
const known = (w) => spreadIndex().has(w);   // הצורה עצמה כתובה על חלקיק כלשהו
const bareLabel = (w) => (known(w) ? w : (stripLead(w).slice(1).find(known) || w));   // «לעמותה» ⇒ «עמותה» רק אם «עמותה» כתובה ו-«לעמותה» לא
const prefixed = (w) => stripLead(w).slice(1).some((f) => f.length >= 3 && known(f));   // «לתורם»/«במייל»: גם הצורה בלי האות הפותחת כתובה ⇒ נושאת אות-יחס
const bareObj = (w) => (stripLead(w).slice(1).find((f) => f.length >= 3 && known(f)) || w);
/** רמז-מין למילה מהקטלוג בלבד: 'act' = כתובה בעיקר על חלקיקי-חישוב · 'thing' = על חלקיקי-ציור/נתונים · 'ask' = לא כתובה בשום מקום */
export function hintOf(w) {
  const x = entryOf(w); if (!x) return { hint: 'ask', ops: [] };
  const l = x.e.logic.size, d = x.e.display.size + x.e.data.size;
  return l > 0 && l >= d ? { hint: 'act', ops: [...x.e.logic] } : { hint: 'thing', ops: [...x.e.display] };
}
const isNum = (w) => /^\d+$/.test(w);
const COND_WHEN = (() => { try { const c = JSON.parse(fs.readFileSync(R.GEN_DIR + 'knowledge/conditions.json', 'utf8')); return c.when && c.when.length ? new RegExp('(' + c.when.map((x) => String(x).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')') : null; } catch { return null; } })();   // אותה מילת-תנאי של הגלאי
const STAGE_WORDS = (() => { try { return new Set(JSON.parse(fs.readFileSync(R.GEN_DIR + 'spec-lang.data.json', 'utf8')).stagePrefixes || []); } catch { return new Set(); } })();   // מילות-«שלבים» של שפת-הספק הקיימת (דאטה של מנוע 4)
const ARROW = /\s*(?:→|->|⇒|»)\s*/;   // חץ בין מילים = סדר (צורה): «חדשה → בעבודה → הושלמה» ⇒ שלבים
// סמני-שדות ומילות-«כל» של מנוע-המשפט הקיים (nl-lang.data.json — דאטה של מנוע 1/4): «לכל תלמיד יש …» ⇒ הדבר = «תלמיד», וכל איברי-הרשימה = שדות (גם ברבים)
const NL = (() => { try { const d = JSON.parse(fs.readFileSync(R.GEN_DIR + 'nl-lang.data.json', 'utf8')); return { marks: new Set(d.fieldMarks || []), each: new Set(d.eachWords || []), leadins: new Set(d.leadins || []) }; } catch { return { marks: new Set(), each: new Set(), leadins: new Set() }; } })();
// הפלוסים של המחולל השני (gen/lang.mjs, extra): מילות-«ות» שהן יחיד («כמות», «נוכחות», «עלות») ומילות-פתיחה נוספות («גם») — דאטה של מנוע קיים, נקרא בלי כתיבה
const GEN_EXTRA = (() => { try { return (JSON.parse(fs.readFileSync(path.join(R.ROOT, 'gen/lang.data.json'), 'utf8')).extra) || {}; } catch { return {}; } })();
for (const w of GEN_EXTRA.leadins || []) NL.leadins.add(w);
const SINGULAR = new Set(GEN_EXTRA.singular || []);
const isMark = (w) => NL.marks.has(w);
const isLeadin = (w) => NL.leadins.has(w);   // «יש גם שכונה» ⇒ «גם» = מילת-פתיחה של מנוע-המשפט, לא חלק מתווית-השדה
const isEach = (w) => stripLead(w).some((f) => NL.each.has(f));   // «לכל» ⇒ «כל»
const cleanHead = (run) => { let a = [...run]; while (a.length > 1 && isMark(a[a.length - 1])) a.pop(); while (a.length > 1 && isEach(a[0])) a.shift(); return a; };
const enumOf = (it) => { const g = it.find((w) => w.includes('/')); return g ? g.split('/').filter(Boolean).map((v) => v.replace(/_/g, ' ')) : null; };   // «חבר_קהילה» ⇒ «חבר קהילה»   // איבר עם «/» ⇒ ערכים-מותרים
const deVav = (it) => (it.length && /^ו[֐-׿]{2,}/.test(it[0]) ? [it[0].slice(1), ...it.slice(1)] : it);   // (ב) «ו»-החיבור על ראש איבר

// ── רשימה בקטע: חלקי-פסיק; «X וY» נחצה ב-«ו» (ב); מילים מפוזרות בראש איבר עוברות ל«לפני» ──
function listOf(segment) {
  let parts = segment.split(/[,،]/).map((p) => toks(p)).filter((p) => p.length);
  if (!parts.length) return null;
  const last = parts[parts.length - 1];
  const vi = last.findIndex((w, i) => i > 0 && /^ו[֐-׿]{2,}/.test(w));
  if (vi > 0) { parts[parts.length - 1] = last.slice(0, vi); parts.push([last[vi], ...last.slice(vi + 1)]); }
  if (parts.length < 2) return null;
  // חלק ארוך (≥3 מילים) אחרי הראשון = פסוקית חדשה, לא איבר («ניהול משימות, לכל משימה כותרת, …») ⇒ הרשימה נחתכת לפניו
  // ראש עם סמן-שדות ⇒ כל החלקים הם שדות (אין חיתוך לפסוקית); אסימון-ערכים («רווק/נשוי/אלמן») אינו נספר כמילה («מצב משפחתי רווק/נשוי» = שדה, לא פסוקית)
  const headMarked = parts[0].some(isMark);
  const cutAt = headMarked ? -1 : parts.findIndex((p, i) => i > 0 && deVav(p).filter((w) => !isSpreadTok(w) && !w.includes('/')).length >= 3);
  let rest = null;
  if (cutAt > 0) { rest = parts.slice(cutAt).map((p) => p.join(' ')).join(', '); parts = parts.slice(0, cutAt); if (parts.length < 2) return { rest, only: true, head: parts[0] }; }
  const first = parts[0];
  let cut = -1;
  const mi = first.findIndex(isMark);   // סמן-שדות בראש («לכל שיעור במערכת יש כיתה») = סוף-הראש, גם כשמילה מפוזרת («במערכת») יושבת לפניו
  if (mi >= 0 && mi < first.length - 1) cut = mi + 1;
  else for (let i = 0; i < first.length - 1; i++) if (isSpreadTok(first[i])) cut = i + 1;   // האיבר עצמו (המילה האחרונה) לעולם אינו «מפוזר»
  if (cut < 0) cut = first.length - 1;   // אין מילה מפוזרת לפני ⇒ האיבר = המילה האחרונה בלבד («לרכב יש יצרן» ⇒ «יצרן»)
  let before = first.slice(0, cut), item0 = first.slice(cut);
  if (item0.length > 1 && isMany(item0[item0.length - 1]) && !/י$/.test(item0[0])) { before = [...before, ...item0.slice(0, -1)]; item0 = item0.slice(-1); }   // «לניהול לקוחות» ⇒ האיבר «לקוחות»
  const dropped = [];
  const markedHead = before.some(isMark);   // ראש עם סמן-שדות («לכל אדם יש») ⇒ האיברים הם תוויות-שדה של הבעלים — לא גוזמים מהם מילים «מפוזרות» («שם האם» נשאר «שם האם»)
  const items = [item0, ...parts.slice(1)].map(deVav).map((it) => { let k = 0; while (k < it.length - 1 && (markedHead ? isLeadin(it[k]) : isSpreadTok(it[k]))) dropped.push(it[k++]); return it.slice(k); }).filter((it) => it.length);   // «כמה עזבו» ⇒ «עזבו»; «כמה» ⇒ מסגרת
  return { before, items, rest, dropped };
}

// ── צורת-הצורך של משפט ──
// דוגמאות של הבעלים (צורה): «למשל: משה, ב, 80; שרה, ג, 40.» — עד נקודה-ורווח או סוף המשפט; רשומות ב-';', ערכים ב-','. המילים מ-spec-lang (exampleWords).
const EX_WORDS = (() => { try { return JSON.parse(fs.readFileSync(R.GEN_DIR + 'spec-lang.data.json', 'utf8')).exampleWords || []; } catch { return []; } })();
function splitExamples(text) {
  if (!EX_WORDS.length) return { text, examples: [] };
  const re = new RegExp(`\\s*(?:${EX_WORDS.join('|')})\\s*:?\\s*(.+?)(?=\\.(?:\\s|$)|$)`, 'g');
  const examples = [];
  let removed = 0;   // המיקום נמדד על הטקסט **אחרי** הסרת הדוגמאות הקודמות — אחרת הדוגמה השנייה «נופלת» על הישות האחרונה (הבאג: כל הדוגמאות נדבקו ל«הכרעה»)
  const out = text.replace(re, (m, body, offset) => { const records = body.split(';').map((r) => r.split(/[,،]/).map((v) => v.trim()).filter(Boolean)).filter((r) => r.length); if (records.length) examples.push({ at: offset - removed, records }); removed += m.length; return ''; });
  return { text: out, examples };
}
export function formOf(sentence0) {
  const ex = splitExamples(String(sentence0 || '')); sentence0 = ex.text;
  // סוגריים אחרי מילה = ערכים-מותרים (צורה, כמו לוכסן): «שפה (עברית, יידיש, אנגלית)» ⇒ «שפה עברית/יידיש/אנגלית» ⇒ שדה «שפה» עם enum
  const sentence = String(sentence0 || '').replace(/\(([^()]*)\)/g, (m, inner) => { const vs = inner.split(/[,،]/).map((s) => s.trim().replace(/\s+/g, '_')).filter(Boolean); return vs.length > 1 ? ' ' + vs.join('/') + ' ' : m; });
  const words = toks(sentence);
  const segments = sentence.split(/[:;]|\.(?=\s|$)/).map((s) => s.trim()).filter(Boolean);   // «.» בסוף/לפני רווח = מפריד (כמו «:»)
  const things = [];   // { label, many, fields:[{label}], under, src, refs, acts, values }
  const frame = [];    // מילים מפוזרות (מסגרת/קישור) — מדווחות, לא מפורשות
  const find = (w) => things.find((t) => toks(t.label).some((lw) => stripLead(stem(w)).some((f) => f.length >= 3 && f === stem(lw))));   // «לרכב» ⇔ «ניהול רכבים»: כל מילה בתווית; גזע ≥3 אותיות («כמ» לא)
  // רצף מילים נמוכות-פיזור ⇒ יחידה: מילים שהקטלוג מצביע בהן לחישוב = עשייה-מוצעת; השאר = דבר; מספר צמוד = ערך
  const unitOf = (run, src, under = null) => {
    const acts = [], plain = [], values = [], asks = [], kinds = [];
    for (let i = 0; i < run.length; i++) { const w = run[i];
      if (isNum(w)) { values.push({ num: +w, unit: run[i + 1] && !isNum(run[i + 1]) ? run[i + 1] : null }); continue; }
      plain.push(w); const h = hintOf(w); if (h.hint === 'act') acts.push({ word: w, ops: h.ops.slice(0, 3) }); else if (h.hint === 'ask') asks.push(w); else if (h.ops.length) kinds.push({ word: w, ops: h.ops.slice(0, 4) }); }   // התווית נשארת שלמה; הרמזים = הערות עליה, לא מחיקה ממנה. kinds: «תמונה» ⇒ מיני-ציור שכתוב עליהם
    const label = plain.length ? plain.join(' ') : run.join(' ');   // התווית = המילים שלך כמו שכתבת («מטופלים» לא הופך ל«טופל»); הסרת-אות משמשת להשוואה בלבד
    // יחס לפי מיקום (אפס דקדוק): נושא = המילה הראשונה · מושא = המילה הבאה שהקטלוג מכיר כדבר או שצורתה רבים · מה שביניהן = היחס
    let rel = null;
    if (plain.length >= 2) {
      // מושא = המילה הבאה שהיא דבר לפי צורה: רבים · מוכרת-לקטלוג-כדבר · או נושאת אות-יחס (bareLabel שונה מהמילה: «לתורם»⇒«תורם», «במייל»⇒«מייל»)
      let j = 1; while (j < plain.length && !(hintOf(plain[j]).hint === 'thing' || isMany(plain[j]) || prefixed(plain[j]))) j++;
      let object = j < plain.length ? plain[j] : null, words = plain.slice(1, object ? j : plain.length);
      if (!object && values.length) object = values.map((v) => v.num + (v.unit ? ' ' + v.unit : '')).join(', ');   // אין מושא-מילה ⇒ הערך הוא המושא («מעל 200 שקל»)
      if (words.length) rel = { subject: plain[0], words, object: object || null, proposal: [...new Set(words.flatMap((w) => hintOf(w).ops))].slice(0, 3) };
    }
    return { label, many: plain.length ? isMany(plain[plain.length - 1]) : false, fields: [], under, src, acts, values, asks, kinds, rel };
  };
  // מילת-הצהרה של שפת-הספק (שרת · עיצוב) פותחת רצף משלה — כמו מילה מפוזרת, אבל היא נשארת ברצף (ההצהרה = המילה + הערך): «ניהול לקוחות בעיצוב נייר» ⇒ [ניהול לקוחות] [בעיצוב נייר]
  const runsOf = (ws) => { const runs = []; let cur = []; for (let i = 0; i < ws.length; i++) { const w = ws[i]; const n = multiDeclAt(ws, i); if (n) { cur.push(...ws.slice(i, i + n)); i += n - 1; continue; } if (!isNum(w) && isSpreadTok(w)) { if (cur.length) runs.push(cur); cur = []; frame.push(w); } else if (isDeclWord(w) && cur.length) { runs.push(cur); cur = [w]; } else cur.push(w); } if (cur.length) runs.push(cur); return runs; };   // מספר לעולם אינו «מפוזר» — נשאר ברצף כערך
  const queue = [...segments];
  while (queue.length) { const seg = queue.shift();
    // ── שלבים לפי צורה (העיקרון של מחזור-חיים, מהמילים של הבעלים בלבד): ──
    // (א) קטע = מילת-«שלבים» של שפת-הספק והקטע הבא הוא רשימה ⇒ איברי-הרשימה = שלבי הדבר האחרון (עם שדות, ואם אין — האחרון)
    const segToks = toks(seg);
    if (segToks.length === 1 && STAGE_WORDS.has(segToks[0]) && queue.length && things.length) {
      const nxt = queue.shift(); const parts = nxt.split(ARROW).flatMap((p) => p.split(/[,،]/)).map((p) => deVav(toks(p))).filter((p) => p.length);
      const owner = [...things].reverse().find((t) => t.fields.length) || things[things.length - 1];
      owner.stages = parts.map((p) => p.join(' ')); owner.stagesWord = segToks[0]; frame.push(segToks[0]); continue; }
    // (ב) חץ בתוך הקטע: «משימות עם מצב חדשה → בעבודה → הושלמה» ⇒ המילה שלפני החץ הראשון = שלב 1; הרצף שלפניה = הדבר
    const ar = seg.split(ARROW);
    if (ar.length >= 2 && ar.every((p) => toks(p).length)) {
      const head = toks(ar[0]); const runs = runsOf(head); const last = runs.length ? runs[runs.length - 1] : [];
      const st0 = last[last.length - 1]; const ownerRun = last.length > 1 ? last.slice(0, -1) : (runs.length > 1 ? runs[runs.length - 2] : []);
      for (const r of runs.slice(0, -1)) { if (r === ownerRun) continue; const hit = r.length === 1 ? find(r[0]) : null; if (hit) (hit.refs = hit.refs || []).push(...r); else things.push(unitOf(r, seg)); }
      let owner = ownerRun.length ? (find(ownerRun[ownerRun.length - 1]) || null) : null;
      if (!owner && ownerRun.length) { owner = unitOf(ownerRun, seg); things.push(owner); }
      if (!owner) owner = things[things.length - 1];
      if (owner) { owner.stages = [st0, ...ar.slice(1).map((p) => toks(p).join(' '))]; continue; }
    }
    // קטע-תנאי (מילת-תנאי מהדאטה, knowledge/conditions.json): יחידה אחת, בלי רשימת-שדות — «כשתלמיד ותיק» אינו «כשתלמיד ו-תיק» (הכרעת-בעלים 23.9). המסלול נקבע בדלת (capability/none)
    if (COND_WHEN && COND_WHEN.test(seg)) { things.push(unitOf(toks(seg), seg)); continue; }
    let L = listOf(seg), head = null; if (L && L.rest) { queue.unshift(L.rest); if (L.only) { head = L.head; L = null; } }
    const pre = L ? L.before : (head || toks(seg));
    const runs = (L && pre.some(isMark)) ? [pre] : runsOf(pre);   // ראש-רשימה עם סמן-שדות = רצף אחד גם עם מילה מפוזרת בפנים («לכל תפקיד של אדם יש» ⇒ הדבר «תפקיד של אדם»)
    const attachOrPush = (run, under = null) => { const hit = run.length === 1 ? find(run[0]) : null; if (hit) (hit.refs = hit.refs || []).push(...run); else things.push(unitOf(run, seg, under)); };   // מילה בודדת שמצביעה על דבר קיים = הפניה; אחרת יחידה משלה. אף מילה לא נעלמת
    if (L) L.dropped.forEach((w) => frame.push(w));
    if (!L) {   // קטע בלי רשימה: כל רצף = יחידה; רצף, מילת-קישור אחת, רצף ⇒ השני הוא **תוכן** של הראשון («תמונה של חתול»: «חתול» = הכיתוב של «תמונה»)
      const before = things.length; for (const run of runs) attachOrPush(run);
      const made = things.slice(before);
      if (made.length === 2 && runs.length === 2) { const gap = pre.slice(pre.indexOf(runs[0][runs[0].length - 1]) + 1, pre.indexOf(runs[1][0])); if (gap.length === 1) { made[0].content = made[1].label; made[0].via = gap[0]; made[1].contentOf = made[0].label; } }
      continue; }
    // רשימה: הרצף הצמוד לרשימה = ההורה; רצפים קודמים = יחידות משלהן («תעשה לי» ⇒ יחידה עם שאלות)
    // רצף-הצהרה צמוד לרשימה אינו ההורה של האיברים («משימות בעיצוב כהה עם כותרת ותאריך» ⇒ ההורה: משימות; ההצהרה = יחידה משלה)
    let runs2 = runs, declRun = null; if (runs2.length > 1 && isDeclItem(runs2[runs2.length - 1])) { declRun = runs2[runs2.length - 1]; runs2 = runs2.slice(0, -1); }
    const run = runs2.length ? runs2[runs2.length - 1] : [];
    for (const r of runs2.slice(0, -1)) attachOrPush(r);
    if (declRun) things.push(unitOf(declRun, seg));
    let owner = null; for (let j = run.length - 1; j >= 0 && !owner; j--) owner = find(run[j]) || null;   // מילה כלשהי ברצף מזהה הורה קיים («לרכב יש» ⇒ «רכבים»)
    if (owner) (owner.refs = owner.refs || []).push(...run);
    let created = false;
    if (!owner && run.length) { owner = unitOf(run, seg); things.push(owner); created = true; }
    // ראש-רשימה עם סמן-שדות («לכל תלמיד יש», «משפחה עם») ⇒ הדבר = הראש בלי «לכל»/«יש» (המילים נשמרות ב-head), וכל האיברים = שדות — גם ברבים («שעות», «רגישויות»)
    //   רק לדבר שנולד מהראש הזה — «לרכב יש …» שמצביע על «ניהול רכבים» קיים אינו משנה את שמו
    const marked = owner && run.some(isMark);
    if (marked && created) { const c = cleanHead(run); if (c.length && c.join(' ') !== owner.label) { owner.head = owner.label; owner.label = c.join(' '); } owner.fieldsHead = true; }
    const manyItems = L.items.filter(itemMany).length, oneItems = L.items.length - manyItems;
    for (const it of L.items) {
      if (!marked && (itemMany(it) || (oneItems === 0) || manyItems > oneItems)) {   // רוב-רבים ⇒ גם היחיד ברשימה הוא דבר («… עובדים, ציוד ובטיחות»)
        const hit = find(it[0]); if (hit) (hit.refs = hit.refs || []).push(...it); else things.push({ ...unitOf(it, seg, owner ? owner.label : null), many: itemMany(it) }); }
      else if (isDeclItem(it)) things.push(unitOf(it, seg));   // איבר-הצהרה ברשימה («עם שרת בענן ועיצוב כהה») = יחידה משלו, לא שדה
      else if (owner) { const ev = enumOf(it); const lbl = ev ? it.filter((w) => !w.includes('/')).join(' ') : ''; owner.fields.push({ label: lbl || it.join(' ').replace(/\//g, ' '), enumVals: ev }); }   // «שפה עברית/יידיש/אנגלית» ⇒ תווית «שפה», ערכים {…}
      else things.push(unitOf(it, seg));
    }
  }
  // הדוגמאות ⇒ הישות-עם-שדות האחרונה שלפניהן במשפט (צורה: מה שקרוב); אין כזו ⇒ מדווח (הדלת שואלת), לא מומצא
  const orphan = [];
  const ARROWS = (() => { try { return JSON.parse(fs.readFileSync(R.GEN_DIR + 'spec-lang.data.json', 'utf8')).pairArrow || []; } catch { return []; } })();   // «אבג ⇒ 6»: דוגמת קלט⇒פלט (צורה: חץ מהדאטה)
  for (const e of ex.examples) { const before = String(sentence0).slice(0, e.at);
    if (ARROWS.length && e.records.every((r) => r.length === 1 && ARROWS.some((a) => r[0].includes(a)))) {   // דוגמאות-חץ ⇒ הדבר הקרוב שלפניהן (גם בלי שדות): קלט⇒פלט להרכבת-התנהגות
      const t0 = [...things].reverse().find((x) => before.includes(x.src)); if (t0) { t0.ioExamples = (t0.ioExamples || []).concat(e.records.map((r) => { const a = ARROWS.find((z) => r[0].includes(z)); const [i, o] = r[0].split(a); return [i.trim(), o.trim()]; })); continue; } }
    const t = [...things].reverse().find((x) => x.fields.length && before.includes(x.src)); if (t) t.examples = (t.examples || []).concat(e.records); else orphan.push(e.records); }
  return { sentence, words, segments, things, frame: [...new Set(frame)], examplesOrphan: orphan };
}

// ── תשובה לדבר: לפי התווית המדויקת, ואם אין — מפתח שמילה שלו מתאימה לפי גזע («הצבעות» ⇔ «ניהול הצבעות») ──
export function answerFor(t, answers = {}) {
  if (answers[t.label]) return answers[t.label];
  const st = (w) => stripLead(stem(w)).filter((f) => f.length >= 3);
  const lw = toks(t.label).flatMap(st);
  // כל מילות-המפתח חייבות להתאים; המפתח עם הכי הרבה מילים-תואמות מנצח («הצבעה נסגרת» גובר על «הצבעות» ליחידה «הצבעה נסגרת אחרי שבוע»)
  let best = null, bestN = 0;
  for (const k of Object.keys(answers)) { const kw = toks(k); const n = kw.filter((w) => st(w).some((f) => lw.includes(f))).length; if (n === kw.length && n > bestN) { best = k; bestN = n; } }
  return best ? answers[best] : {};
}

// ── שאלות סגורות: מה שהצורה לא אמרה ──
export function questionsFor(form, answers = {}) {
  const qs = [];
  for (const t of form.things) {
    const a = answerFor(t, answers);
    if (a.many == null) qs.push({ thing: t.label, ask: 'many', proposal: t.many, options: [true, false] });
    if (!t.fields.length && !(a.fields && a.fields.length)) qs.push({ thing: t.label, ask: 'fields', options: TYPES });
    for (const f of t.fields) { const af = (a.fields || []).find((x) => x.label === f.label); if (!af || !af.type) qs.push({ thing: t.label, ask: 'type', field: f.label, options: TYPES }); }
    if (!(a.acts && a.acts.length)) qs.push({ thing: t.label, ask: 'acts', options: ACTS, proposal: (t.acts || []).map((x) => x.word) });
    for (const k of (t.kinds || [])) if (!(a.kind)) qs.push({ thing: t.label, ask: 'kind', word: k.word, proposal: k.ops, options: [...k.ops, 'other', 'skip'] });   // «תמונה» כתובה על חלקיקי container/group/text ⇒ הצעת-מין
    const inRel = new Set(t.rel ? t.rel.words : []);
    if (t.rel && !a.rel) qs.push({ thing: t.label, ask: 'rel', subject: t.rel.subject, words: t.rel.words, object: t.rel.object, objectOptions: t.rel.object ? [] : form.things.filter((x) => x !== t).map((x) => x.label), proposal: t.rel.proposal, options: ['ref', 'act', 'cond', 'value', 'skip'] });   // אין מושא ⇒ הדברים האחרים במשפט כאפשרויות   // «A» —מילים→ «B»: מצביע / פעולה / תנאי / ערך / דלג
    for (const w of (t.asks || [])) if (!inRel.has(w)) qs.push({ thing: t.label, ask: 'word', word: w, options: ['thing', 'act', 'field', 'skip'] });   // מילה שאינה כתובה על שום חלקיק
    for (const x of (t.acts || [])) if (!inRel.has(x.word)) qs.push({ thing: t.label, ask: 'act', word: x.word, proposal: x.ops });
    for (const f of (a.fields || [])) if (f.type === 'ref' && !f.to) qs.push({ thing: t.label, ask: 'ref', field: f.label, options: form.things.map((x) => x.label) });
  }
  return qs;
}

// ── צורה ⇒ בקשות למנוע 3 (op + שקעים בשמות הקטלוג). רק ממה שנענה. ──
export function needsFrom(form, answers = {}) {
  const needs = [];
  for (const t of form.things) {
    const a = answerFor(t, answers); if (!Object.keys(a).length) { if (t.kinds && t.kinds.length) for (const k of t.kinds) needs.push({ thing: t.label, act: 'kind', op: k.ops[0], need: ['fields'], goal: k.word, word: k.word, content: t.content || null }); continue; }
    if (t.kinds && t.kinds.length && !(a && a.acts)) for (const k of t.kinds) needs.push({ thing: t.label, act: 'kind', op: k.ops[0], need: ['fields'], goal: k.word, word: k.word, content: t.content || null });   // «תמונה» ⇒ חלקיק שכתוב עליו «תמונה», עם הכיתוב «חתול»; תשובת-בעלים גוברת
    if (!a || !a.acts) continue;
    const fields = (a.fields && a.fields.length) ? a.fields : t.fields.map((f) => ({ label: f.label, type: 'text' }));
    const nums = fields.filter((f) => f.type === 'num').length;
    for (const act of a.acts) {
      if (act === 'list') needs.push({ thing: t.label, act, op: 'group', need: ['items', 'fields'], goal: t.label });
      if (act === 'one') needs.push({ thing: t.label, act, op: 'fact', need: ['fields', 'label'], goal: t.label, shape: { str: fields.length - nums, num: nums } });
      if (act === 'add' || act === 'edit') { for (const f of fields) needs.push({ thing: t.label, act, field: f.label, type: f.type || 'text', op: 'field', need: ['label', 'value', 'onChanged'], goal: f.label }); needs.push({ thing: t.label, act, op: 'action', need: ['label', 'onTap'], goal: t.label }); }
      if (act === 'del') needs.push({ thing: t.label, act, op: 'action', need: ['label', 'onTap'], goal: t.label });
      if (act === 'sum') needs.push({ thing: t.label, act, op: 'stat', need: ['value', 'label'], goal: t.label });
      if (act === 'search') needs.push({ thing: t.label, act, op: 'search', need: ['value', 'onChanged'], goal: t.label });
      if (act === 'filter') needs.push({ thing: t.label, act, op: 'filter', need: ['selected', 'onTap'], goal: t.label });
      if (act === 'empty') needs.push({ thing: t.label, act, op: 'empty', need: ['message'], goal: t.label });
      if (act === 'export') needs.push({ thing: t.label, act, op: 'action', need: ['label', 'onTap'], goal: t.label });
    }
    for (const f of fields) if (f.type === 'ref' && f.to) needs.push({ thing: t.label, act: 'ref', field: f.label, to: f.to, op: null });
    if (a.rel && t.rel) {   // יחס שנענה: מצביע ⇒ קישור · פעולה ⇒ כפתור · תנאי ⇒ חלקיק-בדיקה לפי מילות-הבעלים (coverLogic) · ערך ⇒ מספר בולט
      const goal = t.rel.words.join(' ');
      if (a.rel === 'ref') needs.push({ thing: t.label, act: 'ref', to: t.rel.object, op: null });
      if (a.rel === 'act') needs.push({ thing: t.label, act: 'act', op: 'action', need: ['label', 'onTap'], goal });
      if (a.rel === 'cond') needs.push({ thing: t.label, act: 'cond', op: 'predicate', need: [], goal });
      if (a.rel === 'value') needs.push({ thing: t.label, act: 'value', op: 'stat', need: ['value', 'label'], goal });
    }
  }
  return needs;
}

// ── צורה ⇒ אפיון למנוע 4 (app-ds.buildApp): `ישות <דבר> עם <שדות>` · `לוח בקרה עם מונה(<דבר>)` · `תפקיד בודק: הכל`.
//    דבר בלי שדות (לא מהמשפט ולא מתשובה) אינו נכנס — app-ds פוסל ישות-בלי-שדות (§22), והמנוע שואל במקום להמציא. ──
// הצהרת-שרת לפי צורה: דבר שמילותיו נושאות את מילת-השרת ואת אחד מערכי-השרת של שפת-הספק (spec-lang: שרת · ענן) ⇒ `שרת: ענן`. בלי ההצהרה — אין שרת (לא ברירת-מחדל).
// אותו דפוס להצהרת-עיצוב (spec-lang: עיצוב · נייר/כהה — העורות של מנועי-העיצוב ds-* שכבר על המדף): «בעיצוב נייר» ⇒ `עיצוב: נייר` ⇒ app-ds.setLook.
const SL_DECL = (() => { try { const d = JSON.parse(fs.readFileSync(R.GEN_DIR + 'spec-lang.data.json', 'utf8')); return { server: { word: d.serverWord, values: Object.keys(d.servers || {}) }, look: { word: d.lookWord, values: Object.keys(d.looks || {}) } }; } catch { return { server: { word: null, values: [] }, look: { word: null, values: [] } }; } })();
const SL_SERVER = SL_DECL.server;
const DECLS = [SL_DECL.server, SL_DECL.look].filter((d) => d.word);
const isDeclWord = (w) => DECLS.some((d) => stripLead(w).includes(d.word));                                   // «בעיצוב» ⇒ «עיצוב»
// מילת-הצהרה או ערך-הצהרה של שפת-הספק לעולם אינם «מפוזרים» — הם אוצר-המילים המבני של מנוע 4 (נמדד: «עיצוב» 15 מינים · «כהה» 14 ⇒ היו נופלים למסגרת)
const isDeclTok = (w) => DECLS.some((d) => stripLead(w).some((f) => f === d.word || d.values.includes(f)));
const isSpreadTok = (w) => isSpread(w) && !isDeclTok(w);
const isDeclItem = (ws) => DECLS.some((d) => ws.some((w) => stripLead(w).includes(d.word)) && (ws.some((w) => d.values.some((v) => stripLead(w).includes(v))) || d.values.some((v) => v.includes(' ') && ws.join(' ').includes(v))));
// ערך-הצהרה רב-מילי («בנייה חכמה») = רצף אחד: המילים שלו לא נחתכות ולא מפוזרות בתוך ההצהרה — אבל כל מילה לבדה («בנייה») נשארת מילה רגילה בכל מקום אחר
const MULTI_DECL = DECLS.flatMap((d) => d.values.filter((v) => v.includes(' ')).map((v) => v.split(' ')));
const multiDeclAt = (ws, i) => (MULTI_DECL.find((m) => m.every((x, k) => ws[i + k] !== undefined && stripLead(ws[i + k]).includes(x))) || []).length;
function declOf(form, decl, skip = null) {
  if (!decl.word) return null;
  const has = (t, w) => w.includes(' ') ? String(t.label).includes(w) : toks(t.label).some((x) => stripLead(x).includes(w));   // ערך רב-מילי («בנייה חכמה») = רצף בתווית
  const t = form.things.find((t) => t !== skip && has(t, decl.word) && decl.values.some((v) => has(t, v)));
  if (!t) return null;
  const value = decl.values.find((v) => has(t, v));
  const vw = value.split(' ');   // מה שנשאר בהצהרה אחרי המילה והערך («בעיצוב נייר טורקיז» ⇒ «טורקיז») עובר כמו-שהוא לשורת-הספק — app-ds מכריע (ערכה מהדאטה / שאלה)
  const extra = toks(t.label).filter((x) => !stripLead(x).includes(decl.word) && !vw.some((v) => stripLead(x).includes(v))).join(' ') || null;
  return { thing: t, value, extra };
}
export function serverDeclOf(form) { return declOf(form, SL_DECL.server); }
export function lookDeclOf(form) { return declOf(form, SL_DECL.look, (serverDeclOf(form) || {}).thing || null); }
/** ראש-המשפט (צורה, לא משמעות): מה שלפני הנקודתיים הראשונות = השלם שכל השאר בתוכו. «ניהול מוסד: לכל תלמיד יש…» ⇒ ראש «ניהול מוסד».
 *  הראש = הדברים של הקטע הראשון בלי הצהרות (עיצוב/שרת). אין נקודתיים ⇒ אין ראש (לא ממציאים שם). */
export function headOf(form) {
  const s = String(form.sentence || ''); const ci = s.indexOf(':'); if (ci <= 0) return null;
  const seg0 = s.slice(0, ci).trim(); if (!form.segments.length || form.segments[0] !== seg0) return null;
  const decl = new Set([serverDeclOf(form), lookDeclOf(form)].filter(Boolean).map((d) => d.thing));
  const head = form.things.filter((t) => t.src === seg0 && !decl.has(t)).map((t) => t.label).join(' ').trim();
  return head || null;
}
export function specOf(form, answers = {}) {
  const lines = [], skipped = [], builtin = [];
  const srv = serverDeclOf(form), lk = lookDeclOf(form);
  const decl = new Set([srv && srv.thing, lk && lk.thing].filter(Boolean));
  const head = headOf(form);
  const ents = form.things.filter((t) => !decl.has(t) && (t.many || t.fields.length || (answerFor(t, answers).fields)));
  const names = new Set(ents.map((t) => t.label));
  for (const t of ents) {
    const a = answerFor(t, answers);
    const fields = (a.fields && a.fields.length) ? a.fields.map((f) => f.label + (f.enumVals ? `{${f.enumVals.join('|')}}` : '')) : t.fields.map((f) => f.label + (f.enumVals ? `{${f.enumVals.join('|')}}` : ''));   // {א|ב|ג} = בחירה-אחת-מכמה ⇒ entity.mjs ⇒ צ'יפים
    const refs = (a.fields || []).filter((f) => f.type === 'ref' && f.to && names.has(f.to)).map((f) => f.to);
    // יחס לפי צורה: «הזמנות של לקוחות» (רצף, מילת-קישור אחת, רצף) ⇒ להזמנות שדה «לקוחות» כשגם הוא ישות; app-ds מזהה בו קשר (relOf)
    if (t.content && names.has(t.content) && t.content !== t.label && !fields.some((f) => f === t.content)) fields.push(t.content);
    const all = [...new Set([...fields, ...refs])];
    if (!all.length && !(t.stages && t.stages.length)) { skipped.push(t.label); continue; }
    // שלבים מהמילים של הבעלים ⇒ סעיף-שלבים של שפת-הספק (entity.mjs: BreadcrumbTrail + «קדם ל…»); בלי שלבים אין workflow (לא ברירת-מחדל)
    const stagesPart = t.stages && t.stages.length >= 2 ? ` | ${t.stagesWord || [...STAGE_WORDS][0]}: ${t.stages.join(', ')}` : '';
    lines.push(`ישות ${t.label} עם ${all.join(', ')}${stagesPart}`);
    if (t.examples && t.examples.length) { const SLx = JSON.parse(fs.readFileSync(R.GEN_DIR + 'spec-lang.data.json', 'utf8')); lines.push(`${SLx.exampleWord} ${t.label}: ${t.examples.map((r) => r.join(', ')).join('; ')}`); builtin.push(`${t.examples.length} דוגמאות של הבעלים ל«${t.label}» ⇒ רשומות`); }
  }
  // [פעולה]: יחס שהבעלים ענה עליו «פעולה» (או «תנאי» ⇒ חוק) על דבר שנכנס כישות
  for (const t of form.things) { const a = answerFor(t, answers); if (t.rel && a.rel === 'act') { const st = (w) => stripLead(stem(w)).filter((f) => f.length >= 3); const ent = ents.find((e) => toks(e.label).some((lw) => st(t.rel.subject).includes(stem(lw)))) || ents.find((e) => e.label === t.label); if (ent) lines.push(`חלקיק ${ent.label}: [פעולה] ${t.rel.words.join(' ')}`); } }
  // תגי-חלקיק מהתשובות (הטבלה הקיימת: shapeOf ⇒ compose-engine.ops): חיפוש · סינון · ריק · ייצוא · הודעה
  for (const t of ents) { const a = answerFor(t, answers); const acts = a.acts || [];
    if (acts.includes('search')) lines.push(`חלקיק ${t.label}: [חיפוש]`);   // הכרעה-33: מסך-החלקיקים מחווט חיפוש (particles.mjs); מסך-הישות נושא חיפוש משלו (render-ds:734)
    if (acts.includes('filter')) lines.push(`חלקיק ${t.label}: [סינון]`);
    if (acts.includes('empty')) lines.push(`חלקיק ${t.label}: [ריק] ${a.emptyText || t.label}`);   // טקסט = של הבעלים; אין ⇒ התווית, לא המצאה
    if (acts.includes('export')) {   // ייצוא = פעולה + מנוע-קישור שנבחר לפי **מילות-הבעלים** (G25). בלי מילים אין מנוע ⇒ שורת-חלקיק (הערה), לא המצאה
      if (a.exportGoal) { const SL = JSON.parse(fs.readFileSync(R.GEN_DIR + 'spec-lang.data.json', 'utf8')); lines.push(`דוח ${t.label}: [ייצוא] ${a.exportLabel || SL.pExport[0]} = ${a.exportGoal}`); }
      else lines.push(`חלקיק ${t.label}: [ייצוא]`);
    }
    if (acts.includes('message') && a.messages && a.messages.length) {   // הודעה = נוסחים של הבעלים (תוכן), על שדה-בחירה: `[הודעה] שדה = [תוכן קבוצה]` + שורות `תוכן`
      const ef = (a.fields || []).find((f) => f.enumVals) || t.fields.find((f) => f.enumVals);
      if (ef) { const g = `הודעה ${t.label}`; lines.push(`חלקיק ${t.label}: [הודעה] ${ef.label} = [תוכן ${g}]`); for (const m of a.messages) lines.push(`תוכן ${g}${m.tag ? ` [${m.tag}]` : ''}: ${m.text}`); }
    }
  }
  // לוח בקרה: מונה לכל ישות עם sum · סכום לכל שדה-מספר שלה
  const metrics = [];
  for (const t of ents) { const a = answerFor(t, answers); if (!(a.acts && a.acts.includes('sum'))) continue; metrics.push(`מונה(${t.label})`); for (const f of (a.fields || [])) if (f.type === 'num') metrics.push(`סכום(${t.label}.${f.label})`); }
  if (metrics.length) lines.push(`לוח בקרה עם ${metrics.join(', ')}`);
  // הראש ⇒ שם-האפליקציה (שורת appWord של שפת-הספק) + לוח-הבית על שמו (שורה שאינה ישות/תפקיד/הצהרה = לוח-בקרה ב-app-ds: אריח-מונה לכל ישות)
  if (head && lines.length) { const SL = JSON.parse(fs.readFileSync(R.GEN_DIR + 'spec-lang.data.json', 'utf8')); lines.unshift(`${SL.appWord}: ${head}`); if (!metrics.length) lines.push(head); builtin.push(`ראש «${head}» ⇒ ${SL.appWord} + לוח-הבית`); }
  if (lk && lines.length) lines.push(`${SL_DECL.look.word}: ${lk.value}${lk.extra ? ' ' + lk.extra : ''}`);   // הצהרת-עיצוב של הבעלים ⇒ app-ds.setLook (עור מהמדף); בלי הצהרה — ברירת-המחדל של app-ds
  if (srv && lines.length) lines.push(`${SL_SERVER.word}: ${srv.value}`);   // הצהרה של הבעלים ⇒ server.mjs פולט חבילת-שרת מאותן ישויות
  if (lines.length) lines.push('תפקיד בודק: הכל');
  return { spec: lines.join('\n'), skipped, builtin };
}

// ── צרכי-התנהגות למנוע-ההרכבה (behavior-plan.planNeeds): יחס שהבעלים ענה עליו ב-`behavior` ⇒ צורך בצורת NEEDS.
//    demand = מילות-הבעלים (נושא · מילות-היחס · מושא) · shape לפי סוג-השדות · params/ret/examples מהתשובה. בלי דוגמאות ⇒ שאלה, לא המצאה. ──
const SHAPE_OF_TYPE = { date: 'מועד', num: 'כסף', text: 'טקסט-חופשי', bool: 'בדיקה', ref: 'רשומות' };
export function needsFor(form, answers = {}) {
  const needs = {}, asks = [];
  for (const t of form.things) {
    const a = answerFor(t, answers); const b = a.behavior; if (!b) continue;   // תשובת-התנהגות על יחידה (עם או בלי יחס-מזוהה)
    const rel = t.rel || { subject: toks(t.label)[0] || t.label, words: toks(t.label).slice(1), object: t.content || null };
    const id = `${toks(t.label)[0]}.${toks(t.label).slice(1, 4).join('_') || 'need'}`;
    if (!(b.examples && b.examples.length)) { asks.push({ thing: t.label, ask: 'examples', rel }); continue; }
    const fieldType = (label) => { const f = (a.fields || []).find((x) => x.label === label) || form.things.flatMap((x) => (answerFor(x, answers).fields || [])).find((x) => x.label === label); return f ? f.type : null; };
    const shape = b.shape || SHAPE_OF_TYPE[fieldType(rel.object) || fieldType(rel.subject) || 'text'];
    const valueWords = (t.values || []).map((v) => v.unit).filter(Boolean);
    needs[id] = { shape, demand: [rel.subject, ...rel.words, rel.object || '', ...valueWords].filter(Boolean).join(' ') + (b.demand ? ' ' + b.demand : ''), params: b.params || ['String', 'String'], ret: b.ret || 'num', thing: t.label, ...(b.mid ? { mid: b.mid } : {}), behavior: b, examples: b.examples, ...(b.forbid ? { forbid: b.forbid } : {}), ...(b.consts ? { consts: b.consts } : {}), ...(b.clock ? { clock: b.clock } : {}) };   // consts/clock = של הבעלים (הסף «30» בא מהתשובה, לא מהמנוע)
  }
  return { needs, asks };
}
export async function planBehaviors(form, answers = {}) {
  const { needs, asks } = needsFor(form, answers);
  if (!Object.keys(needs).length) return { picks: {}, asks };
  const { planNeeds } = await import('../machtzev/generator/behavior-plan.mjs');
  const t0 = Date.now(); const P = planNeeds(needs, { prove: true });
  const picks = Object.fromEntries(Object.entries(P).map(([id, p]) => [id, { pick: p.pick || null, nodes: p.nodes || null, chain: p.chain || null, proven: !!p.proven, ties: p.ties || 0, top3: (p.top3 || []).slice(0, 3) }]));
  return { picks, asks, needs, ms: Date.now() - t0 };
}

// ── יומן תשובות: הצעה לפעם הבאה, לא עובדה ──
export function remember(label, answer, sentence) { const f = ANSWERS(); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.appendFileSync(f, JSON.stringify({ ts: new Date().toISOString(), label, sentence, answer }) + '\n'); }
export function recall(label) { const f = ANSWERS(); if (!fs.existsSync(f)) return null; const rows = fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)).filter((r) => r.label === label); return rows.length ? { proposal: rows[rows.length - 1].answer, times: rows.length } : null; }

export function mavin(sentence, { answers = {} } = {}) {
  const form = formOf(sentence);
  const proposals = Object.fromEntries(form.things.map((t) => [t.label, recall(t.label)]).filter(([, v]) => v));
  return { ...form, proposals, questions: questionsFor(form, answers), needs: needsFrom(form, answers) };
}

// ── סוג-הערך של חלקיק-שדה — נגזר ממה שהקוד עושה עם value (ממצא 22.9: הקטלוג והטיפוס המוצהר
//    לא מבדילים — DsToggleTile/DsDateField/DsNumberField כולם `String value`). צורות-קוד, לא מילים. ──
const KIND_RE = {
  date: /DateTime\.(tryParse|parse)\(\s*value|showDatePicker/,
  bool: /value\s*==\s*.true.|\bbool value\b|Switch\(|Checkbox\(/,
  num: /(num|int|double)\.(tryParse|parse)\(\s*value|TextInputType\.number|\b(int|num|double) (value|high|low)\b/,
  ref: /options\.contains\(\s*value|DropdownButton/,
};
const FIELD_NEAR = { field: ['search', 'switch'] };   // מינים-שכנים לשדה (כמו NEAR של cover — צורה, לא מילים)
let _kinds = null;
export function valueKinds() {
  if (_kinds) return _kinds;
  const map = JSON.parse(fs.readFileSync(R.GEN_DIR + 'ops-map.json', 'utf8'));
  _kinds = new Map();
  for (const a of map) { if (a.layer !== 'display') continue; let src = ''; try { src = fs.readFileSync(R.NEW + a.file, 'utf8'); } catch { continue; }
    let k = Object.entries(KIND_RE).filter(([, re]) => re.test(src)).map(([n]) => n);
    const fd = src.match(/fieldDemo = <String>\[([^\]]*)\]/);   // forge: אין value — הסוג מצורת חריץ-הדוגמה (ספרות ⇒ num · yyyy-mm-dd ⇒ date · on/off ⇒ bool)
    if (!k.length && fd) { const demo = [...fd[1].matchAll(/"([^"]*)"/g)].map((m) => m[1]); if (demo.some((d) => /^\d{4}-\d{2}-\d{2}/.test(d))) k.push('date'); else if (demo.some((d) => /^(on|off|true|false)$/i.test(d))) k.push('bool'); else if (demo.some((d) => /^[\d.,]+$/.test(d))) k.push('num'); }
    _kinds.set(a.id.split('@')[0], k.length ? k : ['text']); }
  return _kinds;
}
export const kindOf = (id) => valueKinds().get(String(id).split('@')[0]) || ['text'];

// ── צורה שנענתה ⇒ מנוע 3 (cover) · דיווח: אטום/חסר לכל בקשה. «חסר» מדווח, לא מזויף (§20-ג) ──
//    שדה עם סוג: מבין חלופות-cover נבחרת הראשונה שסוג-הערך שלה תואם; אין ⇒ missing כולל `type:<סוג>`.
export async function coverNeeds(needs) {
  const { cover } = await import('../machtzev/generator/cover.mjs');
  return needs.filter((n) => n.op).map((n) => {
    const c = cover({ op: n.op, need: n.need, goal: n.goal && n.act === 'cond' ? n.goal : '', k: (n.type || n.word) ? 12 : 3 });
    let atoms = c.atoms, missing = c.missing.slice(), alts = c.alts || [];
    if (n.word) {   // המילה כתובה על חלקיקים ⇒ הם קודמים לכל דירוג אחר (הכותרת של החלקיק = מה שמי-שכתב-אותו אמר)
      const named = m => { try { return toks(fs.readFileSync(R.NEW + m.file, 'utf8').split('\n').filter((l) => /^\s*\/\/\/?/.test(l)).slice(0, 4).join(' ')).includes(n.word); } catch { return false; } };
      const map = JSON.parse(fs.readFileSync(R.GEN_DIR + 'ops-map.json', 'utf8')).filter((x) => x.layer === 'display' && named(x)).sort((x, y) => x.sockets.length - y.sockets.length || x.id.localeCompare(y.id));   // כל מין; הפשוט (הכי פחות שקעים) קודם
      if (map.length) { atoms = [map[0].id]; alts = map.map((x) => x.id); }
    }
    if (n.type) {   // שדה עם סוג: החלופה הראשונה שסוג-ערכה תואם; אין ב-op ⇒ גם במין-השכן (ממצא: DsField יושב תחת 'search', לא 'field')
      let fit = alts.find((id) => kindOf(id).includes(n.type)), via = n.op;
      for (const near of (FIELD_NEAR[n.op] || [])) { if (fit) break; const c2 = cover({ op: near, need: n.need, goal: '', k: 12 }); fit = (c2.alts || []).find((id) => kindOf(id).includes(n.type)); if (fit) { via = near; alts = c2.alts; } }
      if (fit) { atoms = [fit]; n = { ...n, via }; } else missing.push('type:' + n.type);
    }
    return { ...n, atoms, alts: alts.slice(0, 3), missing };
  });
}

// ── CLI ──
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const ai = args.indexOf('--answers'); const answers = ai >= 0 ? JSON.parse(fs.readFileSync(args[ai + 1], 'utf8')) : {};
  const show = (s) => {
    const r = mavin(s, { answers });
    console.log(`\n«${s}»\n  מנוע 1: ${r.words.length} מילים · מסגרת/קישור (מפוזר ≥${SPREAD()} מ-${opsCount()} מינים): ${r.frame.map((w) => `${w}(${spreadOf(w).ops})`).join(' ') || '—'}`);
    for (const t of r.things) console.log(`  דבר «${t.label}» · ${t.many ? 'הרבה' : 'אחד'}${t.under ? ` · בתוך «${t.under}»` : ''}${t.fields.length ? ` · שדות: ${t.fields.map((f) => f.label).join(', ')}` : ''}${t.rel ? ` · יחס: «${t.rel.subject}» —${t.rel.words.join(' ')}→ ${t.rel.object ? `«${t.rel.object}»` : '?'}${t.rel.proposal.length ? ` (קטלוג: ${t.rel.proposal.join('/')})` : ''}` : ''}${t.values && t.values.length ? ` · ערכים: ${t.values.map((v) => v.num + (v.unit ? ' ' + v.unit : '')).join(', ')}` : ''}${t.kinds && t.kinds.length ? ` · הקטלוג מכיר: ${t.kinds.map((k) => `«${k.word}»⇒${k.ops.join('/')}`).join(' ')}` : ''}`);
    console.log(`  שאלות: ${r.questions.length} · ${r.questions.map((q) => q.ask + (q.field ? `(${q.field})` : '')).join(' ')}`);
    if (r.needs.length) console.log(`  בקשות למנוע 3: ${r.needs.map((n) => `${n.op || 'ref'}[${(n.need || []).join(',')}]←${n.thing}`).join(' · ')}`);
    return r;
  };
  const after = async (r) => {
    const B = await planBehaviors(r, answers);
    for (const [id, p] of Object.entries(B.picks || {})) console.log(`  מנוע-הרכבה · ${id} ⇒ ${p.pick || '∅'}${p.chain ? ` · שרשרת ${JSON.stringify(p.chain).slice(0, 80)}` : ''} · מוכח: ${p.proven ? 'כן' : 'לא'} · ${B.ms}ms`);
    for (const q of (B.asks || [])) console.log(`  ? דוגמאות ל-«${q.rel.subject}» —${q.rel.words.join(' ')}→ «${q.rel.object || '?'}»: תן קלט ⇒ פלט (למשל [["'2026-09-20', '2026-09-23'", "r == 3"]])`);
    if (!r.needs.length) return; for (const c of await coverNeeds(r.needs)) console.log(`  מנוע 3 · ${c.thing}/${c.act}${c.field ? `(${c.field})` : ''} · ${c.op} ⇒ ${c.atoms.join('+')} · חלופות: ${c.alts.join(', ')} · חסר: ${c.missing.length ? c.missing.join(',') : 'כלום'}`); };
  if (args.includes('--smoke')) {
    const sents = fs.readFileSync(R.GEN_DIR + 'nl-smoke.txt', 'utf8').split('\n').map((s) => s.trim()).filter(Boolean);
    let W = 0, T = 0, F = 0, Q = 0; for (const s of sents) { const r = show(s); W += r.words.length; T += r.things.length; F += r.things.reduce((n, t) => n + t.fields.length, 0); Q += r.questions.length; }
    console.log(`\nסה"כ · ${sents.length} משפטים · ${W} מילים · ${T} דברים · ${F} שדות מהמשפט · ${Q} שאלות`);
  } else await after(show(args.filter((a) => !a.startsWith('--') && a !== (ai >= 0 ? args[ai + 1] : null))[0] || ''));
}

