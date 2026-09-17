#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════
//  tzinor.mjs — הצינור-המשולב: משפט-בעברית ⇒ תחום + לכל מילת-ישות **כל** המועמדים
//  כאפשרויות **בנויות** (מחלקה + שדות-אמת + file:key לכל שדה). אפס-המצאה.
//
//  חוק-הבעלים (§20-ג · הכרעה-24): **המחולל לא מחליט, ואסור לו לנחש.**
//  ספק ⇒ בונים את כל האפשרויות ופולטים מתג; הבעלים מדליק ומכבה. לכן `pick`
//  תמיד `null` כשיש יותר ממועמד אחד, ולעולם אין שדה שלא נחצב ממקור-אמת.
//
//  שלושה מקורות-אמת (נקראים, לא משוכפלים):
//    • new/atoms/vertical-packs.mjs      — 13 חבילות-ורטיקל, לכל אחת terms (מילה⇒entity.key)
//    • machtzev/generator/entity-terms.data.json — 32 מונחים (key⇒entity + forms)
//    • new/atoms/schema-fields.mjs       — FIELDS: 492 שדות ב-54 מחלקות
//  ומסלול-סגור אחד: sentence.resolve() (GENMAX · G5f) — ranked, עד 4 מועמדים.
//
//  **כל שדה נושא `src`. שדה בלי `src` = באג** — `audit()` מפיל את השער.
//  אפס DEF_FIELDS: המנוע לעולם אינו משלים רביעיית-ברירת-מחדל (זו ההמצאה שנסגרה כאן).
//
//  שני תיקוני-פירוק שנושאים כאן (nl-spec לא נגעה — המנוע החדש בצד):
//    • עוגן-'לכל' כולל נקודתיים (nl-spec.mjs:25 החמיץ אחרי ':')
//    • זנב-מעורב: פריט-רבים אחד אינו מעיף את כל הסעיף; 'ות' היא גם סיומת-יחיד,
//      ולכן פריט-יחיד בזנב-מעורב נשאר מילת-ישות מועמדת **וגם** שדה-אפשרי של הראש
//      (nl-spec.mjs:74 הכריע לצד אחד). ההכרעה — לבעלים.
//  ושני תיקוני-ניקוד מול sentence.mjs (שם: `w.includes(fw)` ו-`if (hit)`):
//    • startsWith במקום includes — סוף התאמות-תאונה ("שולחנות" ⇒ ShopStore)
//    • hit === fws.length — צורה דו-מילתית חייבת להתאים במלואה
//  המקור עצמו לא נגע (נעול-חתימה ב-pins.sha256; שער sentence 16/16 נשאר).
//
//  הרצה:  node machtzev/generator/tzinor.mjs --text "<משפט>"
//         node machtzev/generator/tzinor.mjs --gate        (מול tzinor-golden.json)
//         node machtzev/generator/tzinor.mjs --smoke       (מדידה על nl-smoke.txt)
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as R from '../root.mjs';
import { VERTICAL_PACKS } from '../../new/atoms/vertical-packs.mjs';
import { FIELDS } from '../../new/atoms/schema-fields.mjs';
import { normSearch } from '../../new/atoms/norm-search.mjs';
import { NORM_SEARCH_T } from '../../new/atoms/norm-search-strings.mjs';
import { stem } from './match.mjs';
import { resolve as sentenceResolve } from './sentence.mjs';

// ── נתיבי-המקורות (מופיעים כלשונם ב-src של כל שדה ושל כל ראיה) ──
export const SRC = {
  packs: 'new/atoms/vertical-packs.mjs',
  terms: 'machtzev/generator/entity-terms.data.json',
  fields: 'new/atoms/schema-fields.mjs',
  lang: 'machtzev/generator/nl-lang.data.json',
  sentence: 'machtzev/generator/sentence.mjs',
};

const LANG = JSON.parse(fs.readFileSync(R.GEN_DIR + 'nl-lang.data.json', 'utf8'));
const ALL_TERMS = JSON.parse(fs.readFileSync(R.GEN_DIR + 'entity-terms.data.json', 'utf8')).terms;
const BY_KEY = new Map(ALL_TERMS.map((t) => [t.key, t]));
const CLASSES = new Set(FIELDS.map((f) => f.e));

