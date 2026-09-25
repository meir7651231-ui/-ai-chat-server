// ══════════════════════════════════════════════════════════════════════════
//  yeshiva/chaser-sources.mjs — 🔁 הפותרים של ערוץ-החסרים (yeshiva/chaser). כל פותר = חלק קיים של המחולל, לא מנוע חדש.
//   rule   — כלל מהתרחיש («תנאי → פעולה») לטבלה:
//            (1) ruleClauses — ספירה-בחלון / «שלא X עד HH:MM» ⇒ משפט · חסר שלב ⇒ שאלה «שלבים <טבלה>»
//            (2) השוואת-שדה — detectAllClauses על «התראה כש<תנאי>»; ה-X הוא שדה של הטבלה ⇒ משפט
//            (3) מוצהר — אין עדיין צורה שמבינה את הכלל (הסיבה נשמרת; נספר)
//   table  — טבלה חסרה (modelGaps): תשובה «כן»/«לא» ⇒ built · אין תשובה ⇒ שאלה
//   extend — הרחבת-טבלה («מתרחבות: X → Y»): כנ"ל
// ══════════════════════════════════════════════════════════════════════════
const TYPE_WHY = { link: 'קשר/היררכיה (← →) — לא התראה; מידע על מבנה-הדיווח', change: 'שינוי-ערך (מספר → מספר) — עדכון סף/ערך, לא התראה', open: 'שאלה פתוחה במחקר — לא לבנות', seq: 'מחזור-חיים (רצף-שלבים) — הצעה לשלבי-הטבלה' };
export function registerAll(CH) {
  CH.register('rule', 'byType', async (ctx, g) => (g.rule.type && g.rule.type !== 'rule' ? { outcome: 'declared', type: g.rule.type, why: TYPE_WHY[g.rule.type] + (g.rule.seq ? `: ${g.rule.seq.join(' → ')}` : '') } : null));   // ⇄ סוג-החץ קודם לכל פותר
  CH.register('rule', 'ruleClauses', async (ctx, g) => {
    const X = ctx.K.ruleClauses({ [g.table.name]: [g.rule] }, [g.table]);
    if (X.clauses.length) return { outcome: 'clause', clause: X.clauses[0].clause, act: X.clauses[0].act };
    const s = X.skipped[0];
    if (s && s.needStage) { const key = `שלבים ${g.table.name}`; if (ctx.asked.has(key)) return { outcome: 'question', key, dup: true }; ctx.asked.add(key);
      const life = (ctx.seqBy || {})[g.table.name];   // מחזור-החיים שהמחקר עצמו כותב לטבלה ⇒ ההצעה בשאלה (לא ניחוש שלי)
      return { outcome: 'question', key, q: `⏰ בתרחישים: «${g.rule.cond.slice(0, 70)} → ${g.rule.act.slice(0, 30)}» — צריך שלב «${s.needStage}» ל«${g.table.name}». ${life ? `המחקר כותב מחזור-חיים: ${life.join(' → ')}. ` : ''}אילו שלבים עובר ${g.table.name}? (${life ? '«כן» = לפי המחקר, או ' : ''}למשל: …, ${s.needStage})` }; }
    g.why = s ? s.why : g.why; return null; });
  CH.register('rule', 'fieldCompare', async (ctx, g) => {
    const cl = ctx.detect(`${ctx.alertWord} ${ctx.whenWord}${g.rule.cond}`)[0]; if (!cl || !cl.x || cl.n == null || isNaN(+cl.n)) return null;
    const stem = (w) => String(w).replace(/^[ובלמהש]+(?=[֐-׿]{3})/, '').replace(/(ים|ות|ה)$/, '');
    const f = (g.table.fields || []).find((x) => stem(x) === stem(cl.x) || x === cl.x); if (!f) return null;
    return { outcome: 'clause', clause: `${ctx.alertWord} ${ctx.whenWord}${f} ${cl.op === '>' ? ctx.aboveWord : ctx.belowWord} ${cl.n}`, act: g.rule.act }; });
  // 🧩 הרכבה (הכרעת-בעלים 25.9 «תתקן ותשדרג»): כלל שלא התאים לצורה אחת ⇒ פירוק לחלקים ⇒ כל חלק מחפש את הצורה הקיימת שלו ⇒ הרכבה.
  //    חלקים: נספר (N + שם ⇒ טבלה) · סינון («לא X» / «שלא X» ⇒ שלב של הטבלה) · קיבוץ («באותו/ב<ישות>» ⇒ שדה שמצביע לישות) · חלון («ב-M דק'») · סף (N-1)
  //    כל החלקים נמצאו ⇒ משפט («התראה כשזמן מאז <שלב> מעל 0 וגם מונה <טבלה> לכל <שדה> [ב-M…] מעל N-1») · חסר חלק אחד ⇒ שאלה מדויקת · יותר ⇒ מוצהר עם רשימת-החסר
  CH.register('rule', 'compose', async (ctx, g) => {
    const fin = (w) => String(w).replace(/ך/g, 'כ').replace(/ם/g, 'מ').replace(/ן/g, 'נ').replace(/ף/g, 'פ').replace(/ץ/g, 'צ');   // «סדרן» ≡ «סדרנים»
    const stem = (w) => fin(String(w).replace(/^[ובלמהש]+(?=[֐-׿]{3})/, '').replace(/(ים|ות|ה)$/, ''));
    const c = g.rule.cond; if (/:\s*[^,]+,[^,]+,/.test(c)) return null;   // «40 הקופות רשומות: מיקום, בעלים, …» = תיאור (רשימת-שדות), לא כלל
    const m = c.match(/(\d+)\+?\s+([֐-׿][֐-׿\-"׳']*)/); if (!m) return null;
    const N = +m[1], noun = m[2], rest = c.slice(c.indexOf(m[0]) + m[0].length);
    const tables = ctx.tables || []; const missing = [];
    const T = tables.find((t) => stem(noun) === stem(t.name) || noun.startsWith(stem(t.name)) || stem(noun.split('-')[0]) === stem(t.name)); if (!T) missing.push(`מה נספר: «${noun}» — איזו טבלה?`);
    const neg = rest.match(/(?:ש)?לא\s+([֐-׿]+)/); let filter = null;
    if (neg) { const st = T && (T.stages || []).find((x) => stem(x.replace(/^לא\s+/, '')) === stem(neg[1]) || fin(x).includes(stem(neg[1]))); if (st) filter = `${ctx.sinceWord} ${st} ${ctx.aboveWord} 0`; else missing.push(`סינון: שלב «לא ${neg[1]}»${T ? ` ב«${T.name}»` : ''}`); }
    const entNames = (ctx.tables || []).map((t) => t.name);   // «ב<ישות>» רק כשהמילה אחרי ה-ב׳ היא באמת שם-טבלה («באזור» ✓ · «בעלים» ✗)
    const gm = rest.match(/(?:באותו|באותה|מאותו|מאותה|לכל)\s+([֐-׿]+)/) || [...rest.matchAll(/(?:^|\s)ב([֐-׿]{3,})/g)].map((x) => [x[0], x[1]]).find((x) => entNames.some((n) => stem(n) === stem(x[1]))); let group = null;
    if (gm) { const w = gm[1]; const f = T && (T.fields || []).find((x) => x.split(/\s+/).some((y) => stem(y) === stem(w))); if (f) group = f; else missing.push(`קיבוץ: «${w}» — אין שדה כזה${T ? ` ב«${T.name}»` : ''}`); }
    const wm = rest.match(/ב[-־]?(\d+)\s*(?:'|דק'|דקות)|(באותה שעה|בשעה)/); const win = wm ? (wm[1] ? +wm[1] : 60) : null;
    if (!missing.length && T && (filter || group)) return { outcome: 'clause', clause: `${ctx.alertWord} ${ctx.whenWord}${filter ? `${filter} וגם ` : ''}מונה ${T.name}${group ? ` לכל ${group}` : ''}${win ? ` ב-${win} הדקות האחרונות` : ''} ${ctx.aboveWord} ${N - 1}`, act: g.rule.act };
    if (missing.length === 1 && T) { const key = `הרכבה ${T.name}: ${c.slice(0, 40)}`; return { outcome: 'question', key, q: `🧩 «${c.slice(0, 70)} → ${g.rule.act.slice(0, 30)}»: כל החלקים נמצאו חוץ מאחד — ${missing[0]}` }; }
    g.why = `חסרים חלקים: ${missing.join(' · ') || 'אין סינון/קיבוץ'}`; return null; });
  CH.register('rule', 'declared', async (ctx, g) => ({ outcome: 'declared', why: g.why || 'אין עדיין צורה במנוע-ההתראות שמבינה את הכלל' }));
  for (const kind of ['table', 'extend']) CH.register(kind, 'owner', async (ctx, g) => {
    const said = typeof ctx.answers[g.key] === 'string' ? ctx.answers[g.key].trim() : '';
    return said ? { outcome: 'built', said } : { outcome: 'question', key: g.key, q: g.q }; });
}
