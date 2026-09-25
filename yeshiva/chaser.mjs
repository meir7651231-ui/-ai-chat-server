// ══════════════════════════════════════════════════════════════════════════
//  yeshiva/chaser.mjs — 🕳️⇒🔁 **כל «חסר» עובר בלולאה אחת.** (הכרעת-בעלים 25.9 «תתקן כבר»)
//  ────────────────────────────────────────────────────────────────────────
//  הממצא (שלוש פעמים ברצף): המחולל מזהה נכון מה חסר, רושם — ועוצר. «אין לי אלא» הודפס · נושא-בלי-טבלה נרשם ·
//  157 כללים «לא תורגמו» נכתבו לקובץ. כל מקום שנכתב אחרי לולאת-האין (ein) כתב «חסר» לקובץ/להערה במקום להזין אותה.
//  התיקון: ערוץ אחד. כל מקום שמגלה חסר קורא gap(kind, data). פותרים נרשמים פעם אחת לכל סוג (כמו kushya.register).
//  לכל חסר חייבת לצאת תוצאה אחת מארבע — אחרת ⛔:
//    clause    — משפט בשפה הקיימת ⇒ נכנס למשפט ⇒ הדלת/האין קוראים שוב (המרכיב)
//    question  — שאלה אחת לבעלים עם מפתח (לא ניחוש)
//    built     — כבר נבנה (תשובה קיימת)
//    declared  — אין פותר לצורה הזו עדיין — מוצהר עם הסיבה (נספר, לא נבלע)
// ══════════════════════════════════════════════════════════════════════════
const REG = new Map();   // kind ⇒ [{name, run}]
export function register(kind, name, run) { const a = REG.get(kind) || REG.set(kind, []).get(kind); if (!a.some((r) => r.name === name)) a.push({ name, run }); }
export const kinds = () => [...REG.keys()];
/** gaps = [{kind, ...data}] ⇒ לכל חסר: outcome (clause|question|built|declared) + by (מי פתר) · silent = אין תוצאה בכלל */
export async function resolveAll(gaps, ctx) {
  const out = [];
  for (const g of gaps) {
    const rs = REG.get(g.kind) || []; let res = null;
    for (const r of rs) { try { const a = await r.run(ctx, g); if (a && a.outcome) { res = { ...a, by: r.name }; break; } } catch (e) { res = { outcome: 'declared', why: `${r.name}: ${String(e.message || e).slice(0, 80)}`, by: r.name }; break; } }
    if (!res && !rs.length) res = { outcome: 'declared', why: `אין פותר רשום לסוג «${g.kind}»`, by: null };
    out.push({ ...g, ...(res || { outcome: null }) });
  }
  return out;
}
/** השער: חסר שנכנס לערוץ ולא יצאה לו אף תוצאה */
export const silent = (resolved) => resolved.filter((x) => !['clause', 'question', 'built', 'declared'].includes(x.outcome));
export const summary = (resolved) => { const c = {}; for (const x of resolved) c[x.outcome || 'silent'] = (c[x.outcome || 'silent'] || 0) + 1; return c; };
