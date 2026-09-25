// ══════════════════════════════════════════════════════════════════════════
//  yeshiva/chaser-sources.mjs — 🔁 הפותרים של ערוץ-החסרים (yeshiva/chaser). כל פותר = חלק קיים של המחולל, לא מנוע חדש.
//   rule   — כלל מהתרחיש («תנאי → פעולה») לטבלה:
//            (1) ruleClauses — ספירה-בחלון / «שלא X עד HH:MM» ⇒ משפט · חסר שלב ⇒ שאלה «שלבים <טבלה>»
//            (2) השוואת-שדה — detectAllClauses על «התראה כש<תנאי>»; ה-X הוא שדה של הטבלה ⇒ משפט
//            (3) מוצהר — אין עדיין צורה שמבינה את הכלל (הסיבה נשמרת; נספר)
//   table  — טבלה חסרה (modelGaps): תשובה «כן»/«לא» ⇒ built · אין תשובה ⇒ שאלה
//   extend — הרחבת-טבלה («מתרחבות: X → Y»): כנ"ל
// ══════════════════════════════════════════════════════════════════════════
export function registerAll(CH) {
  CH.register('rule', 'ruleClauses', async (ctx, g) => {
    const X = ctx.K.ruleClauses({ [g.table.name]: [g.rule] }, [g.table]);
    if (X.clauses.length) return { outcome: 'clause', clause: X.clauses[0].clause, act: X.clauses[0].act };
    const s = X.skipped[0];
    if (s && s.needStage) { const key = `שלבים ${g.table.name}`; if (ctx.asked.has(key)) return { outcome: 'question', key, dup: true }; ctx.asked.add(key);
      return { outcome: 'question', key, q: `⏰ בתרחישים: «${g.rule.cond.slice(0, 70)} → ${g.rule.act.slice(0, 30)}» — צריך שלב «${s.needStage}» ל«${g.table.name}». אילו שלבים עובר ${g.table.name}? (למשל: …, ${s.needStage})` }; }
    g.why = s ? s.why : g.why; return null; });
  CH.register('rule', 'fieldCompare', async (ctx, g) => {
    const cl = ctx.detect(`${ctx.alertWord} ${ctx.whenWord}${g.rule.cond}`)[0]; if (!cl || !cl.x || cl.n == null || isNaN(+cl.n)) return null;
    const stem = (w) => String(w).replace(/^[ובלמהש]+(?=[֐-׿]{3})/, '').replace(/(ים|ות|ה)$/, '');
    const f = (g.table.fields || []).find((x) => stem(x) === stem(cl.x) || x === cl.x); if (!f) return null;
    return { outcome: 'clause', clause: `${ctx.alertWord} ${ctx.whenWord}${f} ${cl.op === '>' ? ctx.aboveWord : ctx.belowWord} ${cl.n}`, act: g.rule.act }; });
  CH.register('rule', 'declared', async (ctx, g) => ({ outcome: 'declared', why: g.why || 'אין עדיין צורה במנוע-ההתראות שמבינה את הכלל' }));
  for (const kind of ['table', 'extend']) CH.register(kind, 'owner', async (ctx, g) => {
    const said = typeof ctx.answers[g.key] === 'string' ? ctx.answers[g.key].trim() : '';
    return said ? { outcome: 'built', said } : { outcome: 'question', key: g.key, q: g.q }; });
}
