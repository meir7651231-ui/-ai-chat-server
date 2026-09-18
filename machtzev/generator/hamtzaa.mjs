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
//    node hamtzaa.mjs --needs <needs.json> --goal <goal.txt>   # מצב-החלקיקים (למטה)
//    (‏--list מפרט כל שדה-מומצא · --json פלט-מכונה)
//
//  🧩 **מצב-החלקיקים (‏--needs · 17.9):** הספק אינו הצרכן היחיד של ההמצאה. כשמטרה
//  חופשית מפורקת לחלקיקי-פעולות-יסוד (‏`behavior-plan --needs`, אותו פורמט JSON),
//  כל צורך נושא **קבועים** (`consts`) ו**מפתחות-שדה בתוך הדוגמאות** (‏'due' · 'amount').
//  אלה שדות לכל דבר — ואיש לא בדק שיש להם מקור. כאן נסגר הפער: לכל אסימון
//  נדרש מקור, לפי אותה שרשרת-מקור של הפסק, בשלושה סוגים בלבד —
//    (1) **ליטרל** — המספר כתוב במטרה עצמה         (2) **מילה** — `sourceOf` על טקסט-המטרה
//    (3) **סכמה** — מילת-מטרה ⇒ `soleClassOf` ⇒ שקע ב-`schema-fields` (מפתח-אנגלית)
//  בלי אף אחד מהשלושה ⇒ **המצאה**, מדווחת בשמה. `--gate` ⇒ exit 1.
//  ממשק יציב לצינור (‏`behavior-plan --goal` קורא אותו): `--json` ⇒
//    { mode:'needs', goalWords, needs, chain:{classes,slots,open}, rows:[{need,ok,tokens,missing,sources}] }
//  fail-closed: 0 צרכים / 0 מילות-מטרה ⇒ exit 2 («הכלי שבור, לא הנתונים»).
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { interpret } from './entity.mjs';
import { definal } from './match.mjs';
import { nlToSpec } from './nl-spec.mjs';
import { specFromSentence, soleClassOf } from './tzinor.mjs';   // הצינור המשולב — מה ש-app-ds באמת מריץ
import * as R from '../root.mjs';
import { rminhu, had, pliga, lo, printNotes } from '../../yeshiva/rminhu.mjs';   // 🕯️ «אין» = «לא-חיפשת» (הכרעה-23)

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
// נרמול-אות-סופית לפני ההשוואה — `definal` של match.mjs, כלל-המורפולוגיה שכבר קיים
// בריפו (L57: לא כותבים כלל-שפה שני). בלעדיו 'סעיפים' בקלט אינו ממקר את 'סעיף'
// בספק (ף ≠ פ) והשער מאשים שדה **שנאמר** — אדום-שקר, הכשל החמור ביותר לשער חוסם.
const pfxHit = (a, b) => {
  const [s, l] = a.length <= b.length ? [definal(a), definal(b)] : [definal(b), definal(a)];
  return s.length >= MIN_PFX && l.startsWith(s);
};
function sourceOf(fieldWord, inputWords, deprefix) {
  const fv = [fieldWord, deprefix(fieldWord)];
  for (const u of inputWords) {
    const uv = [u, deprefix(u)];
    for (const f of fv) for (const x of uv) if (definal(x) === definal(f) || pfxHit(x, f)) return u;
  }
  return null;
}
// 🕯️ למה `sourceOf` החזיר null — **שלוש** דרכי-התאמה נבדקות (זהות אחרי `definal` · אות-שימוש
//    משני הצדדים · תחילית ≥MIN_PFX), והתשובה «אין מקור» יצאה אחת לשלושתן. בשער **חוסם**, שאומר
//    למשתמש «המצאת שדה», זה ההבדל בין «המילה לא נאמרה» לבין «נאמרה בצורה שהכלל לא תפס».
//    וגם: הקרוב-שנפל לא נאמר מעולם — «סעיפים» מול «סעיף» ו«ארנונה» מול «ארנונא» נראו זהה.
const near = (fieldWord, inputWords, deprefix) => {
  let best = null, bestN = 0;
  for (const u of inputWords) for (const x of [u, deprefix(u)]) for (const f of [fieldWord, deprefix(fieldWord)]) {
    const a = definal(x), b = definal(f); let n = 0;
    while (n < a.length && n < b.length && a[n] === b[n]) n++;
    if (n > bestN) { bestN = n; best = u; }
  }
  return { word: best, n: bestN };
};
export function sourcePsak(fieldWord, inputWords, deprefix, src, where) {
  if (src) {
    return rminhu({ engine: 'hamtzaa.sourceOf', matter: `${where} · מילת-שדה «${fieldWord}» ⇒ מקור בקלט`,
      searched: [`${inputWords.length} מילות-תוכן בקלט`],
      rulings: [had(src, definal(deprefix(src)) === definal(deprefix(fieldWord)) ? `זהות אחרי נרמול-אות-סופית/אות-שימוש (definal) — המילה נאמרה` : `תחילית משותפת ≥${MIN_PFX} אחרי definal — אותו שורש, נטייה אחרת`)] });
  }
  const nr = near(fieldWord, inputWords, deprefix);
  return rminhu({ engine: 'hamtzaa.sourceOf', matter: `${where} · מילת-שדה «${fieldWord}» ⇒ מקור בקלט`,
    searched: [`${inputWords.length} מילות-תוכן בקלט`],
    rulings: [
      lo('זהות (definal)', `אף מילת-קלט אינה זהה ל-«${fieldWord}» אחרי נרמול-אות-סופית — לא נאמרה כמות-שהיא`),
      lo('אות-שימוש (deprefix)', `הסרת אות-שימוש משני הצדדים (${'' + (inputWords.length ? 'על כל מילות-הקלט' : 'אין מילות-קלט')}) לא יצרה זהות`),
      nr.word
        ? pliga(`תחילית (MIN_PFX=${MIN_PFX})`, `הקרוב ביותר הוא «${nr.word}» עם ${nr.n} תווים משותפים — ${nr.n >= MIN_PFX ? 'ובכל זאת אינו תחילית מלאה של אחד מהם' : `מתחת לרצפת-${MIN_PFX}, ולכן אינו ראיה (תחילית קצרה הייתה מאשרת כל שדה)`}`)
        : lo(`תחילית (MIN_PFX=${MIN_PFX})`, 'אין אף מילת-קלט להשוות אליה — הקלט ריק ממילות-תוכן, וזה «לא-קראנו» ולא «המציא»'),
    ] });
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
    // 🕯️ `catch { continue }` דילג על **שורת-ספק שלמה** בשקט: שורה שהצרכן-האמיתי לא מצליח
    //    לפרסר אינה נבדקת להמצאה, והשער נשאר ירוק עליה. הנעילה fail-closed שבראש הקובץ תופסת
    //    רק «אפס שדות בכלל»; **חֶסֶר-חלקי** (‏L110 §3) עבר בשתיקה. הזרימה לא שוניתי (חוק-7) —
    //    מה שנוסף הוא שהדילוג אומר את עצמו, ובשם השגיאה.
    let r;
    try { r = interpret(t); } catch (e) {
      rminhu({ engine: 'hamtzaa.interpret', matter: `שורת-ספק «${t.slice(0, 50)}» ⇒ סכמה`,
        searched: ['entity.interpret (הצרכן-האמיתי של הספק)'],
        rulings: [lo('entity.interpret', `**זרק** ${e && e.name ? e.name : 'שגיאה'}: ${String((e && e.message) || e).slice(0, 100)} — השורה מדולגת ושדותיה **אינם נבדקים להמצאה**; ירוק כאן הוא «לא-נבדק»`)] });
      continue;
    }
    for (const s of (r.schema || [])) {
      let fw = contentWords(heWords(s.label));
      if (!fw.length) fw = heWords(s.label);   // שדה שכולו-פיגום: בודקים אותו כמו-שהוא, לא פוטרים
      if (!fw.length) continue;                // אין מילה-עברית כלל ⇒ לא שדה-עברית
      let src = null;
      for (const w of fw) { src = sourceOf(w, inputWords, deprefix); if (src) break; }
      sourcePsak(fw[0], inputWords, deprefix, src, `ישות «${r.entity}» · שדה «${s.label}»`);
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

// ── מצב-החלקיקים: צורך ⇒ אסימונים ⇒ מקור (§20-ג · L57) ────────────────────
const KEY_RE = /'([A-Za-z_][A-Za-z0-9_]*)'\s*:|\[\s*'([A-Za-z_][A-Za-z0-9_]*)'\s*\]/g;
const unq = (t) => String(t).replace(/^['"]|['"]$/g, '');

/** שרשרת-המקור של המטרה: מילת-תוכן ⇒ מחלקה-יחידה ⇒ שקעי-הסכמה שלה (מפתח ⇒ מוצא).
 *  `soleClassOf` הוא **אותו** כלל-הכרעה שהפסק מריץ (tzinor) — לא כלל שני (L1). */
export function goalChain(goalText, lang = LANG) {
  const words = [...new Set(heWords(goalText).filter((w) => !lang.scaffold.has(w)))];
  const slots = new Map(); const classes = []; const open = [];
  for (const w of words) {
    const k = soleClassOf(w); if (!k) continue;
    if (!k.cls) { open.push({ word: w, options: k.options }); continue; }   // כמה מועמדים ⇒ מתג, לא הכרעה
    classes.push({ word: w, cls: k.cls });
    for (const f of (k.fields || [])) if (f.src && !slots.has(f.name)) slots.set(f.name, { src: f.src, cls: k.cls, word: w });
  }
  return { slots, classes, open };
}

/** צורך ⇒ האסימונים שחייבים מקור: כל `consts`, וכל מפתח-שדה שמופיע בדוגמאות
 *  (‏`{'due': …}` · `r['amount']`). ערכי-דוגמה אינם אסימונים — רק מפתחות. */
export function needTokens(need) {
  const out = new Map();
  for (const c of (need.consts || [])) out.set(String(c), 'consts');
  const walk = (v) => {
    if (typeof v === 'string') { for (const m of v.matchAll(KEY_RE)) { const k = "'" + (m[1] || m[2]) + "'"; if (!out.has(k)) out.set(k, 'examples'); } }
    else if (Array.isArray(v)) v.forEach(walk);
  };
  (need.examples || []).forEach(walk);
  return out;
}

/** אסימון ⇒ מקור, או null. שלושה סוגים בלבד; אין סוג רביעי ואין ניחוש. */
export function tokenSource(tok, goalText, chain, inputWords, deprefix) {
  const raw = unq(tok);
  // 🕯️ התיעוד כאן אומר «שלושה סוגים בלבד; אין סוג רביעי ואין ניחוש» — והקוד **לא אמר איזה
  //    מהשלושה נפל**. שלושת המסלולים בלעדיים (מספר ⇒ ליטרל · עברית ⇒ מילה · אחרת ⇒ סכמה),
  //    ולכן `null` נשא שלוש משמעויות שונות לגמרי. זו בדיוק ∅ של `purpose.goalPsak` (דוח-הסגירה
  //    §6), וכאן היא עוד לא תוקנה. הערך המוחזר אינו זז (חוק-7).
  const psak = (rulings) => rminhu({ engine: 'hamtzaa.tokenSource', matter: `אסימון «${raw}» ⇒ מקור`,
    searched: [`מטרה (${inputWords.length} מילות-תוכן) · שרשרת-סכמה (${chain.slots.size} שקעים · ${chain.classes.length} מחלקות)`], rulings });
  if (/^\d[\d.,]*$/.test(raw)) {
    const inGoal = String(goalText).includes(raw);
    psak([
      inGoal ? had('ליטרל במטרה', `המספר "${raw}" מופיע בטקסט-המטרה כמות-שהוא`)
        : lo('ליטרל במטרה', `המספר "${raw}" אינו מופיע בטקסט-המטרה — קבוע שנכתב בקוד ולא נאמר (§20-ג)`),
      lo('מילה במטרה', `"${raw}" הוא מספר ולא מילה-עברית — סוג-המקור השני אינו חל עליו`),
      lo('שרשרת-סכמה', `"${raw}" הוא מספר — שרשרת-הסכמה ממפה מילות-תוכן למחלקות, לא ליטרלים`),
    ]);
    return inGoal ? { kind: 'ליטרל', src: `מטרה (ליטרל "${raw}")` } : null;
  }
  const he = heWords(raw);
  if (he.length) {
    const hits = he.map((w) => sourceOf(w, inputWords, deprefix));
    const ok = hits.every(Boolean);
    const miss = he.filter((w, i) => !hits[i]);
    psak([
      lo('ליטרל במטרה', `"${raw}" אינו מספר — סוג-המקור הראשון אינו חל עליו`),
      ok ? had('מילה במטרה', `כל ${he.length} מילות-האסימון נמצאו בקלט: ${hits.join(' ')}`)
        : lo('מילה במטרה', `${miss.length} מ-${he.length} מילות-האסימון בלי מקור בקלט: ${miss.join('/')} — **חלקי הוא כישלון** (מילה אחת שנאמרה אינה ממקרת אסימון שלם)`),
      lo('שרשרת-סכמה', `"${raw}" מכיל עברית ⇒ נבדק כמילה; שרשרת-הסכמה נבדקת רק על מפתחות לועזיים`),
    ]);
    return ok ? { kind: 'מילה', src: `מטרה (מילה "${hits.join(' ')}")` } : null;
  }
  const sl = chain.slots.get(raw);
  psak([
    lo('ליטרל במטרה', `"${raw}" אינו מספר`),
    lo('מילה במטרה', `"${raw}" אינו מכיל אות עברית — מפתח לועזי, ולכן נשאל רק מול שרשרת-הסכמה`),
    sl ? had('שרשרת-סכמה', `${sl.src} ⇐ «${sl.word}» ⇒ ${sl.cls}`)
      : lo('שרשרת-סכמה', `המפתח "${raw}" אינו באף אחד מ-${chain.slots.size} שקעי-הסכמה של ${chain.classes.length} המחלקות שהמטרה הגיעה אליהן${chain.open && chain.open.length ? ` (${chain.open.length} מילות-מטרה נשארו בלי מחלקה-יחידה)` : ''} — «אין-ישות», לא «אין-יכולת» (PLAN-100 §2-ב)`),
  ]);
  if (sl) return { kind: 'סכמה', src: `${sl.src} ⇐ «${sl.word}» ⇒ ${sl.cls}` };
  return null;
}

/** גרעין מצב-החלקיקים · טהור: (טקסט-מטרה, אובייקט-צרכים) ⇒ שורה לכל צורך. */
export function detectInventedNeeds(goalText, needsObj, lang = LANG) {
  const deprefix = (w) => (w.length > MIN_PFX ? w.replace(new RegExp('^[' + lang.prefixLetters + ']'), '') : w);
  const inputWords = [...new Set(heWords(goalText).filter((w) => !lang.scaffold.has(w)))];
  const chain = goalChain(goalText, lang);
  const rows = [];
  for (const [id, need] of Object.entries(needsObj || {})) {
    const toks = needTokens(need || {});
    const sources = {}; const missing = [];
    for (const [tok, where] of toks) {
      const hit = tokenSource(tok, goalText, chain, inputWords, deprefix);
      if (hit) sources[tok] = hit.src; else missing.push({ token: tok, where });
    }
    rows.push({ need: id, ok: !missing.length, tokens: toks.size, missing, sources });
  }
  return {
    mode: 'needs', goalWords: inputWords.length, needs: rows.length,
    chain: { classes: chain.classes, slots: chain.slots.size, open: chain.open },
    rows, invented: rows.filter((r) => !r.ok),
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

/** מסלול-המשפט-החופשי: כל שורה ב-nl-smoke.txt (קלט) ⇒ **הספק שהמחולל באמת פולט**.
 *  זה בדיוק מה ש-`app-ds.mjs` עושה בדלת-הקלט-החופשי: הצינור המשולב קודם
 *  (`specFromSentence` — מקור-אמת), ו-`nlToSpec` רק כנפילה-לאחור. מדידה על
 *  `nlToSpec` לבדו הייתה מודדת את הנפילה ולא את המחולל (ירוק/אדום-חלול · L27). */
export function routeNl() {
  const src = readIf(GEN + 'nl-smoke.txt');
  const pairs = [];
  for (const line of String(src || '').split(/\r?\n/)) {
    const t = line.trim(); if (!t || t.startsWith('#')) continue;
    let spec = '';
    try { const r = specFromSentence(t); if (r.spec.trim()) spec = r.spec; } catch { spec = ''; }
    if (!spec.trim()) spec = nlToSpec(t);
    pairs.push({ id: t.slice(0, 40), input: t, spec });
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
  // 🎯 אות-סופית: 'סעיפים' בקלט ⇒ 'סעיף' בספק **נאמר**. בלי definal זה היה אדום-שקר.
  ok('אות-סופית: ריבוי בקלט ⇒ מקור ליחיד', inv('לבדוק את הסעיפים בחוזה', 'ישות ממצא עם סעיף').length === 0);
  // 🎯 מילת-פיגום אינה ראיה: 'מה' בקלט אינו ממקר את השדה 'מה לבקש' (ירוק-שקר).
  ok('מילת-פיגום אינה מקור', inv('מה קורה בתיק', 'ישות ממצא עם מה לבקש').join() === 'מה לבקש');
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

  // ── מצב-החלקיקים: אותה הרעלה, על צרכים ─────────────────────────────────
  const G = 'לדעת אילו תשלומים באיחור מעל 30 יום ולשלוח תזכורת עם הסכום';
  const N = (need) => detectInventedNeeds(G, { n1: need });
  ok('חלקיקים: קבוע שנכתב במטרה ⇒ מקור', N({ consts: ['30'] }).invented.length === 0);
  ok('חלקיקים: קבוע שלא נכתב במטרה ⇒ המצאה', N({ consts: ['45'] }).rows[0].missing.map((m) => m.token).join() === '45');
  ok('חלקיקים: מפתח-שדה מהסכמה ⇒ מקור', N({ examples: [["[{'amount': 5}]", 'r == 5']] }).invented.length === 0);
  ok('חלקיקים: מפתח-שדה בלי מקור ⇒ המצאה', N({ examples: [["[{'due': 'x'}]", 'r == 1']] }).rows[0].missing.map((m) => m.token).join() === "'due'");
  ok('חלקיקים: ערך-דוגמה אינו אסימון (רק מפתח)', N({ examples: [["'זזז', 3", "r.contains('זזז')"]] }).rows[0].tokens === 0);
  ok('חלקיקים: שרשרת-הסכמה נבנתה מהמטרה', detectInventedNeeds(G, { n1: {} }).chain.classes.length >= 1);
  ok('חלקיקים fail-closed: 0 צרכים מסומן', detectInventedNeeds(G, {}).needs === 0);
  ok('חלקיקים fail-closed: 0 מילות-מטרה מסומן', detectInventedNeeds('', { n1: { consts: ['30'] } }).goalWords === 0);

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
  // ── מצב-החלקיקים: --needs <needs.json> --goal <goal.txt> ──────────────
  if (has('--needs')) {
    const nf = A[A.indexOf('--needs') + 1], gf = has('--goal') ? A[A.indexOf('--goal') + 1] : null;
    const nraw = readIf(nf), goal = gf ? readIf(gf) : null;
    if (nraw == null || goal == null) { console.error('🛠️ hamtzaa: --needs <needs.json> --goal <goal.txt> — קובץ חסר (fail-closed)'); process.exit(2); }
    let needsObj; try { needsObj = JSON.parse(nraw); } catch (e) { console.error(`🛠️ hamtzaa: needs אינו JSON תקין — ${e.message} (fail-closed)`); process.exit(2); }
    const r = detectInventedNeeds(goal, needsObj);
    // 🔒 fail-closed (L27): 0 צרכים / 0 מילות-מטרה = הכלי שבור, לא הנתונים
    if (!r.needs || !r.goalWords) { console.error(`🛠️ hamtzaa: ${r.needs} צרכים · ${r.goalWords} מילות-מטרה — הכלי שבור, לא הנתונים (fail-closed)`); process.exit(2); }
    if (json) console.log(JSON.stringify(r, null, 2));
    else {
      const tk = r.rows.reduce((a, x) => a + x.tokens, 0), miss = r.rows.reduce((a, x) => a + x.missing.length, 0);
      console.log(`needs: ${r.needs} צרכים · ${tk} אסימונים · ${miss} בלי-מקור (${pct(miss, tk)}%) · ${r.invented.length}/${r.needs} צרכים עם המצאה`);
      console.log(`  שרשרת: ${r.chain.classes.length} מחלקות (${r.chain.classes.map((c) => `${c.word}⇒${c.cls}`).join(' · ') || '—'}) · ${r.chain.slots} שקעים · ${r.chain.open.length} מתגים`);
      for (const row of r.rows) {
        const tag = row.ok ? '✅' : '🚨';
        console.log(`  ${tag} ${row.need}: ${row.tokens - row.missing.length}/${row.tokens} עם מקור${row.missing.length ? ' — המצאה: ' + row.missing.map((m) => `${m.token}[${m.where}]`).join(', ') : ''}`);
        if (list) for (const [t, src] of Object.entries(row.sources)) console.log(`       ✓ ${t} ← ${src}`);
      }
    }
    printNotes('hamtzaa');
    if (has('--gate') && r.invented.length) { console.error(`🚨 hamtzaa: ${r.invented.length}/${r.needs} צרכים עם אסימון בלי מקור במטרה — המצאה (L57)`); process.exit(1); }
    process.exit(0);
  }
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
  else if (has('--gate') || has('--ratchet') || !A.length) rs = [routePeruks(), routeNl()];
  else { console.log('usage: node hamtzaa.mjs [--gate|--ratchet|--peruks|--nl|--peruk N|--file <in> <spec>|--needs <needs.json> --goal <goal.txt>] [--list] [--json]'); process.exit(0); }

  assertRan(rs);
  printNotes('hamtzaa');
  if (json) console.log(JSON.stringify(rs, null, 2));
  else rs.forEach((r) => report(r, list || !(has('--gate') || has('--ratchet'))));
  const bad = rs.reduce((a, r) => a + r.invented.length, 0);
  const all = rs.reduce((a, r) => a + r.fields, 0);
  // ── --ratchet: מצב-המשטרה. חוב-ההמצאה **רק-יורד**, והכיסוי **רק-עולה** ──────
  // למה לא --gate ישירות: החוב היום 211/408 — שער-אדום היה חוסם כל commit ומכבה
  // את עצמו. ratchet נועל את המדידה של היום כרצפה: אי-אפשר להוסיף המצאה, אי-אפשר
  // להוריד חוב ע"י צמצום-הנמדד (זוגות/שדות), וכל ירידה אמיתית נכתבת לרצפה.
  if (has('--ratchet')) {
    const B = JSON.parse(fs.readFileSync(GEN + 'hamtzaa-baseline.json', 'utf8'));
    const fails = [];
    for (const r of rs) {
      const b = (B.routes || {})[r.route];
      if (!b) { fails.push(`${r.route}: אין רצפה במניפסט`); continue; }
      const inv = r.invented.length;
      if (inv > b.invented) fails.push(`${r.route}: ${inv} המצאות > רצפה ${b.invented} (חוב רק-יורד)`);
      if (r.pairs < b.pairs) fails.push(`${r.route}: ${r.pairs} זוגות < רצפה ${b.pairs} (כיסוי רק-עולה)`);
      if (r.fields < b.fields) fails.push(`${r.route}: ${r.fields} שדות < רצפה ${b.fields} (כיסוי רק-עולה)`);
      const mark = inv < b.invented ? ` ⬇ ${b.invented - inv}` : '';
      console.log(`  ${r.route}: ${inv}/${r.fields} בלי-מקור (רצפה ${b.invented})${mark}`);
    }
    if (fails.length) { for (const m of fails) console.error('🚨 hamtzaa: ' + m); process.exit(1); }
    const drop = rs.reduce((a, r) => a + (((B.routes || {})[r.route] || {}).invented - r.invented || 0), 0);
    console.log(`✅ hamtzaa: ${bad}/${all} בלי-מקור, רצפה ${B.total.invented}${drop ? ` ⬇ ${drop} — עדכן את המניפסט` : ''}`);
    process.exit(0);
  }
  if (has('--gate')) {
    if (bad) { console.error(`🚨 hamtzaa: ${bad}/${all} שדות בלי מקור בקלט — המצאה (L57 · אין המצאה)`); process.exit(1); }
    console.log(`✅ hamtzaa: ${all}/${all} שדות עם מקור בקלט`);
  }
}
