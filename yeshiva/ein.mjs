// ═════════════════════════════════════════════════════════════════════════════════
//  yeshiva/ein.mjs — 🕳️ **מפת-הניתוב של «אין».** הכרעת-בעלים 23.9: «בסרט הכל קיים», «"אין" בלי חיפוש נחסם», «כל מנוע יכול לעבוד הלוך-חזור».
//  ─────────────────────────────────────────────────────────────────────────────────
//  הדלת פוגשת «אין» (מסלול none). כאן, במקום שאלה מיד: איזה **סוג** של אין זה ⇒ המפרק והמרכיב של הסוג ⇒ המשפט נקרא שוב ⇒ עד שאין שינוי.
//  הסוגים (הסדר והטקסטים ב-ein.data.json; המנועים כאן — הדאטה יכולה לסדר/לכבות, לא להמציא):
//    marks       — תשובה שהיא שמות-דוגמאות («מתקשה» = «ראובן») ⇒ behavior-plan.valueSearch מוצא כלל מוכח ב-Dart (הכיוון-ההפוך)
//    word        — מילה זרה בסעיף ⇒ הגדרה במשפט (תשובה/זיכרון) ⇒ «או» = סעיפים ⇒ המשפט נקרא שוב; בלי הגדרה ⇒ שאלה עם מפתח
//    examplesIO  — דוגמאות קלט⇒פלט אחרי דבר («גימטריה של שם; למשל: אבג ⇒ 6») ⇒ צורך-התנהגות (planBehaviors ⇒ behavior-plan + synth ⇒ מסך)
//  הפירוק לתצוגה (display-synth) ולמסך (retrieveScreen/combine) חיים במקומם — insight ו-routeOf — ונקראים שם.
// ═════════════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as R from '../machtzev/root.mjs';
import { toks, sameStem, leadOf, recall, remember } from './mavin.mjs';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const D = JSON.parse(fs.readFileSync(path.join(HERE, 'ein.data.json'), 'utf8'));

/** הכיוון-ההפוך של ההגדרה (הכרעת-בעלים 23.9 «מנוע תמיד יכול לעבוד דו-כיווני»): במקום משפט, הבעלים מסמן אילו דוגמאות הן «מתקשה» («ראובן»).
 *  behavior-plan.valueSearch (החיפוש הרקורסיבי-המוכח על קטלוג-הלוגיקה) מקבל לכל שדה-מספר צורך: פרמטר = ערך-השדה, קבועים = ערכי-הדוגמאות, תשובה = הסימון —
 *  ומוצא בהוכחה-בריצה ב-Dart כלל שמסכים עם כל הדוגמאות. הכיוון (מתחת/מעל) נקרא מהדוגמאות עצמן מול הקבוע; המילים מ-spec-lang (amountAbove/amountBelow).
 *  שדה-מספר יחיד ⇒ ההגדרה נכנסת (וסימון-הסף הוא ערך מהדוגמאות, לא המצאה). כמה שדות ⇒ שאלה סגורה עם הכללים שנמצאו. אפס ⇒ שאלה: עוד דוגמאות. */
