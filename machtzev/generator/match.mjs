#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════
//  match.mjs — מנוע-האחזור של המחולל (למידה-מהאטומים, אפס-כללים-ידניים)
//  כל אטום-ווידג'ט נלמד מהתיאור-העברי שבכותרת-המקור שלו (atlas.he).
//  בקשה חופשית ⇒ טוקנים-מנורמלים ⇒ ציון stem∩ + IDF (נלמד מהקורפוס) ⇒ אטום.
//  אין מיפוי מילה→אטום כתוב-ביד. הידע כולו מהאטומים עצמם.
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import * as R from '../root.mjs';
import { rminhu, had, pliga } from '../../yeshiva/rminhu.mjs';   // 🕯️ «אין» = «לא-חיפשת» (הכרעה-23)

const HERE = R.GEN_DIR;
const readJson = (p, d) => { try { return JSON.parse(fs.readFileSync(path.join(HERE, p), 'utf8')); } catch { return d; } };

const atlas = (() => { const a = readJson('atlas.json', { widgets: [], functions: [] }); if (!a.data) { const d = readJson('atlas-data.json', { data: [] }); a.data = d.data || []; } return a; })();   // L93: פיצול-האטלס

// stemming עברי קליל (מנגנון-שפה טהור): נרמול-אות-סופית (ך/ם/ן/ף/ץ⇒כ/מ/נ/פ/צ) +
// קידומת-חיבור (ב/ל/ה/ו/מ/ש/כ) + סיומת (ים/ות/יות/ת/ה/י). הנרמול-הסופי אחרון ⇒
// 'תשלומים'(מ) ו-'תשלום'(ם) מתלכדים לאותו גזע. באג-מורפולוגיה שתוקן: חוסר-נרמול-סופי.
export const definal = (w) => w.replace(/ך$/, 'כ').replace(/ם$/, 'מ').replace(/ן$/, 'נ').replace(/ף$/, 'פ').replace(/ץ$/, 'צ');
export const stem = (w) => definal(w.replace(/^[בלהומשכ](?=..)/, '').replace(/(יות|ים|ות)$/, '').replace(/[התי]$/, ''));
const heTokens = (s) => [...(s || '').matchAll(/[֐-׿]{2,}/g)].map((m) => stem(m[0])).filter((w) => w.length > 1);

// מילים-שנלמדו-משימוש (דאטה, לא האכלה): אטום ⇒ מילים שהמשתמש קשר אליו.
const LEARNED = readJson('knowledge/learned.json', { bindings: {} }).bindings || {};
const stemsOf = (arr) => (arr || []).flatMap((x) => [...String(x).matchAll(/[֐-׿]{2,}/g)].map((m) => stem(m[0]))).filter((t) => t.length > 1);
// 🎯 מטרת-האטום-האמיתית: מ-atom-index (מונחי-מסך-המקור), עוקפת את בוילרפלייט-ההערה.
const PURPOSE = {}; for (const a of readJson('atom-index.json', [])) PURPOSE[a.cls] = a.purpose || [];

// אינדקס: כל ווידג'ט → גזעים מהמטרה-האמיתית (אינדקס) + התיאור-העצמי + הנלמד. IDF נלמד מהמדף.
const WIDGETS = atlas.widgets
  .map((w) => ({ cls: w.cls, file: w.file, st: [...new Set([...stemsOf(PURPOSE[w.cls]), ...stemsOf(w.he), ...stemsOf(LEARNED[w.cls])])] }))
  .filter((w) => w.st.length);
const df = new Map();
for (const w of WIDGETS) for (const t of w.st) df.set(t, (df.get(t) || 0) + 1);
const N = WIDGETS.length || 1;
const idf = (t) => Math.log((N + 1) / ((df.get(t) || 0) + 1)) + 1;

// אחזור: מחזיר ווידג'טים מדורגים לפי חפיפת-משמעות עם הביטוי.
export function retrieve(phrase, top = 5) {
  const q = [...new Set(heTokens(phrase))];
  const qn = q.length || 1;
  return WIDGETS
    .map((w) => {
      let s = 0, m = 0;
      for (const t of q) if (w.st.includes(t)) { s += idf(t); m++; }
      // כיסוי: איזה חלק מהביטוי באמת נגע באטום (1/5 = מסגור מקרי; 2/2 = בקשת-וידג'ט אמיתית)
      return { cls: w.cls, file: w.file, s: +s.toFixed(2), m, cover: +(m / qn).toFixed(2) };
    })
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, top);
}

