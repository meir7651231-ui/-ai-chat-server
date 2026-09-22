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

export const toks = (s) => [...String(s || '').matchAll(/[֐-׿]+|\d+|[A-Za-z]+/g)].map((m) => m[0]);
const stripLead = (w) => { const out = [w]; for (let k = 1; k <= 2 && w.length - k >= 3; k++) out.push(w.slice(k)); return out; };   // (ג)
const isMany = (w) => w.length >= 4 && /(ים|ות)$/.test(w);                                                                    // (א)
const stem = (w) => w.replace(/(ים|ות|ה)$/, '');   // (ג') גם «ה» סופית להשוואת יחיד↔רבים (משימה↔משימות)
const itemMany = (item) => isMany(item[0]) || isMany(item[item.length - 1]) || (item.length > 1 && /י$/.test(item[0]));   // «קבלני משנה» — סמיכות-רבים (י + מילה שנייה)

// ── פיזור מהקטלוג: על כמה מינים שונים של חלקיקים כתובה המילה (משפט-המטרה בראש הקובץ) ──
let _spread = null, _ops = 0;
export const opsCount = () => (spreadIndex(), _ops);
export function spreadIndex() {
  if (_spread) return _spread;
  const map = JSON.parse(fs.readFileSync(R.GEN_DIR + 'ops-map.json', 'utf8'));
  const idx = new Map(); const ops = new Set();
  for (const a of map) { ops.add(a.op);
    let head = '';
    try { head = fs.readFileSync(R.NEW + a.file, 'utf8').split('\n').filter((l) => /^\s*\/\/\/?/.test(l)).slice(0, 4).join(' '); } catch { continue; }
    for (const w of new Set(toks(head))) { if (!idx.has(w)) idx.set(w, new Set()); idx.get(w).add(a.op); }
  }
  _ops = ops.size;
  return (_spread = idx);
}
export function spreadOf(w) { const idx = spreadIndex(); for (const f of stripLead(w)) if (idx.has(f)) return { form: f, ops: idx.get(f).size }; return { form: w, ops: 0 }; }
const isSpread = (w) => spreadOf(w).ops >= SPREAD();
const known = (w) => spreadIndex().has(w);   // הצורה עצמה כתובה על חלקיק כלשהו
const bareLabel = (w) => (known(w) ? w : (stripLead(w).slice(1).find(known) || w));   // «לעמותה» ⇒ «עמותה» רק אם «עמותה» כתובה ו-«לעמותה» לא

// ── רשימה בקטע: חלקי-פסיק; החלק האחרון «X וY» נחצה ב-«ו» (ב) ──
function listOf(segment) {
  const parts = segment.split(/[,،]/).map((p) => toks(p)).filter((p) => p.length);
  if (!parts.length) return null;
  const last = parts[parts.length - 1];
  const vi = last.findIndex((w, i) => i > 0 && /^ו[֐-׿]{2,}/.test(w));
  if (vi > 0) { parts[parts.length - 1] = last.slice(0, vi); parts.push([last[vi].slice(1), ...last.slice(vi + 1)]); }
  if (parts.length < 2) return null;
  // חלק ארוך (≥3 מילים) בין חלקים קצרים = פסוקית חדשה, לא איבר («ניהול משימות, לכל משימה כותרת, …») ⇒ הרשימה נחתכת לפניו
  const cutAt = parts.findIndex((p, i) => i > 0 && p.length >= 3);
  if (cutAt > 0) { const rest = parts.slice(cutAt).map((p) => p.join(' ')).join(', '); parts.length = cutAt; if (parts.length < 2) return { rest, only: true, head: parts[0] }; return { ...listCore(parts), rest }; }
  return listCore(parts);
}
function listCore(parts) {
  const first0 = parts[0];
  // האיבר הראשון נושא את «לפני-הרשימה»: מילותיו המפוזרות (ועד המילה המפוזרת האחרונה) הן הקשר; מה שאחריה — האיבר עצמו
  const first = first0;
  let cut = -1; for (let i = 0; i < first.length - 1; i++) if (isSpread(first[i])) cut = i + 1;   // האיבר עצמו (המילה האחרונה) לעולם אינו «מפוזר» — מיקום ברשימה קובע
  if (cut < 0) cut = first.length - 1;   // אין מילה מפוזרת לפני ⇒ האיבר = המילה האחרונה בלבד («לרכב יש יצרן» ⇒ «יצרן»)
  let before = first.slice(0, cut), item0 = first.slice(cut);
  if (item0.length > 1 && isMany(item0[item0.length - 1]) && !/י$/.test(item0[0])) { before = [...before, ...item0.slice(0, -1)]; item0 = item0.slice(-1); }   // «לניהול לקוחות» ⇒ האיבר «לקוחות», «לניהול» להורה
  const items = [item0, ...parts.slice(1)].filter((it) => it.length);
  return { before, items };
}

