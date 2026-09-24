// ══════════════════════════════════════════════════════════════════════════
//  yeshiva/born.mjs — 🐣 **מדף-הנולדים.** הכרעת-בעלים 24.9 «תסגור את שני אלה»: «אין» שנסגר בהרכבה נהיה אטום, לא נשכח.
//  ────────────────────────────────────────────────────────────────────────
//  היום: synth מוכיח שרשרת על הדוגמאות ⇒ מסך ⇒ והשרשרת נעלמת עם ה-outDir. כאן היא נולדת:
//    · add      — שרשרת מוכחת (עומק ≥2, או מורכבת מנולד/משלב-ביניים) נרשמת: צורך · דוגמאות · שרשרת · חתימה
//    · find     — צורך חדש: קודם הנולדים — שרשרת שמוכיחה את כל הדוגמאות בהרצה (runChain) נלקחת בלי BFS
//    · compose  — נולד כחוליה-ראשונה: הרצתו על הקלטים ⇒ synth מהביניים לפלט ⇒ שרשרת עמוקה מ-4 (המדף מעמיק את עצמו)
//    · steps    — אין הרכבה ⇒ הבעלים נותן שלב-ביניים לכל דוגמה ⇒ שני חיפושים קצרים ⇒ שרשרת אחת ⇒ נולדת
//    · byLabel  — דבר בלי דוגמאות שתוויתו = צורך שנולד ⇒ הדוגמאות חוזרות (ein · kind born)
//  🔒 הכרעה-35: הדלת לא כותבת למדף שבריפו (new/ · capabilities/ · specs/). מדף-הנולדים = זיכרון מקומי (.maimatai/, כמו יומן-התשובות),
//     MAVIN_BORN להפניה. העלאה ל-new/ (אטום-Dart + חוזה + בדיקה) = הכרעה נפרדת של הבעלים.
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import * as R from '../machtzev/root.mjs';
const FILE = () => process.env.MAVIN_BORN || path.join(R.ROOT, '.maimatai', 'born.jsonl');
export function all() { const f = FILE(); if (!fs.existsSync(f)) return []; return fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)); }
const proves = (SY, chain, exs) => exs.length > 0 && chain.every((c) => SY.fnsBy.has(c)) && exs.every((e) => SY.runChain(chain, e.in) === e.out);
/** נולד שמוכיח את כל הדוגמאות בהרצה — בלי חיפוש. */
export function find(SY, exs) { for (const b of all().reverse()) if (proves(SY, b.chain, exs)) return b; return null; }
/** נולד כחוליה-ראשונה + synth מהביניים (עומק ≤4 נוסף). */
export function compose(SY, demand, exs) {
  for (const b of all().reverse()) {
    if (!b.chain.every((c) => SY.fnsBy.has(c))) continue;
    const mids = exs.map((e) => SY.runChain(b.chain, e.in)); if (mids.some((m) => m == null)) continue;
    const r = SY.synthesize(demand, exs.map((e, i) => ({ in: mids[i], out: e.out }))); if (r) return { chain: [...b.chain, ...r.chain], via: b };
  }
  return null;
}
/** שלב-ביניים מהבעלים: לכל דוגמה ערך-ביניים ⇒ in⇒mid ו-mid⇒out בנפרד ⇒ שרשרת אחת (מוכחת מחדש על הדוגמאות המקוריות). */
export function steps(SY, demand, exs, mids) {
  if (!Array.isArray(mids) || mids.length !== exs.length) return null;
  const a = SY.synthesize(`${demand} ⇒ ביניים`, exs.map((e, i) => ({ in: e.in, out: String(mids[i]) }))) || compose(SY, demand, exs.map((e, i) => ({ in: e.in, out: String(mids[i]) })));
  if (!a) return { failed: 'first' };
  const b = SY.synthesize(demand, exs.map((e, i) => ({ in: String(mids[i]), out: e.out }))); if (!b) return { failed: 'second', first: a.chain };
  const chain = [...a.chain, ...b.chain]; return proves(SY, chain, exs) ? { chain } : { failed: 'whole' };
}
export function add(rec) { const f = FILE(); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.appendFileSync(f, JSON.stringify({ at: new Date().toISOString(), ...rec }) + '\n'); }
export function byLabel(label) { const rows = all().filter((b) => b.thing === label); return rows.length ? rows[rows.length - 1] : null; }