// 🕯️ best = נקודת-ה«אין» של האחזור-לתצוגה: מחזיר null ⇒ הקורא מכריז «אין אטום». לפני ה-null,
//    ורמינהו על **כל** מועמד שהדירוג העלה, בשמו: ציון ≥ min ⇒ חד שיעורא (נפלט) · ציון מתחת
//    לרצפה ⇒ פליגא, עם הציון והרצפה · אפס מועמדים ⇒ «לא מצינו» שאומר מה נסרק. ואז null.
export const best = (phrase, min = 1.5) => {
  const cands = retrieve(phrase, 5);
  const r = rminhu({ engine: 'match.best', matter: `ביטוי «${String(phrase).slice(0, 60)}»`,
    searched: [`atlas.widgets (${N} אטומי-תצוגה עם תיאור-עצמי)`],
    rulings: cands.map((c) => (c.s >= min
      ? had(c.cls, `ציון ${c.s} ≥ רצפה ${min} · כיסוי ${c.cover}`)
      : pliga(c.cls, `ציון ${c.s} מתחת לרצפה ${min} (כיסוי ${c.cover}: ${c.m} מילים מהביטוי נגעו) — מסגור מקרי, לא בקשת-אטום`))) });
  return r.hit ? cands.find((c) => c.cls === r.hit.src) : null;
};

// ── שכבת-לוגיקה: אחזור אטומי-לוגיקה לפי-משמעות (אותו מנגנון, מעל atlas.functions) ──
const RETS = new Set(['String', 'String?', 'int', 'double', 'num', 'bool']);
const primArg = (t) => { t = t.replace(/\?$/, ''); return ['DateTime', 'bool'].includes(t); };
// ניתן-לחיווט-standalone: מחזיר-ערך + כל פרמטר-חובה מסוג-בסיס (DateTime/bool) או אופציונלי.
const wireable = (f) => RETS.has(f.ret) && f.params.every((p) => primArg(p.type) || p.type.endsWith('?'));
const LOGIC = atlas.functions.map((f) => ({ name: f.name, he: f.he || [], ret: f.ret, params: f.params || [], st: [...new Set(stemsOf(f.he))], wire: wireable(f) })).filter((f) => f.st.length && RETS.has(f.ret));
const ldf = new Map();
for (const f of LOGIC) for (const t of f.st) ldf.set(t, (ldf.get(t) || 0) + 1);
const LN = LOGIC.length || 1;
const lidf = (t) => Math.log((LN + 1) / ((ldf.get(t) || 0) + 1)) + 1;

export function retrieveLogic(phrase, top = 4, onlyWireable = true) {
  const q = [...new Set(heTokens(phrase))];
  return LOGIC
    .filter((f) => !onlyWireable || f.wire)
    .map((f) => { let s = 0; for (const t of q) if (f.st.includes(t)) s += lidf(t); return { name: f.name, he: f.he, s: +s.toFixed(2), wire: f.wire, params: f.params, inTypes: f.params.map((p) => p.type.replace(/\?$/, '')) }; })
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, top);
}

// מיפוי חלק-מפורק (שם-מחלקה אנגלי כמו '_MetricGrid') לאטום-קטלוג לפי חפיפת-מילות-מחלקה.
// טהור: נגזר משמות-המחלקות של הקטלוג בלבד. משמש את ההרכבה-ההפוכה (compose).
const clsWords = (cls) => cls.replace(/^_+/, '').replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase().split(/\s+/).filter(Boolean);
const WCLS = atlas.widgets.map((w) => ({ cls: w.cls, words: clsWords(w.cls) }));
export function matchClass(name) {
  const q = clsWords(name);
  const ranked = WCLS.map((w) => { let s = 0; for (const t of q) if (w.words.includes(t)) s++; return { cls: w.cls, s }; })
    .filter((x) => x.s > 0).sort((a, b) => b.s - a.s);
  //    🕯️ ורמינהו לפני ה-null: הראשון-בדירוג ⇒ חד שיעורא · השאר ⇒ פליגא (חפיפה קטנה יותר).
  //    אפס חפיפה ⇒ «לא מצינו» שאומר על אילו מילות-מחלקה נסרקו 'WCLS.length' אטומים.
  const r = rminhu({ engine: 'match.matchClass', matter: `שם-מחלקה «${name}» ⇒ אטום-קטלוג`,
    searched: [`atlas.widgets (${WCLS.length} שמות-מחלקה) · מילות-השאילתה: ${q.join('/') || '—'}`],
    rulings: ranked.slice(0, 5).map((x, i) => (i === 0
      ? had(x.cls, `${x.s} מילות-מחלקה חופפות — הגבוה בדירוג`)
      : pliga(x.cls, `${x.s} מילות-מחלקה חופפות מול ${ranked[0].s} של ${ranked[0].cls} — הגבוה גובר (אותו מנגנון, ציון נמוך)`))) });
  return r.hit ? ranked[0] : null;
}

// ── CLI: בדיקת-אחזור מהירה ──
if (import.meta.url === 'file://' + process.argv[1]) {
  const q = process.argv.slice(2).join(' ');
  if (!q) { console.log('שימוש: node match.mjs "<ביטוי>"'); process.exit(0); }
  console.log(`🔎 "${q}" · נלמד מ-${N} אטומים`);
  for (const r of retrieve(q, 6)) console.log(`   ${r.s}\t${r.cls}`);
  best(q);
  (await import('../../yeshiva/rminhu.mjs')).printNotes('match');
}
