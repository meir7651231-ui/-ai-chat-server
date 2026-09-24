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
export async function expandDefinitions(sentence, form, routed, answers, proposals) {
  let SLd = {}; try { SLd = JSON.parse(fs.readFileSync(path.join(R.GEN_DIR, 'spec-lang.data.json'), 'utf8')); } catch {}
  const out = { sentence, changed: false, notes: [], questions: [] };
  let orRe = null; try { const ow = JSON.parse(fs.readFileSync(path.join(R.GEN_DIR, 'spec-lang.data.json'), 'utf8')).orWords || []; if (ow.length) orRe = new RegExp('\\s+(?:' + ow.join('|') + ')\\s+'); } catch {}
  const ents = form.things.filter((t) => t.fields && t.fields.length);
  for (const r of routed.routes.filter((x) => x.route === 'none')) {
    const thing = form.things.find((t) => t.label === r.thing); if (!thing || (thing.ioExamples && thing.ioExamples.length)) continue;
    const tokens = toks(thing.label);
    let ei = -1, ent = null; tokens.forEach((w, i) => { const e = ents.find((t) => leadOf(w, t.label) != null); if (e) { ei = i; ent = e; } });
    const cands = ei >= 0 ? tokens.slice(ei + 1) : tokens.slice(1).filter((w) => !ents.some((t) => sameStem(w, t.label) || t.fields.some((f) => sameStem(w, f.label))));
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
    const b = { examples: t.ioExamples.map(([i, o]) => [q(i), `r == ${q(o)}`]), params: [ins.every(isNum) ? 'num' : 'String'], ret: outs.every(isNum) ? (outs.every((o) => /^-?\d+$/.test(String(o).trim())) ? 'int' : 'num') : 'String' };   // פלטים שלמים ⇒ int (חתימת-הקטלוג של gemValueWired היא int?)
    answers[t.label] = { ...(cur || {}), behavior: b };
    if (!process.env.BP_CAPV) process.env.BP_CAPV = '2000';   // צורך טקסט⇒מספר פותח מרחב-עצים עצום (נמדד: מחרוזת-הוכחה >512MB); תקרה — האטום המחווט נמצא בעומק 1
    notes.push(`${D.T.ioNote.replace('{thing}', t.label).replace('{n}', String(t.ioExamples.length)).replace('{sig}', `${b.params[0]} ⇒ ${b.ret}`)}`);
  }
  return { notes };
}
/** הלולאה: לכל סיבוב, הסוגים לפי הסדר בדאטה; שינוי במשפט ⇒ קריאה מחדש (formOf/routeOf של הקורא) ⇒ סיבוב נוסף, עד maxPasses */
export async function resolveEin({ sentence, form, routed, answers = {}, proposals = false, formOf, routeOf }) {
  const notes = [], questions = [], trace = [];
  for (let pass = 0; pass < (D.maxPasses || 5); pass++) {
    let changed = false;
    for (const K of D.kinds) {
      if (K.off) continue;
      if (K.kind === 'examplesIO') { const e = examplesIO(form, routed, answers); notes.push(...e.notes); if (e.notes.length) trace.push(`${pass}:${K.kind}`); continue; }
      if (K.kind === 'word') { const d = await expandDefinitions(sentence, form, routed, answers, proposals); notes.push(...d.notes); if (d.changed) { changed = true; sentence = d.sentence; form = formOf(sentence); routed = routeOf(form, answers, { proposals }); trace.push(`${pass}:${K.kind}`); break; } questions.push(...d.questions); continue; }
      throw new Error(`ein: ${D.T.unknownKind} «${K.kind}»`);
    }
    if (!changed) break;
  }
  return { sentence, form, routed, notes, questions, trace };
}