// ═══ ein.marks = valueSearch ⊕ amountAbove/amountBelow/amountEqual
export async function defineByMarks(w, ans, thing, SL) {
  const keys = new Set((thing.examples || []).map((r) => String(r[0]).trim())); const marks = ans.split(/[,;\s]+/).filter(Boolean);
  if (!marks.length || !marks.every((m) => keys.has(m)) || !keys.size) return null;
  const isNum = (v) => /^-?\d+(\.\d+)?$/.test(String(v).trim());
  const LE = await import('../machtzev/generator/live-expr.mjs');
  const ageOf = (v) => (isNum(v) ? null : LE.liveSample({ kind: 'age' }, v));   // שדה-תאריך ⇒ ותק בימים היום (תלוי-זמן, מוצהר) — אותה צורה שהדלת קוראת «מעל N ימים»
  const numIdx = thing.fields.map((f, i) => i).filter((i) => i > 0 && thing.examples.every((r) => isNum(r[i])));
  const dateIdx = thing.fields.map((f, i) => i).filter((i) => i > 0 && !numIdx.includes(i) && thing.examples.every((r) => ageOf(r[i]) != null));
  const textIdx = thing.fields.map((f, i) => i).filter((i) => i > 0 && !numIdx.includes(i) && !dateIdx.includes(i));   // שדה-טקסט ⇒ שוויון («כיתה שווה ל-א»), צורת-התנאי «=»
  if (!numIdx.length && !dateIdx.length && !textIdx.length) return { marks, cands: [] };
  const valAt = (r, i) => (dateIdx.includes(i) ? String(ageOf(r[i])) : String(r[i]).trim());
  const qs = (v) => `'${String(v).replace(/'/g, "\\'")}'`;
  const needs = {};
  for (const i of [...numIdx, ...dateIdx]) { const vals = [...new Set(thing.examples.map((r) => valAt(r, i)))];
    needs[`def.${w}.${i}`] = { shape: 'בדיקה', demand: `${thing.label} ${w} ${thing.fields[i].label}`, params: ['num'], ret: 'bool', consts: vals, examples: thing.examples.map((r) => [valAt(r, i), `r == ${marks.includes(String(r[0]).trim())}`]) }; }
  for (const i of textIdx) { const vals = [...new Set(thing.examples.map((r) => valAt(r, i)))].map(qs);
    needs[`def.${w}.${i}`] = { shape: 'בדיקה', demand: `${thing.label} ${w} ${thing.fields[i].label}`, params: ['String'], ret: 'bool', consts: vals, examples: thing.examples.map((r) => [qs(valAt(r, i)), `r == ${marks.includes(String(r[0]).trim())}`]) }; }
  const BP = await import('../machtzev/generator/behavior-plan.mjs'); const P = BP.planNeeds(needs, { prove: true });
  const cands = [];
  const dayWord = Object.keys(SL.timeUnits || {}).find((u) => (SL.timeUnits || {})[u] === 1) || '';   // מילת-היחידה של יום מהדאטה («ימים»)
  for (const i of [...numIdx, ...dateIdx, ...textIdx]) { const p = P[`def.${w}.${i}`]; if (!p || !p.pick || !p.proven) continue;
    if (textIdx.includes(i)) {   // שוויון: הקבוע-המחרוזת מהעץ; המסומנים כולם שווים לו והשאר לא ⇒ «שדה שווה ל-ערך»
      const sm = String(p.pick).match(/'([^']*)'/); const cv = sm ? sm[1] : null; if (cv == null) continue;
      const mk = thing.examples.filter((r) => marks.includes(String(r[0]).trim())).map((r) => valAt(r, i)), rs = thing.examples.filter((r) => !marks.includes(String(r[0]).trim())).map((r) => valAt(r, i));
      if (!(mk.every((v) => v === cv) && rs.every((v) => v !== cv))) continue;
      const eqw = (SL.amountEqual || [])[0]; if (!eqw) continue;
      cands.push({ field: thing.fields[i].label, clause: `${thing.fields[i].label} ${eqw}${/-$/.test(eqw) ? '' : ' '}${cv}`, ties: p.ties || 0, atom: p.pick }); continue; }
    const m = String(p.pick).match(/^\w+\(([^)]*)\)$/); const c = m ? m[1].split(',').map((x) => x.trim()).find((x) => isNum(x)) : null; if (c == null) continue;
    const marked = thing.examples.filter((r) => marks.includes(String(r[0]).trim())).map((r) => +valAt(r, i)), rest = thing.examples.filter((r) => !marks.includes(String(r[0]).trim())).map((r) => +valAt(r, i));
    const below = marked.every((v) => v < +c) && rest.every((v) => v >= +c), above = marked.every((v) => v > +c) && rest.every((v) => v <= +c);
    if (!below && !above) continue;
    const word = below ? (SL.amountBelow || [])[1] || (SL.amountBelow || [])[0] : (SL.amountAbove || [])[0]; if (!word) continue;
    const unit = dateIdx.includes(i) && dayWord ? ` ${dayWord}` : '';
    cands.push({ field: thing.fields[i].label, clause: `${thing.fields[i].label} ${word}${/-$/.test(word) ? '' : ' '}${c}${unit}`, ties: p.ties || 0, atom: p.pick }); }
  return { marks, cands };
}
// ═══ ein.word = definitions ⊕ orWords ⊕ remember/recall
export async function expandDefinitions(sentence, form, routed, answers, proposals, skip = new Set()) {
  let SLd = {}; try { SLd = JSON.parse(fs.readFileSync(path.join(R.GEN_DIR, 'spec-lang.data.json'), 'utf8')); } catch {}
  const out = { sentence, changed: false, notes: [], questions: [] };
  let orRe = null; try { const ow = JSON.parse(fs.readFileSync(path.join(R.GEN_DIR, 'spec-lang.data.json'), 'utf8')).orWords || []; if (ow.length) orRe = new RegExp('\\s+(?:' + ow.join('|') + ')\\s+'); } catch {}
  const ents = form.things.filter((t) => t.fields && t.fields.length);
  for (const r of routed.routes.filter((x) => (x.route === 'none' || x.proposal) && !skip.has(x.thing))) {   // גם הצעה (combine/gold לפי דמיון-שם): מילה שלא הוגדרה — נשאלת, לא נבלעת בהצעה שלא נבנית
    const thing = form.things.find((t) => t.label === r.thing); if (!thing || (thing.ioExamples && thing.ioExamples.length)) continue;
    const tokens = toks(thing.label);
    let ei = -1, ent = null; tokens.forEach((w, i) => { const e = ents.find((t) => leadOf(w, t.label) != null); if (e) { ei = i; ent = e; } });
    let cands = ei >= 0 ? tokens.slice(ei + 1) : tokens.slice(1).filter((w) => !ents.some((t) => sameStem(w, t.label) || t.fields.some((f) => sameStem(w, f.label))));
    if (!cands.length && ei < 0 && tokens.length === 1) cands = tokens;   // סעיף של מילה אחת («תלויות») — נעלם בשקט; «אין» בלי שאלה אסור ⇒ שואלים על המילה עצמה
    for (const w of cands) {
      let said = typeof answers[w] === 'string' ? answers[w].trim() : '';
      const rec = recall(w);
      if (said && ent) { const bm = await defineByMarks(w, said, ent, SLd);   // התשובה היא סימון-דוגמאות ⇒ הכלל מהמנוע-ההפוך
        if (bm) { if (bm.cands.length === 1) { out.notes.push(`הגדרה «${w}» מהדוגמאות שסימנת (${bm.marks.join(', ')}): «${bm.cands[0].clause}» — ${bm.cands[0].atom} הוכח ב-Dart על ${ent.examples.length} דוגמאות · ${bm.cands[0].ties} שקולים · הסף הוא ערך מהדוגמאות`); said = bm.cands[0].clause; }
          else { out.questions.push({ thing: r.thing, ask: 'define', key: w, q: `«${w}» לפי הסימון (${bm.marks.join(', ')}): ${bm.cands.length ? bm.cands.map((c) => `${c.clause} (${c.ties} שקולים)`).join(' · ') + ' — בחר אחד או חבר ב«או»' : 'אין כלל על שדה-מספר שמסכים עם כל הדוגמאות — סמן עוד דוגמאות או הגדר במשפט'} ⇒ ${bm.cands[0] ? bm.cands[0].clause : '—'}` }); continue; } } }
      const def = said || (proposals && rec ? String(rec.proposal) : '');
      if (!def) { const sx = (r.search || []).find((x) => x.word === w); out.questions.push({ thing: r.thing, ask: 'define', key: w, q: `«${w}» — ${sx ? `כתוב על ${sx.carriers} חלקיקים${sx.carriers ? ` (${[...sx.logic, ...sx.display].slice(0, 3).join(', ')})` : ''}, ` : ''}לא שדה${ent ? ` של «${ent.label}» (${ent.fields.map((f) => f.label).join(', ')})` : ''} ולא תנאי; להגדיר במשפט על שדה ⇒ ${rec ? `${rec.proposal} (נענה ${rec.times} פעמים — הצעה, לא עובדה)` : 'נשאר בלי מסך עד תשובה'}` }); continue; }
      const parts = [def.trim()].filter(Boolean);   // «או» בהגדרה = חלופה בתוך תנאי אחד (capability.detectAllClauses · live.alt), לא שני מסכים
      const lead = ei >= 0 ? leadOf(tokens[ei], ent.label) : '';
      const clauses = parts.map((p) => ei >= 0 ? [...tokens.slice(0, ei), lead + p].join(' ') : tokens.map((t) => (t === w ? p : t)).join(' '));
      if (!out.sentence.includes(thing.label)) { out.notes.push(`הגדרה «${w}»: הסעיף «${thing.label}» לא נמצא כלשונו במשפט ⇒ לא הוחלף`); continue; }
      out.sentence = out.sentence.replace(thing.label, clauses.join('; ')); out.changed = true;
      out.notes.push(`הגדרה «${w}» = «${def}» (${said ? 'תשובת-הבעלים' : `נזכרה, נענתה ${rec.times} פעמים`}) ⇒ ${clauses.length} סעיפים: ${clauses.map((c) => `«${c}»`).join(' · ')}`);
      if (said && !(rec && String(rec.proposal) === said)) { try { remember(w, said, sentence); } catch {} }
      break;   // מילה אחת לסעיף; השאר נקראות מחדש אחרי ההחלפה
    }
  }
  return out;
}

