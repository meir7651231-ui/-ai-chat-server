// ══════════════════════════════════════════════════════════════════════════
//  yeshiva/kushya.mjs — ⚖️⇒🔎 **קושיה ⇒ חיפוש, במקום אחד.** (הכרעת-בעלים 25.9 «צא»)
//  ────────────────────────────────────────────────────────────────────────
//  הממצא: «קושיה מפעילה חיפוש» תוקן פעם אחת (0bb2c4b2) — רק בחיפוש-הקשר (shape/ein). הכורה (koreh) נבנה אחר כך
//  ולא חובר ⇒ «אין לי אלא» הודפס בכל ריצת מירון ולא הפעיל כלום. התיקון: מרכז אחד שכל מקור-תשובה נרשם בו פעם אחת,
//  וכל קושיה עוברת דרכו. קושיה שאין לה אף מחפש ואין סיבה מפורשת ⇒ ⛔ (לא שקט). מקור חדש = register אחד כאן, לא חיבור-ביד.
//  kind = מילת-המהלך של המקשה («אין לי אלא» · «כגון» · «מאי» …); searcher = (ctx, kushya) ⇒ {found, summary} | null (אין לו מה לחפש כאן)
// ══════════════════════════════════════════════════════════════════════════
const REG = [];
/** מקור-תשובה: name · kinds (מילים שמזהות את המהלך) · run */
export function register(name, kinds, run) { if (!REG.some((r) => r.name === name)) REG.push({ name, kinds, run }); }
export const searchers = () => REG.map((r) => ({ name: r.name, kinds: r.kinds }));
/** כל הקושיות ⇒ כל המחפשים שמתאימים. מחזיר לכל קושיה: searched (מי חיפש) · found · summary · why (למה אין חיפוש) */
export async function answerAll(kushyot, ctx) {
  const out = [];
  for (const k of kushyot) {
    const tag = `${k.kind || ''} ${String(k.text || '').split(':')[0]}`;   /* «רש"י» + «כגון: …» — המהלך יכול לשבת בסוג או בראש-הטקסט */
    const mine = REG.filter((r) => r.kinds.some((w) => tag.includes(w)));
    const res = { ...k, searched: [], found: [], summary: [], why: null };
    for (const r of mine) { try { const a = await r.run(ctx, k); if (!a) continue; res.searched.push(r.name); if (a.found) res.found.push(...a.found); if (a.summary) res.summary.push(a.summary); } catch (e) { res.summary.push(`${r.name}: ${String(e.message || e).slice(0, 80)}`); } }
    if (!mine.length) res.why = 'noSearcher';                       // מהלך שאין לו מקור-תשובה בכלל (הרהור/שיקול — לא חיפוש)
    else if (!res.searched.length) res.why = 'noSource';            // יש מחפש, אבל אין לו מקור בריצה הזו (למשל אין תרחישים)
    out.push(res);
  }
  return out;
}
/** השער: קושיה ממהלך-חיפוש (יש לה מחפש רשום) שלא חיפשה ואין לה מקור מוצהר ⇒ ⛔ */
export const unsearched = (answered) => answered.filter((a) => a.why == null && !a.searched.length);
