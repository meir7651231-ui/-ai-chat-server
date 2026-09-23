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
export const ACTS = ['list', 'one', 'add', 'edit', 'del', 'sum'];        // 6 צורות-עשייה
const ANSWERS = () => process.env.MAVIN_ANSWERS || path.join(R.ROOT, '.maimatai', 'mavin-answers.jsonl');

export const toks = (s) => [...String(s || '').matchAll(/[֐-׿]+(?:\s*\/\s*[֐-׿]+)+|[֐-׿]+|\d+|[A-Za-z]+/g)].map((m) => m[0].replace(/\s*\/\s*/g, '/'));   // «בעד/נגד/נמנע» = אסימון אחד: בחירה-אחת-מכמה (צורה)
const stripLead = (w) => { const out = [w]; for (let k = 1; k <= 2 && w.length - k >= 3; k++) out.push(w.slice(k)); return out; };   // (ג)
const isMany = (w) => w.length >= 4 && /(ים|ות)$/.test(w);                                                                    // (א)
const stem = (w) => w.replace(/(ים|ות|ה)$/, '');   // (ג') גם «ה» סופית להשוואת יחיד↔רבים (משימה↔משימות)
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
const enumOf = (it) => { const g = it.find((w) => w.includes('/')); return g ? g.split('/').filter(Boolean) : null; };   // איבר עם «/» ⇒ ערכים-מותרים
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
  const cutAt = parts.findIndex((p, i) => i > 0 && deVav(p).filter((w) => !isSpread(w)).length >= 3);
  let rest = null;
  if (cutAt > 0) { rest = parts.slice(cutAt).map((p) => p.join(' ')).join(', '); parts = parts.slice(0, cutAt); if (parts.length < 2) return { rest, only: true, head: parts[0] }; }
  const first = parts[0];
  let cut = -1; for (let i = 0; i < first.length - 1; i++) if (isSpread(first[i])) cut = i + 1;   // האיבר עצמו (המילה האחרונה) לעולם אינו «מפוזר»
  if (cut < 0) cut = first.length - 1;   // אין מילה מפוזרת לפני ⇒ האיבר = המילה האחרונה בלבד («לרכב יש יצרן» ⇒ «יצרן»)
  let before = first.slice(0, cut), item0 = first.slice(cut);
  if (item0.length > 1 && isMany(item0[item0.length - 1]) && !/י$/.test(item0[0])) { before = [...before, ...item0.slice(0, -1)]; item0 = item0.slice(-1); }   // «לניהול לקוחות» ⇒ האיבר «לקוחות»
  const dropped = [];
  const items = [item0, ...parts.slice(1)].map(deVav).map((it) => { let k = 0; while (k < it.length - 1 && isSpread(it[k])) dropped.push(it[k++]); return it.slice(k); }).filter((it) => it.length);   // «כמה עזבו» ⇒ «עזבו»; «כמה» ⇒ מסגרת
  return { before, items, rest, dropped };
}