/** דוגמאות קלט⇒פלט על דבר במסלול none ⇒ תשובת-התנהגות (הצורה של needsFor): פרמטר = טיפוס-הקלט מהצורה (מספר/טקסט), תשובה = טיפוס-הפלט. הדלת (2ג) מוכיחה ומרכיבה. */
// ═══ ein.examplesIO = ioExamples ⊕ needsFor ⊕ planBehaviors ⊕ synth
export function examplesIO(form, routed, answers) {
  const notes = []; const isNum = (v) => /^-?\d+(\.\d+)?$/.test(String(v).trim()); const q = (v) => (isNum(v) ? String(v).trim() : `'${String(v).replace(/'/g, "\\'")}'`);
  for (const r of routed.routes.filter((x) => x.route === 'none')) {
    const t = form.things.find((x) => x.label === r.thing); if (!t || !(t.ioExamples && t.ioExamples.length)) continue;
    const cur = answers[t.label]; if (cur && cur.behavior) continue;
    const ins = t.ioExamples.map((e) => e[0]), outs = t.ioExamples.map((e) => e[1]);
    // כמה קלטים («3, 4 ⇒ 7»): אותו מספר ערכים בכל דוגמה (≥2) ⇒ פרמטר לכל עמדה, טיפוס לפי העמדה — מנוע-התכנון (Dart) מוכיח רב-פרמטרי; synth נשאר קלט-יחיד
    const parts = ins.map((i) => String(i).split(/\s*[,،]\s*/)); const k = parts[0].length; const multi = k >= 2 && parts.every((p) => p.length === k);
    const b = multi ? { examples: parts.map((p, n) => [p.map(q).join(', '), `r == ${q(outs[n])}`]), params: Array.from({ length: k }, (_, j) => (parts.every((p) => isNum(p[j])) ? (parts.every((p) => /^-?\d+$/.test(p[j].trim())) ? 'int' : 'num') : 'String')), ret: outs.every(isNum) ? (outs.every((o) => /^-?\d+$/.test(String(o).trim())) ? 'int' : 'num') : 'String', multi: k }
      : { examples: t.ioExamples.map(([i, o]) => [q(i), `r == ${q(o)}`]), params: [ins.every(isNum) ? 'num' : 'String'], ret: outs.every(isNum) ? (outs.every((o) => /^-?\d+$/.test(String(o).trim())) ? 'int' : 'num') : 'String' };   // פלטים שלמים ⇒ int (חתימת-הקטלוג של gemValueWired היא int?)
    if (cur && Array.isArray(cur.mid)) b.mid = cur.mid.map(String);   // שלב-ביניים מהבעלים (born.steps) — לכל דוגמה הערך שבאמצע
    answers[t.label] = { ...(cur || {}), behavior: b };
    if (!process.env.BP_CAPV) process.env.BP_CAPV = '2000';   // צורך טקסט⇒מספר פותח מרחב-עצים עצום (נמדד: מחרוזת-הוכחה >512MB); תקרה — האטום המחווט נמצא בעומק 1
    notes.push(`${D.T.ioNote.replace('{thing}', t.label).replace('{n}', String(t.ioExamples.length)).replace('{sig}', `${b.params.join(', ')} ⇒ ${b.ret}`)}`);
  }
  return { notes };
}
// ═══ ein.form = marks ⊕ (> · < · =)ⁿ ⊕ (וגם | או) ⇒ צורה נלמדת (זיכרון) ⇒ הסעיף נכתב בצורות מוכרות
/** צורה שלא רשומה (הכרעת-בעלים 24.9 «תסגור»): סעיף שיש בו שדה-ישות ומספרים אבל אף גלאי לא קרא אותו («כשציון בין 60 ל-90»).
 *  התבנית = המילים שבין השדה למספר-האחרון, המספרים ⇒ «#» (אות-יחס צמודה «ל-90» ⇒ «ל», «#»). צורה בלבד — אפס מילון.
 *  (א) נלמדה כבר (זיכרון-הצורות) ⇒ נכתבת מחדש בצורות מוכרות · (ב) הבעלים סימן דוגמאות ⇒ כל הרכבה של יחס-מוכר לכל מספר (> < =) ומחבר (וגם/או)
 *  נבדקת מול הסימון על דוגמאות-הישות; אחת מסכימה ⇒ נרשמת ⇒ נכתבת מחדש · (ג) בלי סימון ⇒ שאלה עם מפתח. היחסים והמחברים מ-spec-lang/conditions (דאטה). */
