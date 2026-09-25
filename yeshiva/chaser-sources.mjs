// ══════════════════════════════════════════════════════════════════════════
//  yeshiva/chaser-sources.mjs — 🔁 הפותרים של ערוץ-החסרים (yeshiva/chaser). כל פותר = חלק קיים של המחולל, לא מנוע חדש.
//   rule   — כלל מהתרחיש («תנאי → פעולה») לטבלה:
//            (1) ruleClauses — ספירה-בחלון / «שלא X עד HH:MM» ⇒ משפט · חסר שלב ⇒ שאלה «שלבים <טבלה>»
//            (2) השוואת-שדה — detectAllClauses על «התראה כש<תנאי>»; ה-X הוא שדה של הטבלה ⇒ משפט
//            (3) הרכבה — פירוק לחלקים; כל חלק נשלח לערוץ (part: תשובה · שם · הגדרות-המסמך · שאלה עם אפשרויות מהמחקר)
//            (4) מוצהר — אין עדיין צורה שמבינה את הכלל (הסיבה נשמרת; נספר)
//   table  — טבלה חסרה (modelGaps): תשובה «כן»/«לא» ⇒ built · אין תשובה ⇒ שאלה
//   extend — הרחבת-טבלה («מתרחבות: X → Y»): כנ"ל
// ══════════════════════════════════════════════════════════════════════════
const TYPE_WHY = { link: 'קשר/היררכיה (← →) — לא התראה; מידע על מבנה-הדיווח', change: 'שינוי-ערך (מספר → מספר) — עדכון סף/ערך, לא התראה', open: 'שאלה פתוחה במחקר — לא לבנות', seq: 'מחזור-חיים (רצף-שלבים) — הצעה לשלבי-הטבלה' };
const fin = (w) => String(w).replace(/ך/g, 'כ').replace(/ם/g, 'מ').replace(/ן/g, 'נ').replace(/ף/g, 'פ').replace(/ץ/g, 'צ');   // «סדרן» ≡ «סדרנים»
const stem = (w) => fin(String(w).replace(/^[ובלמהש]+(?=[\u0590-\u05FF]{3})/, '').replace(/(ים|ות|ה)$/, ''));
const partKey = (g) => (g.part === 'table' ? `מילה ${g.word}` : g.part === 'field' ? `שדה ${g.T.name}: ${g.word}` : `שלבים ${g.T.name}`);   // שלבים = אותו מפתח של ruleClauses (תשובה אחת)
/** מהמחקר: באילו טבלאות המילה מופיעה באותו משפט — אפשרויות לשאלה, לא ניחוש */
const coTables = (ctx, w) => { const c = {}; for (const d of ctx.corpus || []) for (const s of d.text.split(/[.\n!?]/)) if (s.includes(w)) for (const t of ctx.tables || []) if (t.name !== w && s.split(/[\s,:;()"״]+/).some((x) => stem(x) === stem(t.name))) c[t.name] = (c[t.name] || 0) + 1;
  return Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k, v]) => `${k} (${v})`); };
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
  //    חלקים: נספר (N + שם ⇒ טבלה) · סינון («לא X» ⇒ שלב) · קיבוץ («באותו/ב<ישות>» ⇒ שדה) · חלון («ב-M דק'») · סף (N-1)
  //    ⇄ כל חלק נשלח לערוץ (ctx.need('part')) — לא «חסר» ועצירה (25.9 «תשדרג את הקיים»): שם · הגדרות-המסמך · מחקר · שאלה
  CH.register('rule', 'compose', async (ctx, g) => {
    const c = g.rule.cond; if (/:\s*[^,]+,[^,]+,/.test(c)) return null;   // «40 הקופות רשומות: מיקום, בעלים, …» = תיאור (רשימת-שדות), לא כלל
    const m = c.match(/(\d+)\+?\s+([\u0590-\u05FF][\u0590-\u05FF\-"׳']*)/); if (!m) return null;
    const N = +m[1], noun = m[2], rest = c.slice(c.indexOf(m[0]) + m[0].length);
    if (noun === 'לא' || (/^ש/.test(noun) && !(ctx.tables || []).some((t) => stem(noun) === stem(t.name)))) { g.why = `הנספר לא נאמר — אחרי המספר בא «${noun}» (שלילה/פועל), לא שם`; return null; }   // «5 לא מגיבים» · «3 שנופלים»
    if (ctx.answers[`יחידה ${noun}`] === 'לא') { g.why = `«${noun}» — הבעלים ענה שאינו דבר נספר`; return null; }
    const entNames = (ctx.tables || []).map((t) => t.name);   // «ב<ישות>» רק כשהמילה אחרי ה-ב׳ היא באמת שם-טבלה («באזור» ✓ · «בעלים» ✗)
    const neg = rest.match(/(?:ש)?לא\s+([\u0590-\u05FF]+)/);
    const gm = rest.match(/(?:באותו|באותה|מאותו|מאותה|לכל)\s+([\u0590-\u05FF]+)/) || [...rest.matchAll(/(?:^|\s)ב([\u0590-\u05FF]{3,})/g)].map((x) => [x[0], x[1]]).find((x) => entNames.some((n) => stem(n) === stem(x[1])));
    if (!neg && !gm) { g.why = 'חסרים חלקים: אין סינון/קיבוץ'; return null; }   // לא כלל-הרכבה ⇒ לא שואלים על המילה
    const wm = rest.match(/ב[-־]?(\d+)\s*(?:'|דק'|דקות)|(באותה שעה|בשעה)/); const win = wm ? (wm[1] ? +wm[1] : 60) : null;
    const parts = [await ctx.need('part', { part: 'table', word: noun, cond: c })]; const T = parts[0].outcome === 'built' ? parts[0].value : null;
    let filter = null, group = null;
    if (T && neg) { const p = await ctx.need('part', { part: 'stage', word: neg[1], T, cond: c }); parts.push(p); if (p.outcome === 'built') filter = `${ctx.sinceWord} ${p.value} ${ctx.aboveWord} 0`; }
    if (T && gm) { const p = await ctx.need('part', { part: 'field', word: gm[1], T, cond: c }); parts.push(p); if (p.outcome === 'built') group = p.value; }
    if (parts.every((p) => p.outcome === 'built')) return { outcome: 'clause', clause: `${ctx.alertWord} ${ctx.whenWord}${filter ? `${filter} וגם ` : ''}מונה ${T.name}${group ? ` לכל ${group}` : ''}${win ? ` ב-${win} הדקות האחרונות` : ''} ${ctx.aboveWord} ${N - 1}`, act: g.rule.act, parts: parts.map((p) => `${p.part}:${p.word}⇐${p.by}`) };
    const no = parts.find((p) => p.outcome === 'declared'); if (no) { g.why = `חלק «${no.word}»: ${no.why}`; return null; }
    const qs = parts.filter((p) => p.outcome === 'question');
    return { outcome: 'question', key: qs[0].key, dup: qs.every((p) => p.dup), q: `🧩 «${c.slice(0, 70)} → ${g.rule.act.slice(0, 30)}»: ${parts.filter((p) => p.outcome === 'built').map((p) => `«${p.word}» = ${p.value.name || p.value} ✓`).join(' · ')}${parts.some((p) => p.outcome === 'built') ? ' · ' : ''}חסר: ${qs.map((p) => p.ask).join(' · ')}` }; });
  // ⇄ חלק-חסר (kind='part'): part ∈ table|field|stage · word · T. סדר-החיפוש: תשובה שנשמרה ⇒ שם ⇒ הגדרות-המסמך ⇒ שאלה (עם אפשרויות מהמחקר)
  CH.register('part', 'answered', async (ctx, g) => {
    const key = partKey(g), said = key && typeof ctx.answers[key] === 'string' ? ctx.answers[key].trim() : ''; if (!said) return null;
    if (said === 'לא') return { outcome: 'declared', why: 'הבעלים ענה «לא»' };
    if (g.part === 'table') { const t = (ctx.tables || []).find((x) => x.name === said); return t ? { outcome: 'built', value: t } : null; }
    return { outcome: 'built', value: said }; });
  CH.register('part', 'byName', async (ctx, g) => {
    const w = g.word;
    if (g.part === 'table') { const t = (ctx.tables || []).find((x) => stem(w) === stem(x.name) || w.startsWith(stem(x.name)) || stem(w.split('-')[0]) === stem(x.name)); return t ? { outcome: 'built', value: t } : null; }
    if (g.part === 'field') { const f = (g.T.fields || []).find((x) => x.split(/\s+/).some((y) => stem(y) === stem(w))); return f ? { outcome: 'built', value: f } : null; }
    const st = (g.T.stages || []).find((x) => stem(x.replace(/^לא\s+/, '')) === stem(w) || fin(x).includes(stem(w))); return st ? { outcome: 'built', value: st } : null; });
  CH.register('part', 'byDoc', async (ctx, g) => {   // המסמך כותב «Zone אזור» ⇒ שדה zone / zone_id בטבלה אחרת = קיבוץ לפי אזור
    if (g.part !== 'field') return null;
    const E = (ctx.tables || []).find((x) => stem(x.name) === stem(g.word)); if (!E) return null;
    const al = (E.alias || []).map((a) => a.toLowerCase()); const f = (g.T.fields || []).find((x) => al.some((a) => x.toLowerCase() === a || x.toLowerCase() === `${a} id` || x.toLowerCase() === `${a}_id`));
    return f ? { outcome: 'built', value: f } : null; });
  CH.register('part', 'ask', async (ctx, g) => {
    const key = partKey(g); const dup = ctx.asked.has(key); ctx.asked.add(key);
    if (g.part === 'table') { const opt = coTables(ctx, g.word); return { outcome: 'question', key, dup, ask: `«${g.word}» — איזו טבלה נספרת?${opt.length ? ` (במחקר מופיע ליד: ${opt.join(' · ')})` : ''} — ענה שם-טבלה או «לא»`, q: `🧩 «${g.cond.slice(0, 70)}»: «${g.word}» — איזו טבלה נספרת?${opt.length ? ` (במחקר מופיע ליד: ${opt.join(' · ')})` : ''} — ענה שם-טבלה או «לא»` }; }
    if (g.part === 'field') { const ask = `קיבוץ «${g.word}» — איזה שדה ב«${g.T.name}»? (${(g.T.fields || []).join(' · ')}) — או שם שדה חדש, או «לא»`; return { outcome: 'question', key, dup, ask, q: `🧩 «${g.cond.slice(0, 70)}»: ${ask}` }; }
    const ask = `סינון «לא ${g.word}» — אין שלב כזה ב«${g.T.name}» (עכשיו: ${(g.T.stages || []).join(' · ') || '—'}). אילו שלבים להוסיף? (למשל: לא ${g.word})`; return { outcome: 'question', key, dup, ask, q: `🧩 «${g.cond.slice(0, 70)}»: ${ask}` }; });
  CH.register('rule', 'declared', async (ctx, g) => ({ outcome: 'declared', why: g.why || 'אין עדיין צורה במנוע-ההתראות שמבינה את הכלל' }));
  for (const kind of ['table', 'extend']) CH.register(kind, 'owner', async (ctx, g) => {
    const said = typeof ctx.answers[g.key] === 'string' ? ctx.answers[g.key].trim() : '';
    return said ? { outcome: 'built', said } : { outcome: 'question', key: g.key, q: g.q }; });
}