// ── צורת-הצורך של משפט ──
export function formOf(sentence) {
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
  const runsOf = (ws) => { const runs = []; let cur = []; for (const w of ws) { if (!isNum(w) && isSpread(w)) { if (cur.length) runs.push(cur); cur = []; frame.push(w); } else cur.push(w); } if (cur.length) runs.push(cur); return runs; };   // מספר לעולם אינו «מפוזר» — נשאר ברצף כערך
  const queue = [...segments];
  while (queue.length) { const seg = queue.shift();
    let L = listOf(seg), head = null; if (L && L.rest) { queue.unshift(L.rest); if (L.only) { head = L.head; L = null; } }
    const pre = L ? L.before : (head || toks(seg));
    const runs = runsOf(pre);
    const attachOrPush = (run, under = null) => { const hit = run.length === 1 ? find(run[0]) : null; if (hit) (hit.refs = hit.refs || []).push(...run); else things.push(unitOf(run, seg, under)); };   // מילה בודדת שמצביעה על דבר קיים = הפניה; אחרת יחידה משלה. אף מילה לא נעלמת
    if (L) L.dropped.forEach((w) => frame.push(w));
    if (!L) {   // קטע בלי רשימה: כל רצף = יחידה; רצף, מילת-קישור אחת, רצף ⇒ השני הוא **תוכן** של הראשון («תמונה של חתול»: «חתול» = הכיתוב של «תמונה»)
      const before = things.length; for (const run of runs) attachOrPush(run);
      const made = things.slice(before);
      if (made.length === 2 && runs.length === 2) { const gap = pre.slice(pre.indexOf(runs[0][runs[0].length - 1]) + 1, pre.indexOf(runs[1][0])); if (gap.length === 1) { made[0].content = made[1].label; made[0].via = gap[0]; made[1].contentOf = made[0].label; } }
      continue; }
    // רשימה: הרצף הצמוד לרשימה = ההורה; רצפים קודמים = יחידות משלהן («תעשה לי» ⇒ יחידה עם שאלות)
    const run = runs.length ? runs[runs.length - 1] : [];
    for (const r of runs.slice(0, -1)) attachOrPush(r);
    let owner = null; for (let j = run.length - 1; j >= 0 && !owner; j--) owner = find(run[j]) || null;   // מילה כלשהי ברצף מזהה הורה קיים («לרכב יש» ⇒ «רכבים»)
    if (owner) (owner.refs = owner.refs || []).push(...run);
    else if (run.length) { owner = unitOf(run, seg); things.push(owner); }
    const manyItems = L.items.filter(itemMany).length, oneItems = L.items.length - manyItems;
    for (const it of L.items) {
      if (itemMany(it) || (oneItems === 0) || manyItems > oneItems) {   // רוב-רבים ⇒ גם היחיד ברשימה הוא דבר («… עובדים, ציוד ובטיחות»)
        const hit = find(it[0]); if (hit) (hit.refs = hit.refs || []).push(...it); else things.push({ ...unitOf(it, seg, owner ? owner.label : null), many: itemMany(it) }); }
      else if (owner) owner.fields.push({ label: it.join(' ').replace(/\//g, ' '), enumVals: enumOf(it) });
      else things.push(unitOf(it, seg));
    }
  }
  return { sentence, words, segments, things, frame: [...new Set(frame)] };
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
export function specOf(form, answers = {}) {
  const lines = [], skipped = [];
  const ents = form.things.filter((t) => t.many || t.fields.length || (answerFor(t, answers).fields));
  const names = new Set(ents.map((t) => t.label));
  for (const t of ents) {
    const a = answerFor(t, answers);
    const fields = (a.fields && a.fields.length) ? a.fields.map((f) => f.label + (f.enumVals ? `{${f.enumVals.join('|')}}` : '')) : t.fields.map((f) => f.label + (f.enumVals ? `{${f.enumVals.join('|')}}` : ''));   // {א|ב|ג} = בחירה-אחת-מכמה ⇒ entity.mjs ⇒ צ'יפים
    const refs = (a.fields || []).filter((f) => f.type === 'ref' && f.to && names.has(f.to)).map((f) => f.to);
    const all = [...new Set([...fields, ...refs])];
    if (!all.length) { skipped.push(t.label); continue; }
    lines.push(`ישות ${t.label} עם ${all.join(', ')}`);
  }
  // [פעולה]: יחס שהבעלים ענה עליו «פעולה» (או «תנאי» ⇒ חוק) על דבר שנכנס כישות
  for (const t of form.things) { const a = answerFor(t, answers); if (t.rel && a.rel === 'act') { const st = (w) => stripLead(stem(w)).filter((f) => f.length >= 3); const ent = ents.find((e) => toks(e.label).some((lw) => st(t.rel.subject).includes(stem(lw)))) || ents.find((e) => e.label === t.label); if (ent) lines.push(`חלקיק ${ent.label}: [פעולה] ${t.rel.words.join(' ')}`); } }
  // לוח בקרה: מונה לכל ישות עם sum · סכום לכל שדה-מספר שלה
  const metrics = [];
  for (const t of ents) { const a = answerFor(t, answers); if (!(a.acts && a.acts.includes('sum'))) continue; metrics.push(`מונה(${t.label})`); for (const f of (a.fields || [])) if (f.type === 'num') metrics.push(`סכום(${t.label}.${f.label})`); }
  if (metrics.length) lines.push(`לוח בקרה עם ${metrics.join(', ')}`);
  if (lines.length) lines.push('תפקיד בודק: הכל');
  return { spec: lines.join('\n'), skipped };
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
  const after = async (r) => { if (!r.needs.length) return; for (const c of await coverNeeds(r.needs)) console.log(`  מנוע 3 · ${c.thing}/${c.act}${c.field ? `(${c.field})` : ''} · ${c.op} ⇒ ${c.atoms.join('+')} · חלופות: ${c.alts.join(', ')} · חסר: ${c.missing.length ? c.missing.join(',') : 'כלום'}`); };
  if (args.includes('--smoke')) {
    const sents = fs.readFileSync(R.GEN_DIR + 'nl-smoke.txt', 'utf8').split('\n').map((s) => s.trim()).filter(Boolean);
    let W = 0, T = 0, F = 0, Q = 0; for (const s of sents) { const r = show(s); W += r.words.length; T += r.things.length; F += r.things.reduce((n, t) => n + t.fields.length, 0); Q += r.questions.length; }
    console.log(`\nסה"כ · ${sents.length} משפטים · ${W} מילים · ${T} דברים · ${F} שדות מהמשפט · ${Q} שאלות`);
  } else await after(show(args.filter((a) => !a.startsWith('--') && a !== (ai >= 0 ? args[ai + 1] : null))[0] || ''));
}