const FORMS = () => process.env.MAVIN_FORMS || path.join(R.ROOT, '.maimatai', 'forms.learned.jsonl');
const formsAll = () => { const f = FORMS(); return fs.existsSync(f) ? fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)) : []; };
const fill = (t, o) => Object.entries(o).reduce((a, [k, v]) => a.split(`{${k}}`).join(String(v)), t);
export async function learnForms(sentence, form, routed, answers) {
  const out = { sentence, changed: false, notes: [], questions: [], handled: new Set() };
  let SL = {}, CO = {}; try { SL = JSON.parse(fs.readFileSync(path.join(R.GEN_DIR, 'spec-lang.data.json'), 'utf8')); CO = JSON.parse(fs.readFileSync(path.join(R.GEN_DIR, 'knowledge/conditions.json'), 'utf8')); } catch { return out; }
  const LE = await import('../machtzev/generator/live-expr.mjs'); const CAP = await import('../machtzev/generator/capability.mjs'); const OT = await import('../machtzev/generator/op-twins.mjs');
  const ents = form.things.filter((t) => t.fields && t.fields.length && t.examples && t.examples.length);
  const relWord = { '>': (SL.amountAbove || [])[0], '<': (SL.amountBelow || [])[1] || (SL.amountBelow || [])[0], '=': (SL.amountEqual || [])[0] };
  const joinWord = { and: (CO.and || [])[0], or: (CO.or || [])[0] }; const TU = SL.timeUnits || {};
  const NUM = /^\d+(?:\.\d+)?$/, ATT = /^([֐-׿]+)-?(\d+(?:\.\d+)?)$/, ATTX = /^([֐-׿])-(.+)$/;
  const escRe = (x) => String(x).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); const defin = (x) => String(x).replace(/ך/g, 'כ').replace(/ם/g, 'מ').replace(/ן/g, 'נ').replace(/ף/g, 'פ').replace(/ץ/g, 'צ');
  const save = (e) => { fs.mkdirSync(path.dirname(FORMS()), { recursive: true }); fs.appendFileSync(FORMS(), JSON.stringify({ at: new Date().toISOString(), ...e }) + '\n'); };
  const atomsBool2 = () => { let cat = {}; try { cat = JSON.parse(fs.readFileSync(path.join(R.GEN_DIR, 'knowledge/op-twins.json'), 'utf8')).ok || {}; } catch {} return Object.entries(cat).filter(([, e]) => e.ret === 'bool' && e.params.length === 2).map(([name, e]) => ({ name, file: 'dart-maor/' + e.file, types: e.params.map((q) => q.type), fn: OT.verifiedTwin(name) })).filter((a) => a.fn); };
  for (const r of routed.routes.filter((x) => x.route === 'none' || x.proposal)) {   // גם הצעת-מסך (דמיון-מילים): סעיף עם שדה-ישות ומספר/סף הוא תנאי, לא מסך ממקום אחר
    const t = form.things.find((x) => x.label === r.thing); const src = t && t.src; if (!src || !out.sentence.includes(src)) continue;
    const ws = src.split(/\s+/); let fi = -1, fEnd = -1, ent = null, fld = null;
    for (let i = 0; i < ws.length && fi < 0; i++) for (const e of ents) { const f = e.fields.find((x) => { if (leadOf(ws[i], x.label) == null) return false; const lt = toks(x.label); return lt.slice(1).every((w, k) => ws[i + 1 + k] && sameStem(ws[i + 1 + k], w)); }); if (f) { fi = i; fEnd = i + toks(f.label).length - 1; ent = e; fld = f; break; } }
    if (fi < 0) continue;
    const fIdx = ent.fields.indexOf(fld); const rows = ent.examples.filter((x) => x.length > fIdx); const names = rows.map((x) => String(x[0]).trim()); const raw = rows.map((x) => String(x[fIdx]).trim());
    const kind = raw.every((v) => NUM.test(v)) ? 'num' : raw.every((v) => LE.liveSample({ kind: 'age' }, v) != null) ? 'date' : 'text';
    const tmpl = [], consts = []; let last = -1, unitWord = null, mult = 1;
    for (let i = fEnd + 1; i < ws.length; i++) { const w = ws[i];
      if (kind !== 'text') { if (NUM.test(w)) { tmpl.push('#'); consts.push(+w); last = i; continue; } const m = w.match(ATT); if (m) { tmpl.push(m[1], '#'); consts.push(+m[2]); last = i; continue; }
        if (kind === 'date' && TU[w] && last === i - 1) { unitWord = w; mult = TU[w] === 'ask' ? NaN : +TU[w]; last = i; continue; } tmpl.push(w); continue; }
      const m = w.match(ATTX); if (m) { tmpl.push(m[1], '$'); consts.push(m[2]); last = i; continue; } if (raw.includes(w)) { tmpl.push('$'); consts.push(w); last = i; continue; } tmpl.push(w); }
    if (!consts.length || Number.isNaN(mult)) continue;
    const cut = Math.max(tmpl.lastIndexOf('#'), tmpl.lastIndexOf('$')); const pat = tmpl.slice(0, cut + 1); const words = pat.filter((x) => x !== '#' && x !== '$'); if (!words.length) continue;
    const key = words[0]; out.handled.add(r.thing);
    const unit = unitWord ? ` ${unitWord}` : '';
    const rewrite = (e) => { const parts = e.ops.map((op, i) => `${i ? fld.label + ' ' : ''}${relWord[op]}${/-$/.test(relWord[op]) ? '' : ' '}${consts[i]}${unit}`); return [...ws.slice(0, fEnd + 1), parts.join(` ${joinWord[e.join] || joinWord.and} `), ...ws.slice(last + 1)].join(' '); };
    const apply = (e, note) => { const txt = rewrite(e); out.sentence = out.sentence.replace(src, txt); out.changed = true; out.notes.push(note(txt)); };
    const known = formsAll().filter((x) => JSON.stringify(x.tmpl) === JSON.stringify(pat) && (x.kind || 'compose') !== 'atom').pop();
    if (known && known.ops.length === consts.length) { apply(known, (txt) => fill(D.T.formRecalled, { tmpl: pat.join(' '), at: String(known.at).slice(0, 10), n: known.n, out: txt })); continue; }
    const said = typeof answers[key] === 'string' ? answers[key].trim() : '';
    if (!said) { out.questions.push({ thing: r.thing, ask: 'define', key, q: fill(D.T.formAsk, { key, src, names: names.join(', ') }) }); continue; }
    const marks = said.split(/[,;\s]+/).filter(Boolean);
    if (!marks.every((m) => names.includes(m))) { out.questions.push({ thing: r.thing, ask: 'define', key, q: fill(D.T.formBadMarks, { key, marks: marks.join(', '), names: names.join(', ') }) }); continue; }
    const vals = kind === 'text' ? raw : kind === 'date' ? raw.map((v) => LE.liveSample({ kind: 'age' }, v)) : raw.map(Number); const cmpC = consts.map((c) => (kind === 'date' ? c * mult : c));
    const same = (sel) => sel.length === marks.length && marks.every((m) => sel.includes(m));
    const hit = (op, v, n) => (op === '>' ? v > n : op === '<' ? v < n : v === n);
    const combos = []; const ops = kind === 'text' ? ['='] : ['>', '<', '=']; const rec = (acc) => { if (acc.length === consts.length) { for (const j of consts.length > 1 ? ['and', 'or'] : ['and']) combos.push({ ops: acc, join: j }); return; } for (const o of ops) rec([...acc, o]); }; rec([]);
    const agree = combos.filter((c) => same(rows.filter((x, i) => { const hs = c.ops.map((o, k) => hit(o, vals[i], cmpC[k])); return c.join === 'or' ? hs.some(Boolean) : hs.every(Boolean); }).map((x) => String(x[0]).trim())));
    if (agree.length === 1) { const e = { kind: 'compose', tmpl: pat, ops: agree[0].ops, join: agree[0].join, field: kind, n: rows.length, marks, from: sentence }; save(e);
      apply(e, (txt) => fill(D.T.formLearned, { tmpl: pat.join(' '), marks: marks.join(', '), n: rows.length, tried: combos.length, out: txt })); continue; }
    // אין הרכבה של צורות מוכרות ⇒ אטום-השוואה מאומת (פעולות-יסוד עם תאום זהה-ל-Dart): (ערך, סף) ⇒ bool, מסכים עם הסימון בכל הדוגמאות ⇒ יחס נלמד
    let atomsTried = 0; const atomAgree = [];
    if (!agree.length && consts.length === 1) for (const a of atomsBool2()) { const wantT = kind === 'text' ? 'String' : 'num'; if (!a.types.every((ty) => ty === wantT || ty === 'dynamic')) continue; atomsTried++;
      let ok = true; const sel = []; for (let i = 0; i < rows.length; i++) { let b; try { b = a.fn(kind === 'text' ? vals[i] : +vals[i], kind === 'text' ? String(cmpC[0]) : +cmpC[0]); } catch { ok = false; break; } if (b === true) sel.push(names[i]); else if (b !== false) { ok = false; break; } } if (ok && same(sel)) atomAgree.push(a); }
    if (atomAgree.length === 1) { const a = atomAgree[0]; const pattern = words.map((w) => escRe(defin(w))).join('\\s+') + '-?'; const e = { kind: 'atom', tmpl: pat, atom: a.name, file: a.file, pattern, field: kind, n: rows.length, marks, from: sentence }; save(e); CAP.addLearnedRel(e);
      out.changed = true; out.notes.push(fill(D.T.formAtomLearned, { tmpl: pat.join(' '), marks: marks.join(', '), n: rows.length, tried: combos.length + atomsTried, atom: a.name })); continue; }
    out.questions.push({ thing: r.thing, ask: 'define', key, q: agree.length ? fill(D.T.formMany, { key, marks: marks.join(', '), n: agree.length, cands: agree.map((c) => `«${rewrite(c)}»`).join(' · ') })
      : atomAgree.length ? fill(D.T.formAtomMany, { key, marks: marks.join(', '), n: atomAgree.length, cands: atomAgree.map((a) => a.name).join(' · ') }) : fill(D.T.formNone, { key, marks: marks.join(', '), tried: combos.length + atomsTried }) });
  }
  return out;
}
// ═══ ein.shape = tableShape ⊕ rowAtoms ⊕ run-on-examples ⊕ owner-yes ⇒ מסך
/** חיפוש לפי צורה (הכרעת-בעלים 24.9 «העיקרון שחסר»): קטע שיש בו חלק שלא נקרא (none) או דבר בלי שדות, ליד ישות עם דוגמאות שיש בה עמודת-מספר/מצביע
 *  ⇒ yeshiva/shape.search (צורת-הטבלה מול אטומי-רשימה, הרצה על הדוגמאות, סינון-השפעה) ⇒ התוצאה על הדוגמאות מוצגת ⇒ «כן» ⇒ נרשם + answers.__shape ⇒ routeOf מסמן 'shape'. */