// ── ידע-השפה — כולו מהאטום nl-lang.data.json (מנגנון-עיוור · §19) ──
const LEAD = new Set(LANG.leadins || []);
const MARK = LANG.fieldMarks || [];
const CONJ = LANG.listConj || [];
const INTRO = LANG.introMarks || [];
const EACH = LANG.eachWords || [];
const IMPLIED = LANG.impliedMark || '';
const PLURAL_RE = new RegExp('(' + (LANG.pluralSuffixes || []).join('|') + ')$');
const heWords = (s) => [...(s || '').matchAll(/[֐-׿][֐-׿'"׳״]*/g)].map((m) => m[0]);
const content = (ws) => ws.filter((w) => w.length > 1 && !LEAD.has(w) && !MARK.includes(w) && !CONJ.includes(w));
const pluralW = (w) => PLURAL_RE.test(w || '');
const deL = (w) => (w.length >= 4 && w[0] === 'ל' && !PLURAL_RE.test(w)) ? w.slice(1) : w;
const nameOf = (s) => content(heWords(s)).slice(0, 2).join(' ') || null;
const headName = (s) => { const c = content(heWords(s)); return c.length ? [deL(c[0]), ...c.slice(1, 2)].join(' ') : null; };
// תיקון-פירוק א' · העוגן כולל נקודתיים: "…לספרייה: כל ספר עם…" (היה `(?:^|[,،]\s*)` בלבד)
const EACH_RE = (EACH.length && IMPLIED) ? new RegExp(`(?:^|[,،:]\\s*)(?:${EACH.join('|')})\\s+([֐-׿]{2,})\\s+(?=[֐-׿])`, 'g') : null;
const MARK_RE = MARK.length ? new RegExp(`\\s+(?:${MARK.join('|')})\\s+`) : null;
const INTRO_RE = INTRO.length ? new RegExp(`\\s*[${INTRO.join('')}]\\s*`) : null;
const ITEM_RE = new RegExp(`\\s*[,،]\\s*${CONJ.length ? `|\\s+(?:${CONJ.join('|')})(?=[֐-׿])` : ''}`);
const splitItems = (s) => s.split(ITEM_RE).map((x) => x.trim()).filter(Boolean);

// ── מורפולוגיה מינימלית (כלל-שפה, לא דומיין) — כמו sentence.mjs:28, נורמל דרך אטום-המדף ──
const nz = (w) => normSearch(w, NORM_SEARCH_T);
const PREFIX = /^[הולבמשכ]/;
const strip = (w) => PREFIX.test(w) ? w.slice(1) : w;
const variants = (fw) => new Set([fw, nz(fw + 'ים'), nz(fw.endsWith('ה') ? fw.slice(0, -1) + 'ות' : fw + 'ות')]);
// צורה עם '/' = חלופות ("בן/בת משפחה" · "רכב/פריט") — כלל-פורמט של TERM_DEFS, לא מילון
export const altForms = (f) => {
  const ws = String(f).split(' '); const i = ws.findIndex((w) => w.includes('/'));
  if (i < 0) return [f];
  return ws[i].split('/').flatMap((a) => altForms([...ws.slice(0, i), a, ...ws.slice(i + 1)].join(' ')));
};

/** ניקוד-צורה מתוקן. מחזיר 0 כשלא **כל** מילות-הצורה תאמו (sentence.mjs שם: `if (hit)`),
 *  ומסתפק ב-startsWith במקום includes (שם: `w.includes(fw)` ⇒ "שולחנות" בלע "חנות"). */
export function scoreForm(words, form) {
  const fws = heWords(form).map(nz);
  if (!fws.length) return 0;
  let sum = 0, hit = 0;
  for (const fw of fws) {
    let best = 0; const vs = variants(fw);
    for (const w of words) {
      let s = 0;
      if (w === fw) s = 3;
      else if (vs.has(w) || vs.has(strip(w))) s = 2;
      else if (fw.length >= 3 && (w.startsWith(fw) || strip(w).startsWith(fw))) s = 1;
      if (s > best) best = s;
    }
    if (best) { sum += best; hit++; }
  }
  return hit === fws.length ? +(sum / fws.length).toFixed(2) : 0;
}

/** מפתח-מונח ⇒ מחלקת-סכמה. הסדר: (1) הצהרת-הבעלים ב-entity-terms · (2) CAP(xxx) ·
 *  (3) CAP ביחיד (מפתח-רבים). `entity:null` ב-entity-terms = **הצהרה** שאין מחלקה — לא המצאה. */
export function keyToClass(key) {
  const x = key.startsWith('entity.') ? key.slice(7) : key;
  const t = BY_KEY.get(key);
  if (t && t.entity) return { cls: t.entity, via: `${SRC.terms}:${key}.entity` };
  if (t && t.entity === null) return { cls: null, via: `${SRC.terms}:${key}.entity=null (מוצהר: אין מחלקת-סכמה)` };
  const c = x[0].toUpperCase() + x.slice(1);
  if (CLASSES.has(c)) return { cls: c, via: `כלל CAP(${x}) ⇒ ${c} ∈ ${SRC.fields}` };
  const sing = c.endsWith('s') ? c.slice(0, -1) : null;
  if (sing && CLASSES.has(sing)) return { cls: sing, via: `כלל CAP(${x}) ביחיד ⇒ ${sing} ∈ ${SRC.fields}` };
  return { cls: null, via: `כלל CAP(${x}) — אין מחלקה ב-${SRC.fields}` };
}

/** שדות-האמת של מחלקה. כל שדה נושא file:key מדויק — בלעדיו זה באג (audit מפיל). */
export function fieldsOf(cls) {
  return FIELDS.filter((f) => f.e === cls).map((f) => ({
    name: f.n, type: f.t, optional: !!f.o, src: `${SRC.fields}:FIELDS#${cls}.${f.n}`,
  }));
}

/** משפט ⇒ מילות-ישות מועמדות (+ מילות-תחום). אפס הכרעה: מילה שהיא גם שדה-אפשרי
 *  נשארת ברשימה, והאפשרות "לא ישות" נבנית לה בהמשך. */
export function entityWords(text) {
  const t = String(text || '').replace(/[•]/g, ' ');
  const clauses = t.split(/[.;\n]+/).map((c) => c.trim()).filter((c) => heWords(c).length);
  const out = []; const seen = new Set(); const domainWords = [];
  const add = (word, fieldStrs, role, ci) => {
    if (!word || word.length < 2 || seen.has(word)) return; seen.add(word);
    const sentenceFields = [...new Set(fieldStrs.map((g) => content(heWords(g)).join(' ')).filter((f) => f.length > 1))];
    out.push({ word, sentenceFields, role, clause: ci });
  };
  clauses.forEach((rawClause, ci) => {
    const clause = EACH_RE ? rawClause.replace(EACH_RE, (m, w) => ` , ${w} ${IMPLIED} `) : rawClause;
    const iParts = INTRO_RE ? clause.split(INTRO_RE) : [clause];
    const work = iParts.length > 1 ? iParts.slice(1).join(' ') : clause;
    if (iParts.length > 1) {
      const pc = content(heWords(iParts[0]));
      if (pc.length && pluralW(pc[0])) add(deL(pc[0]), [], 'ראש-לפני-נקודתיים', ci);
      else if (pc.length) domainWords.push(deL(pc[0]));
    }
    const seg = MARK_RE ? work.split(MARK_RE) : [work];
    const headStr = seg[0], tailStr = seg.slice(1).join(' ');
    const headC = content(heWords(headStr));
    const headItems = splitItems(headStr).map(nameOf).filter(Boolean);
    const tailItems = tailStr ? splitItems(tailStr).filter((x) => content(heWords(x)).length) : [];
    const firstW = (s) => content(heWords(s))[0] || '';
    const tailPlural = tailItems.filter((x) => pluralW(firstW(x)));
    const tailSingular = tailItems.filter((x) => !pluralW(firstW(x)));
    const headIsEnt = headC.length > 0 && pluralW(headC[0]);
    if (!tailItems.length) {
      if (headItems.length > 1) headItems.forEach((h) => add(h, [], 'ראש-רשימה', ci));
      else add(headName(headStr) || headItems[0], [], 'ראש', ci);
    } else if (tailPlural.length) {
      // תיקון-פירוק ב' · זנב-מעורב: הראש (אם הוא ישות) מקבל את פריטי-היחיד כשדות-אפשריים,
      // **וכל** פריט-זנב נשאר מילת-ישות מועמדת — 'ות' היא גם סיומת-יחיד, וההכרעה לבעלים.
      if (headIsEnt) add(headName(headStr), tailSingular, 'ראש-עם-זנב', ci);
      else if (headC.length) domainWords.push(deL(headC[0]));
      tailItems.forEach((tt) => add(nameOf(tt), [], 'פריט-זנב', ci));
    } else if (headItems.length > 1) {
      headItems.slice(0, -1).forEach((h) => add(h, [], 'ראש-רשימה', ci));
      add(headItems[headItems.length - 1], tailSingular, 'ראש-עם-שדות', ci);
    } else {
      // זנב כולו-יחיד = רשימת-שדות ⇒ הראש הוא הישות, והזנב אינו מייצר מילות-ישות
      if (!headIsEnt && headC.length > 1) domainWords.push(deL(headC[0]));
      add(headName(headStr) || headItems[0], tailSingular, 'ראש-עם-שדות', ci);
    }
  });
  if (!out.length) add(nameOf(t) || LANG.fallbackName, [], 'גיבוי', 0);
  // מיזוג-גזע (כמו nl-spec:88): 'רכבים'/'רכב' = מילה אחת בשתי צורות. שומר את בעלת-השדות.
  const byStem = new Map();
  for (const e of out) {
    const k = stem(content(heWords(e.word))[0] || e.word);
    const prev = byStem.get(k);
    if (!prev) byStem.set(k, { ...e, forms: [e.word] });
    else {
      const forms = [...prev.forms, e.word];
      byStem.set(k, e.sentenceFields.length > prev.sentenceFields.length ? { ...e, forms } : { ...prev, forms });
    }
  }
  return { words: [...byStem.values()], domainWords };
}

/** תחומים מדורגים לפי ראיות. אין `pick` — אלא אם נשאר מועמד יחיד (ממה נפשך: אין ספק). */
export function domainsFor(words) {
  const ranked = [];
  for (const pack of VERTICAL_PACKS) {
    const evidence = [];
    for (const w of words) {
      const own = heWords(w).map(nz);
      for (const [k, v] of Object.entries(pack.terms || {})) {
        if (!k.startsWith('entity.')) continue;
        if (altForms(v).some((f) => scoreForm(own, f) >= 2)) { evidence.push(`${w} ≡ ${k} ("${v}")`); break; }
      }
    }
    if (evidence.length) ranked.push({ id: pack.id, label: pack.label, hits: evidence.length, src: `${SRC.packs}#${pack.id}`, evidence: [...new Set(evidence)] });
  }
  ranked.sort((a, b) => b.hits - a.hits || a.id.localeCompare(b.id));
  const top = ranked.filter((d) => ranked.length && d.hits === ranked[0].hits);
  return { ranked, pick: top.length === 1 ? top[0].id : null };
}

/** מילת-ישות ⇒ **כל** המועמדים, ממוזגים למחלקה. כל מועמד נושא את כל ראיותיו. */
export function candidatesFor(word) {
  const own = heWords(word).map(nz);
  const byKey = new Map();
  const note = (key, score, src) => {
    if (!score) return;
    const p = byKey.get(key);
    if (!p) byKey.set(key, { key, score, evidence: [src] });
    else { p.evidence.push(src); if (score > p.score) p.score = score; }
  };
  for (const pack of VERTICAL_PACKS) for (const [k, v] of Object.entries(pack.terms || {})) {
    if (!k.startsWith('entity.')) continue;
    for (const f of altForms(v)) note(k, scoreForm(own, f), `${SRC.packs}:${pack.id}.terms.${k} ("${v}")`);
  }
  for (const t of ALL_TERMS) for (const f of t.forms.flatMap(altForms)) {
    note(t.key, scoreForm(own, f), `${SRC.terms}:${t.key}.forms ("${f}")`);
  }
  // המסלול-הסגור: ranked (עד 4). כל מועמד שלו הופך לאפשרות — גם כשהניקוד-המתוקן דוחה אותו,
  // ואז הוא מסומן `strict:false` (חשוד כהתאמת-תאונה) ומגיע לבעלים מסומן, לא מושתק.
  const rk = sentenceResolve(word).ranked || [];
  const fromResolve = new Map();
  rk.forEach(([cls, sc], i) => fromResolve.set(cls, { score: sc, src: `${SRC.sentence}:resolve#ranked[${i}] (ניקוד ${sc})` }));

  const byClass = new Map();   // מחלקה ⇒ אפשרות בנויה אחת (מפתחות מרובים = ראיות נוספות)
  const noClass = [];
  for (const h of [...byKey.values()].sort((a, b) => b.score - a.score)) {
    const { cls, via } = keyToClass(h.key);
    if (!cls) { noClass.push({ kind: 'מונח-ללא-מחלקה', key: h.key, cls: null, via, score: h.score, fields: [], evidence: h.evidence }); continue; }
    const p = byClass.get(cls);
    if (!p) byClass.set(cls, { kind: 'מחלקת-סכמה', cls, keys: [h.key], via: [via], score: h.score, strict: true, evidence: [...h.evidence] });
    else { p.keys.push(h.key); p.via.push(via); p.evidence.push(...h.evidence); if (h.score > p.score) p.score = h.score; }
  }
  for (const [cls, r] of fromResolve) {
    const p = byClass.get(cls);
    if (p) p.evidence.push(r.src);
    else if (CLASSES.has(cls)) byClass.set(cls, { kind: 'מחלקת-סכמה', cls, keys: [], via: [`${SRC.sentence}:resolve (המסלול-הסגור)`], score: r.score, strict: false, evidence: [r.src] });
  }
  const out = [...byClass.values()].map((c) => ({ ...c, fields: fieldsOf(c.cls) }));
  out.sort((a, b) => (b.strict - a.strict) || (b.score - a.score) || a.cls.localeCompare(b.cls));
  return [...out, ...noClass];
}

/** מילה ⇒ **מחלקת-סכמה יחידה** או ספק. כלל-ההכרעה של §20 במקום אחד, כדי ששני
 *  הצרכנים (‏הפסק `yeshiva/purpose.mjs` ושער-ההמצאה `hamtzaa.mjs`) ישאלו את אותה
 *  שאלה ויקבלו את אותה תשובה: מועמד-אמת = יש מחלקה · יש שקעים · לא-רופף.
 *  יחיד ⇒ `{ cls, fields, src }` · כמה ⇒ `{ cls: null, options }` (מתג) · אין ⇒ null. */
export function soleClassOf(word) {
  let c = [];
  try { c = candidatesFor(word).filter((x) => x.cls && x.strict !== false && (x.fields || []).length); } catch { return null; }
  if (c.length === 1) return { cls: c[0].cls, fields: c[0].fields, src: (c[0].evidence || [])[0] || null };
  if (c.length > 1) return { cls: null, options: c.map((x) => x.cls) };
  return null;
}

/** משפט ⇒ מפרט-מתגים מלא. `pick` תמיד null כשיש יותר מאפשרות-סכמה אחת. */
export function toSwitches(text, origin = 'משפט') {
  const { words, domainWords } = entityWords(text);
  const all = words.map((w) => w.word);
  const domain = domainsFor([...all, ...domainWords]);
  const entities = words.map((w) => {
    const cands = candidatesFor(w.word);
    const options = cands.map((c) => ({
      id: c.cls ? `schema:${c.cls}` : `term:${c.key}`,
      kind: c.kind, on: false, cls: c.cls, keys: c.keys || [c.key],
      via: Array.isArray(c.via) ? c.via : [c.via],
      score: c.score, strict: c.strict !== false, fields: c.fields, evidence: c.evidence,
    }));
    options.push({
      id: 'new', kind: 'ישות-חדשה-מהמשפט', on: false, cls: null, keys: [], via: [], score: 0, strict: true,
      // שדות רק ממה שנאמר במשפט — אפס השלמה. אין שדות במשפט ⇒ אפס שדות (לא רביעייה).
      fields: w.sentenceFields.map((n) => ({ name: n, type: null, optional: true, src: `${origin}#סעיף${w.clause}` })),
      evidence: [`${origin}#סעיף${w.clause} ("${w.word}")`],
    });
    options.push({ id: 'none', kind: 'לא-ישות', on: false, cls: null, keys: [], via: [], score: 0, strict: true, fields: [], evidence: [`${origin}#סעיף${w.clause} (${w.role})`] });
    const schema = options.filter((o) => o.cls);
    return { word: w.word, forms: w.forms, role: w.role, clause: w.clause, sentenceFields: w.sentenceFields, pick: null, options, schemaOptions: schema.length };
  });
  return { text, origin, domain, entities };
}

/** ביקורת-הטוהר: שדה בלי src = באג · רביעיית-ברירת-מחדל = המצאה · pick לא-ריק = הכרעה אסורה. */
export function audit(spec) {
  const DEF = (LANG.defaultFields || []).join('|');
  const bad = [];
  if (spec.domain.pick && spec.domain.ranked.filter((d) => d.hits === spec.domain.ranked[0].hits).length > 1) bad.push('תחום: pick על תיקו');
  for (const e of spec.entities) {
    if (e.pick !== null) bad.push(`${e.word}: pick לא-ריק — המנוע הכריע`);
    for (const o of e.options) {
      for (const f of o.fields) if (!f.src) bad.push(`${e.word}/${o.id}: שדה "${f.name}" בלי src`);
      if (DEF && o.fields.map((f) => f.name).join('|') === DEF) bad.push(`${e.word}/${o.id}: רביעיית-ברירת-מחדל (המצאה)`);
    }
  }
  return { ok: !bad.length, violations: bad };
}

/** מדידת-הצינור על קורפוס: כמה נפתרו לשדות-אמת · כמה נשארו שאלה-פתוחה · כמה המצאות. */
export function measure(lines, origin) {
  const rows = []; let resolved = 0, open = 0, invented = 0, multi = 0, fieldsTotal = 0;
  lines.forEach((line, i) => {
    const spec = toSwitches(line, `${origin}:${i + 1}`);
    const a = audit(spec);
    invented += a.violations.length;
    for (const e of spec.entities) {
      const schema = e.options.filter((o) => o.cls && o.strict);
      if (schema.length) { resolved++; if (schema.length > 1) multi++; } else open++;
      fieldsTotal += schema.reduce((s, o) => s + o.fields.length, 0);
      rows.push({ line: i + 1, word: e.word, domain: spec.domain.pick, schema: schema.map((o) => `${o.cls}[${o.fields.length}]`), options: e.options.length });
    }
  });
  return { total: rows.length, resolved, open, multi, invented, fieldsTotal, rows };
}

// ── CLI ──
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const arg = (k) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : null; };
const SMOKE = R.GEN_DIR + 'nl-smoke.txt';
const GOLDEN = R.GEN_DIR + 'tzinor-golden.json';
const smokeLines = () => fs.readFileSync(SMOKE, 'utf8').split('\n').map((l) => l.trim()).filter(Boolean);

if (isMain && process.argv.includes('--gate')) {
  const gold = JSON.parse(fs.readFileSync(GOLDEN, 'utf8'));
  const m = measure(smokeLines(), 'machtzev/generator/nl-smoke.txt');
  const bad = [];
  if (m.invented !== 0) bad.push(`המצאות ${m.invented} ≠ 0`);
  for (const k of ['total', 'resolved', 'open', 'multi', 'fieldsTotal']) {
    if (m[k] !== gold.counts[k]) bad.push(`${k}: ${m[k]} ≠ ${gold.counts[k]}`);
  }
  const got = m.rows.map((r) => `${r.line}:${r.word}=${r.schema.join('+') || '—'}`);
  const want = gold.rows;
  if (got.length !== want.length) bad.push(`שורות ${got.length} ≠ ${want.length}`);
  else got.forEach((g, i) => { if (g !== want[i]) bad.push(`שורה ${i}: ${g} ≠ ${want[i]}`); });
  if (bad.length) { console.log('🔴 tzinor: ' + bad.slice(0, 8).join(' · ')); process.exit(1); }
  console.log(`✓ tzinor: ${m.total} מילות-ישות · ${m.resolved} לשדות-אמת (${m.fieldsTotal} שדות, כולם עם src) · ${m.open} שאלה-פתוחה · ${m.multi} רב-מועמדים · ${m.invented} המצאות`);
  process.exit(0);
}
if (isMain && process.argv.includes('--write-golden')) {
  const m = measure(smokeLines(), 'machtzev/generator/nl-smoke.txt');
  fs.writeFileSync(GOLDEN, JSON.stringify({
    _: 'זהב-הצינור-המשולב · נכתב ע"י node machtzev/generator/tzinor.mjs --write-golden',
    counts: { total: m.total, resolved: m.resolved, open: m.open, multi: m.multi, fieldsTotal: m.fieldsTotal, invented: m.invented },
    rows: m.rows.map((r) => `${r.line}:${r.word}=${r.schema.join('+') || '—'}`),
  }, null, 1) + '\n');
  console.log(`✍️ tzinor-golden ⇒ ${m.total} שורות`);
  process.exit(0);
}
if (isMain && process.argv.includes('--smoke')) {
  const lines = smokeLines();
  lines.forEach((l, i) => {
    const spec = toSwitches(l, `machtzev/generator/nl-smoke.txt:${i + 1}`);
    const d = spec.domain;
    console.log(`\n${i + 1}) ${l}`);
    console.log(`   תחום: ${d.pick ? d.pick + ' (הוכרע — מועמד יחיד)' : (d.ranked.length ? 'מתג ' + d.ranked.slice(0, 4).map((x) => `${x.id}(${x.hits})`).join(' | ') : '— אין מועמד')}`);
    for (const e of spec.entities) {
      const opt = (o) => o.cls ? `${o.cls}[${o.fields.length}]${o.strict ? '' : '⚠תאונה'}`
        : o.kind === 'מונח-ללא-מחלקה' ? `${o.keys[0]}(ללא-מחלקה)`
          : o.kind + (o.fields.length ? `[${o.fields.length}]` : '');
      console.log(`   • ${e.word} ⇒ ${e.options.map(opt).join(' | ')}`);
    }
  });
  const m = measure(lines, 'machtzev/generator/nl-smoke.txt');
  console.log(`\n══ ${m.total} מילות-ישות · נפתרו-לשדות-אמת ${m.resolved} · שאלה-פתוחה ${m.open} · רב-מועמדים ${m.multi} · שדות ${m.fieldsTotal} · המצאות ${m.invented}`);
  process.exit(0);
}
if (isMain && arg('--text')) {
  const spec = toSwitches(arg('--text'));
  const a = audit(spec);
  console.log(JSON.stringify({ ...spec, audit: a }, null, 1));
  process.exit(a.ok ? 0 : 1);
}
if (isMain) console.log('usage: tzinor.mjs --text "<משפט>" | --smoke | --gate | --write-golden');

// ── גשר-אל-app-ds: מתגים ⇒ מחרוזת-ספק (הפורמט שהמחולל קורא) ────────────────
//  ורמינהו (BUILD-ORDER-INTENT:16 — «nlToSpec נשאר לשלד-הנתונים»): לא מחליפים אותו,
//  **עוטפים**. מה ש-tzinor פתר ממקור-אמת גובר; מה שלא — נפלט **בלי שדות** (∅ מדווח,
//  L57), והמחולל נופל בשער-הישות-הריקה עם השמות. אף פעם לא DEF_FIELDS.
//  מועמד-יחיד ⇒ הוכרע. רב-מועמדים ⇒ pick נשאר null ⇒ ∅ + מתג לבעלים (חוק-הבעלים).
export function specFromSentence(text, origin = 'משפט') {
  const sw = toSwitches(text, origin);
  const lines = [], open = [], cls_ = [];
  for (const e of sw.entities) {
    const real = e.options.filter((o) => o.cls && o.fields.length && o.strict !== false);
    if (real.length === 1) {
      const noSrc = real[0].fields.filter((f) => !f.src);
      if (noSrc.length) throw new Error(`tzinor: ${noSrc.length} שדות בלי src ב-${e.word} — באג, לא פלט`);
    }
    // 🔤 שפת-האפיון עברית-בלבד: `interpret` מתייג כל מפתח-לא-עברי כשדה-סתמי אחד
    // (נמדד: name*⇒«שדה» · phone*⇒«שדה» · מחיר*⇒«מחיר»+טיפוס). לכן מפתח-סכמה
    // באנגלית **אינו נפלט** — אין לו מונח, ומה שאין לו מונח ⇒ ∅ מדווח, לא ניחוש
    // (L57 · §20-ג «שקע בלי-ערך-אמת ⇒ פסילה»). הוא נרשם כמתג עם מוצאו, לא כעמודה.
    const named = real.length === 1 ? real[0].fields.filter((f) => HE_RE.test(f.name)) : [];
    const unnamed = real.length === 1 ? real[0].fields.filter((f) => !HE_RE.test(f.name)) : [];
    if (real.length === 1) cls_.push({ word: e.word, cls: real[0].cls });
    if (real.length === 1 && unnamed.length) open.push({ word: e.word, options: e.options.length, cls: real[0].cls, fields: unnamed.map((f) => f.name), from: 'שקע-סכמה בלי מונח-עברי', srcs: [...new Set(unnamed.map((f) => f.src))] });
    if (real.length === 1 && named.length) lines.push(`${TPL.ent} ${e.word} ${TPL.with} ${named.map((f) => f.name + (f.optional ? '' : '*')).join(', ')}`);
    else {
      // אין-מונח / רב-מועמדים ⇒ **לא נופלים ולא ממציאים**: המסך נבנה, השדות פתוחים.
      // שדות-המשפט אם נאמרו; אחרת שדה-זיהוי בלבד — שלד שהמתג ימלא. מקור כל שדה
      // כאן הוא «המשפט שלך», ולכן hamtzaa לא רואה בו המצאה (L57 נשמר).
      const said = (e.sentenceFields || []).map((f) => (typeof f === 'string' ? f : f && f.name)).filter(Boolean);
      // שדה-הזיהוי כשלא נאמרו שדות: **המילה של הישות עצמה**, ביחיד אם יש צורה כזאת
      // («מטופלים» ⇒ «מטופל»). היא נאמרה במשפט ⇒ אפס המצאה. SKELETON נשאר רק אם
      // אין אפילו מילה (שלא יכול לקרות — ישות בלי מילה אינה ישות).
      // כלל-צורה בלבד, אפס-מילון (§23): «ים» סופי = ריבוי-זכר חד-משמעי ⇒ נושר
      // (מטופלים⇒מטופל · תורים⇒תור). «ות/יות» דו-משמעי (לקוחות⇒לקוח אבל הזמנות⇒הזמנ)
      // ⇒ **לא נוגעים**, המילה נשארת כפי שנאמרה. hamtzaa מכיר ריבוי⇒יחיד כמקור.
      const ident = (e.forms || []).find((f) => f && f !== e.word && e.word.startsWith(f))
        || (PLURAL_M.test(e.word) && e.word.length > 3 ? e.word.replace(PLURAL_M, '') : e.word);
      const fs_ = said.length ? said : [ident || SKELETON];
      lines.push(`${TPL.ent} ${e.word} ${TPL.with} ${fs_.join(', ')}`);
      open.push({ word: e.word, options: e.options.length, fields: fs_, from: said.length ? 'המשפט שלך' : 'מילת-הישות' });
    }
  }
  // 🧩 **פעולות-יסוד ⇒ חלקיקים** (G23·G2): הפעולות נגזרות מ**טיפוסי-השדות** ולכן
  // אינן תלויות במונח-עברי לשדה (שאינו קיים בריפו) — זה המסלול שעוקף את הקיר.
  // צורה שדורשת שם-שדה נשארת מתג. כישלון ⇒ בלי חלקיקים, לא קריסה.
  for (const c of cls_) {
    try { const pr = particlesFor(c.cls, c.word); lines.push(...pr.lines); if (pr.skipped.length) open.push({ word: c.word, cls: c.cls, options: pr.skipped.length, fields: pr.skipped, from: 'פעולת-יסוד שצורתה דורשת שם-שדה', srcs: ['machtzev/generator/shape-ops.json#' + c.cls] }); } catch { /* */ }
  }
  return { spec: lines.join('\n'), open, domain: sw.domain.pick, switches: sw };
}
import { particlesFor } from './ops-particles.mjs';   // פעולות-יסוד ⇒ חלקיקים (G23·G2)

const TPL = { ent: 'ישות', with: 'עם' };
const HE_RE = /[\u05d0-\u05ea]/;   // שם-שדה בלי אות-עברית = מפתח-סכמה, לא מונח
const PLURAL_M = /ים$/;   // ריבוי-זכר חד-משמעי (כלל-צורה · אפס-מילון · §23)
const SKELETON = 'שם';   // רשת-אחרונה בלבד: ישות בלי מילה (לא קורה). שדה-הזיהוי = מילת-הישות.

// ── שכבת-המטרה (BUILD-ORDER-INTENT · איטר׳ 3) ────────────────────────────────
//  ורמינהו פסק (:22): «צירוף-ה-caps גס/רועש ⇒ הסיגנל הוא **האטומים עצמם**».
//  לכן נושאים אטומים-שהותאמו עם ציונם, לא פרופיל-caps כהכרעה.
//  המילה קובעת **על-מה**; המטרה קובעת **מה בונים** — ולכן משפט שאף מילה בו לא
//  הוכרה עדיין מייצר מטרה ואינו נתקע. «חללית» ו«מסעדה» — אותו מסלול (§23).
export async function purposeOf(text, k = 14) {
  try {
    const { intentProfile } = await import('./intent.mjs');
    const p = intentProfile(text, k);
    return { atoms: p.atoms || [], caps: p.present || [], src: 'machtzev/generator/intent.mjs#intentProfile' };
  } catch { return { atoms: [], caps: [], src: null }; }
}