// ── צורת-הצורך של משפט ──
export function formOf(sentence) {
  const words = toks(sentence);
  const segments = sentence.split(/[:;]/).map((s) => s.trim()).filter(Boolean);
  const things = [];   // { label, many, fields:[{label}], under, src }
  const frame = [];    // מילים מפוזרות (מסגרת/קישור) — מדווחות, לא מפורשות
  const find = (w) => things.find((t) => toks(t.label).some((lw) => stripLead(stem(w)).some((f) => f === stem(lw))));   // «לרכב» ⇔ «ניהול רכבים»: כל מילה בתווית
  const queue = [...segments];
  while (queue.length) { const seg = queue.shift();
    let L = listOf(seg), head = null; if (L && L.rest) { queue.unshift(L.rest); if (L.only) { head = L.head; L = null; } }
    const pre = L ? L.before : (head || toks(seg));
    const lowPre = pre.filter((w) => !/^\d+$/.test(w) && !isSpread(w));
    pre.filter((w) => isSpread(w)).forEach((w) => frame.push(w));
    if (!L) {   // קטע בלי רשימה: הרצף הנמוך-פיזור **האחרון** = דבר אחד («משרד עורכי דין»); רצפים שלפני מילה מפוזרת = מסגרת («תעשה לי מערכת …»)
      const runs = []; let cur = []; for (const w of pre) { if (isSpread(w) || /^\d+$/.test(w)) { if (cur.length) runs.push(cur); cur = []; } else cur.push(w); } if (cur.length) runs.push(cur);
      runs.slice(0, -1).forEach((r) => r.forEach((w) => frame.push(w)));
      const run = runs[runs.length - 1] || []; if (run.length && !find(run[run.length - 1])) things.push({ label: [bareLabel(run[0]), ...run.slice(1)].join(' '), many: isMany(run[run.length - 1]), fields: [], under: null, src: seg });
      continue; }
    const manyItems = L.items.filter(itemMany).length, oneItems = L.items.length - manyItems;
    // הורה: המילה הנמוכה-פיזור האחרונה לפני הרשימה (אחרי הסרת אות פותחת), אם יש
    let run = [], i = pre.length - 1; while (i >= 0 && isSpread(pre[i])) i--;   // מדלגים על הקישור («עם»)
    { let j = i; while (j >= 0 && !isSpread(pre[j])) j--; for (let q = 0; q < j; q++) if (!isSpread(pre[q])) frame.push(pre[q]); }   // «הכן» לפני «מערכת» = מסגרת, לא נעלם
    for (; i >= 0 && !isSpread(pre[i]) && !/^\d+$/.test(pre[i]); i--) run.unshift(pre[i]);   // הרצף הנמוך-פיזור שלפניו = ההורה («חדר כושר»)
    const ownerW = run.length ? run[run.length - 1] : null;
    let owner = null; for (let j = run.length - 1; j >= 0 && !owner; j--) owner = find(run[j]) || null;   // מילה כלשהי ברצף מזהה הורה קיים («לרכב יש» ⇒ «רכבים»)
    if (owner) (owner.refs = owner.refs || []).push(...run);   // המילים שהצביעו על ההורה — נספרות כמכוסות
    if (ownerW && !owner) { owner = { label: [bareLabel(run[0]), ...run.slice(1)].join(' '), many: isMany(run[0]), fields: [], under: null, src: seg }; things.push(owner); }
    for (const it of L.items) {
      const label = it.join(' ');
      if (itemMany(it) || (oneItems === 0) || manyItems > oneItems) {   // רוב-רבים ⇒ גם היחיד ברשימה הוא דבר («… עובדים, ציוד ובטיחות»)
        if (!find(it[0])) things.push({ label, many: itemMany(it), fields: [], under: owner ? owner.label : null, src: seg }); }
      else if (owner) owner.fields.push({ label });
      else things.push({ label, many: false, fields: [], under: null, src: seg });
    }
  }
  return { sentence, words, segments, things, frame: [...new Set(frame)] };
}

// ── שאלות סגורות: מה שהצורה לא אמרה ──
export function questionsFor(form, answers = {}) {
  const qs = [];
  for (const t of form.things) {
    const a = answers[t.label] || {};
    if (a.many == null) qs.push({ thing: t.label, ask: 'many', proposal: t.many, options: [true, false] });
    if (!t.fields.length && !(a.fields && a.fields.length)) qs.push({ thing: t.label, ask: 'fields', options: TYPES });
    for (const f of t.fields) { const af = (a.fields || []).find((x) => x.label === f.label); if (!af || !af.type) qs.push({ thing: t.label, ask: 'type', field: f.label, options: TYPES }); }
    if (!(a.acts && a.acts.length)) qs.push({ thing: t.label, ask: 'acts', options: ACTS });
    for (const f of (a.fields || [])) if (f.type === 'ref' && !f.to) qs.push({ thing: t.label, ask: 'ref', field: f.label, options: form.things.map((x) => x.label) });
  }
  return qs;
}

// ── צורה ⇒ בקשות למנוע 3 (op + שקעים בשמות הקטלוג). רק ממה שנענה. ──
export function needsFrom(form, answers = {}) {
  const needs = [];
  for (const t of form.things) {
    const a = answers[t.label]; if (!a || !a.acts) continue;
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
  }
  return needs;
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
    const k = Object.entries(KIND_RE).filter(([, re]) => re.test(src)).map(([n]) => n); _kinds.set(a.id.split('@')[0], k.length ? k : ['text']); }
  return _kinds;
}
export const kindOf = (id) => valueKinds().get(String(id).split('@')[0]) || ['text'];

// ── צורה שנענתה ⇒ מנוע 3 (cover) · דיווח: אטום/חסר לכל בקשה. «חסר» מדווח, לא מזויף (§20-ג) ──
//    שדה עם סוג: מבין חלופות-cover נבחרת הראשונה שסוג-הערך שלה תואם; אין ⇒ missing כולל `type:<סוג>`.
export async function coverNeeds(needs) {
  const { cover } = await import('../machtzev/generator/cover.mjs');
  return needs.filter((n) => n.op).map((n) => {
    const c = cover({ op: n.op, need: n.need, goal: '', k: n.type ? 12 : 3 });
    let atoms = c.atoms, missing = c.missing.slice(), alts = c.alts || [];
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
    for (const t of r.things) console.log(`  דבר «${t.label}» · ${t.many ? 'הרבה' : 'אחד'}${t.under ? ` · בתוך «${t.under}»` : ''}${t.fields.length ? ` · שדות: ${t.fields.map((f) => f.label).join(', ')}` : ''}`);
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