export async function shapeSearch(sentence, form, routed, answers, skip = new Set()) {
  const out = { notes: [], questions: [], handled: new Set(), changed: false };
  if (answers.__shape) return out;
  const ents = form.things.filter((t) => t.fields && t.fields.length && t.examples && t.examples.length); if (!ents.length) return out;
  const loose = routed.routes.filter((r) => !skip.has(r.thing) && (r.route === 'none' || (r.route === 'appds' && !((form.things.find((t) => t.label === r.thing) || {}).fields || []).length)));   // סעיף שסוג אחר כבר לקח (צורה/נולד) — לא נשאל פעמיים
  if (!loose.length) return out;
  const SH = await import('./shape.mjs');
  for (const seg of [...new Set(loose.map((r) => (form.things.find((t) => t.label === r.thing) || {}).src).filter(Boolean))]) {
    const things = form.things.filter((t) => t.src === seg && loose.some((r) => r.thing === t.label)).map((t) => t.label); if (!things.length) continue;
    for (const ent of ents) {
      const r = await SH.search(ent); if (!r.results.length) { if (r.shape.some((c) => c.kind !== 'key' && c.kind !== 'text')) out.notes.push(fill(D.T.shapeNone, { seg, ent: ent.label, shape: r.shape.map((c) => `${c.label}=${c.kind}`).join(' · '), atoms: SH.rowAtoms().length, tried: r.tried })); continue; }
      const sig = r.shape.map((c) => c.kind).join(','); const key = things[things.length - 1];
      const L = SH.layoutOf(r.results[0].out); const show = (x) => { const lay = SH.layoutOf(x.out); return lay.rows.slice(0, 4).map((row) => [...new Set(Object.values(row).filter((v) => typeof v !== 'object' || Array.isArray(v)).map(SH.cellOf).filter(Boolean))].slice(0, 5).join(' ')).join(' · ') + (lay.scalars.length ? ' · ' + lay.scalars.map((k) => `${k} ${SH.cellOf(x.out[k])}`).join(' · ') : ''); };
      const known = formsAll().filter((x) => x.kind === 'table' && x.sig === sig && r.results.some((y) => y.atom.name === x.atom)).pop();
      const said = typeof answers[key] === 'string' ? answers[key].trim() : '';
      const pick = known ? r.results.find((y) => y.atom.name === known.atom) : said && (D.T.yesWords || []).includes(said) && r.results.length === 1 ? r.results[0] : said ? r.results.find((y) => y.atom.name === said) : null;
      for (const t of things) out.handled.add(t);
      if (!pick) { out.questions.push({ thing: key, ask: 'shape', key, q: r.results.length === 1 ? fill(D.T.shapeAsk, { seg, ent: ent.label, shape: r.shape.map((c) => `${c.label}=${c.kind}`).join(' · '), atom: r.results[0].atom.name, tried: r.tried, sample: show(r.results[0]) }) : fill(D.T.shapeMany, { seg, ent: ent.label, n: r.results.length, cands: r.results.map((y) => `${y.atom.name}: ${show(y)}`).join(' | ') }) }); break; }
      if (!known) { fs.mkdirSync(path.dirname(FORMS()), { recursive: true }); fs.appendFileSync(FORMS(), JSON.stringify({ at: new Date().toISOString(), kind: 'table', sig, atom: pick.atom.name, from: sentence }) + '\n'); }
      out.notes.push(known ? fill(D.T.shapeRecalled, { seg, ent: ent.label, shape: sig, atom: pick.atom.name, at: String(known.at).slice(0, 10) }) : fill(D.T.shapeLearned, { seg, ent: ent.label, atom: pick.atom.name, map: pick.map.map((m) => `${m.k}←${m.label}`).join(' · ') }));
      answers.__shape = { seg, things, ent: ent.label, atom: pick.atom.name, dart: pick.atom.dart, call: pick.atom.call, map: pick.map, out: pick.out, fields: ent.fields.map((f) => f.label) }; out.changed = true; void L; break;
    }
    if (out.changed) break;
  }
  return out;
}
/** דבר במסלול none בלי דוגמאות שתוויתו = צורך שנולד (מדף-הנולדים) ⇒ הדוגמאות שלו חוזרות לתשובת-התנהגות ⇒ הדלת מוצאת את הנולד בלי BFS. */
export async function bornRecall(form, routed, answers) {
  const notes = [], handled = new Set(); const B = await import('./born.mjs');
  for (const r of routed.routes.filter((x) => x.route === 'none')) {
    const t = form.things.find((x) => x.label === r.thing); if (!t || (t.ioExamples && t.ioExamples.length)) continue; const cur = answers[t.label]; if (cur && cur.behavior) continue;
    const b = B.byLabel(t.label); if (!b || !b.behavior) continue;
    answers[t.label] = { ...(cur || {}), behavior: b.behavior }; handled.add(t.label);
    notes.push(fill(D.T.bornRecalled, { thing: t.label, chain: b.chain.join('∘'), at: String(b.at).slice(0, 10), n: b.behavior.examples.length }));
  }
  return { notes, handled };
}
/** הלולאה: לכל סיבוב, הסוגים לפי הסדר בדאטה; שינוי במשפט ⇒ קריאה מחדש (formOf/routeOf של הקורא) ⇒ סיבוב נוסף, עד maxPasses */
export async function resolveEin({ sentence, form, routed, answers = {}, proposals = false, formOf, routeOf }) {
  const notes = [], questions = [], trace = []; const skip = new Set();   // skip: סעיפים שסוג-form לקח (שאלת-סימון) — word לא ישאל עליהם שוב
  for (let pass = 0; pass < (D.maxPasses || 5); pass++) {
    let changed = false;
    for (const K of D.kinds) {
      if (K.off) continue;
      if (K.kind === 'examplesIO') { const e = examplesIO(form, routed, answers); notes.push(...e.notes); if (e.notes.length) trace.push(`${pass}:${K.kind}`); continue; }
      if (K.kind === 'born') { const b = await bornRecall(form, routed, answers); notes.push(...b.notes); for (const x of b.handled) skip.add(x); if (b.notes.length) trace.push(`${pass}:${K.kind}`); continue; }
      if (K.kind === 'form') { const f = await learnForms(sentence, form, routed, answers); notes.push(...f.notes); for (const x of f.handled) skip.add(x); if (f.changed) { changed = true; sentence = f.sentence; form = formOf(sentence); routed = routeOf(form, answers, { proposals }); trace.push(`${pass}:${K.kind}`); } else questions.push(...f.questions.filter((q) => !questions.some((y) => y.key === q.key && y.thing === q.thing))); continue; }
      if (K.kind === 'shape') { const h = await shapeSearch(sentence, form, routed, answers, skip); notes.push(...h.notes); for (const x of h.handled) skip.add(x); questions.push(...h.questions.filter((q) => !questions.some((y) => y.key === q.key && y.thing === q.thing))); if (h.changed) { changed = true; routed = routeOf(form, answers, { proposals }); trace.push(`${pass}:${K.kind}`); } continue; }
      if (K.kind === 'word') { const d = await expandDefinitions(sentence, form, routed, answers, proposals, skip); notes.push(...d.notes); if (d.changed) { changed = true; sentence = d.sentence; form = formOf(sentence); routed = routeOf(form, answers, { proposals }); trace.push(`${pass}:${K.kind}`); break; } questions.push(...d.questions); continue; }
      throw new Error(`ein: ${D.T.unknownKind} «${K.kind}»`);
    }
    if (!changed) break;
  }
  return { sentence, form, routed, notes, questions, trace };
}
