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
const partKey = (g) => (g.part === 'table' ? `מילה ${g.word}` : g.part === 'field' ? `שדה ${g.T.name}: ${g.word}` : g.part === 'value' ? `תואר ${g.T.name}: ${g.word}` : `שלבים ${g.T.name}`);   // שלבים = אותו מפתח של ruleClauses (תשובה אחת)
/** מהמחקר: באילו טבלאות המילה מופיעה באותו משפט — אפשרויות לשאלה, לא ניחוש */
const coTables = (ctx, w) => { const c = {}; for (const d of ctx.corpus || []) for (const s of d.text.split(/[.\n!?]/)) if (s.includes(w)) for (const t of ctx.tables || []) if (t.name !== w && s.split(/[\s,:;()"״]+/).some((x) => stem(x) === stem(t.name))) c[t.name] = (c[t.name] || 0) + 1;
  return Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k, v]) => `${k} (${v})`); };
export function registerAll(CH) {
  CH.register('rule', 'byType', async (ctx, g) => (g.rule.type && g.rule.type !== 'rule' ? { outcome: 'declared', type: g.rule.type, why: TYPE_WHY[g.rule.type] + (g.rule.seq ? `: ${g.rule.seq.join(' → ')}` : '') } : null));   // ⇄ סוג-החץ קודם לכל פותר
  CH.register('rule', 'ruleClauses', async (ctx, g) => {
    // פותר שלא צורך את כל החלקים לא בונה חלק מהכלל: קיבוץ («באותה נקודה») או תואר צמוד ⇒ לפותר-ההרכבה (אחרת «3 אירועים קטנים באותה נקודה» ⇒ «3 אירועים» — שגוי)
    { const c = g.rule.cond; const m = c.match(/\d+\+?\s+([\u0590-\u05FF][\u0590-\u05FF\-"׳']*)\s+([\u0590-\u05FF]+)/);
      if (/(?:באותו|באותה|מאותו|מאותה)\s+(?!שעה)[\u0590-\u05FF]/.test(c) || (m && /(ים|ות)$/.test(m[1]) && /^[\u0590-\u05FF]{3,}(ים|ות)$/.test(m[2]) && !/^(ב|ל|ש|כ|ו)/.test(m[2]))) return null; }
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
  CH.register('rule', 'threshold', async (ctx, g) => {   // «משפחות ממתינות מתקרב לקיבולת» — שדה של הטבלה בלי מספר ⇒ שאלה על הסף (לא ניחוש) · תשובה = מספר ⇒ משפט
    const c = g.rule.cond; if (/\d/.test(c) || !(ctx.compareWords || []).some((w) => c.split(/\s+/).includes(w))) return null; const f = (g.table.fields || []).filter((x) => x.length >= 4 && c.includes(x)).sort((a, b) => b.length - a.length)[0]; if (!f) return null;
    const cw = (ctx.compareWords || []).find((w) => c.split(/\s+/).includes(w)); if (c.indexOf(f) > c.indexOf(cw)) { g.why = `השוואה של ספירה מול השדה «${f}» — אין עדיין צורה במנוע-ההתראות`; return null; }   // השדה אחרי מילת-ההשוואה = הסף עצמו, לא הנמדד
    const key = `סף ${g.table.name}: ${f}`, said = typeof ctx.answers[key] === 'string' ? ctx.answers[key].trim() : '';
    if (/^\d+(\.\d+)?$/.test(said)) return { outcome: 'clause', clause: `${ctx.alertWord} ${ctx.whenWord}${f} ${ctx.aboveWord} ${said}`, act: g.rule.act };
    const dup = ctx.asked.has(key); ctx.asked.add(key);
    return { outcome: 'question', key, dup, q: `🔢 «${c.slice(0, 70)} → ${g.rule.act.slice(0, 30)}»: «${f}» — מעל איזה מספר להתריע? (מספר)` }; });
  // ⚖️ ספירה מול שדה («שוטרים במעבר מתחת לתקן שוטרים»): לכל רשומת-הורה — כמה בנות מצביעות עליה, מול שדה של אותה רשומה.
  //    הנספר דרך תשובת-היחידה («שוטרים» = שיבוץ); כשהמילה אינה שם-הטבלה — היא עצמה ערך-הסינון («שוטר» בשדה-התפקיד). כל חלק חסר ⇒ ערוץ (שאלה)
  CH.register('rule', 'countVsField', async (ctx, g) => {
    const m = g.rule.cond.match(/^([\u0590-\u05FF]+)\s+ב([\u0590-\u05FF]+)\s+(מתחת ל|מעל)\s*([\u0590-\u05FF][\u0590-\u05FF\s]*)$/); if (!m) return null;
    const parts = []; const pp = await ctx.need('part', { part: 'table', word: m[2], cond: g.rule.cond }); parts.push(pp); const cp = await ctx.need('part', { part: 'table', word: m[1], cond: g.rule.cond }); parts.push(cp);
    const P = pp.outcome === 'built' ? pp.value : null, Ch = cp.outcome === 'built' ? cp.value : null; let f = null, val = null;
    if (P) { const fp = await ctx.need('part', { part: 'field', word: m[4].trim(), T: P, cond: g.rule.cond }); parts.push(fp); if (fp.outcome === 'built') f = fp.value; }
    if (Ch && P) { const lp = await ctx.need('part', { part: 'field', word: P.name, T: Ch, cond: g.rule.cond }); parts.push(lp);   // השדה בבת שמצביע על ההורה
      if (stem(m[1]) !== stem(Ch.name)) { val = m[1].replace(/(ים|ות)$/, ''); const rw = (ctx.roleFieldWords || [])[0]; if (rw) parts.push(await ctx.need('part', { part: 'field', word: rw, T: Ch, cond: g.rule.cond })); } }
    if (parts.every((p) => p.outcome === 'built')) return { outcome: 'clause', clause: `${ctx.alertWord} ${ctx.whenWord}מונה ${Ch.name}${val ? ` ${val}` : ''} פחות ${f} ${m[3] === 'מעל' ? ctx.aboveWord : ctx.belowWord} 0`, act: g.rule.act };
    const no = parts.find((p) => p.outcome === 'declared'); if (no) { g.why = `חלק «${no.word}»: ${no.why}`; return null; }
    const qs = parts.filter((p) => p.outcome === 'question'); return { outcome: 'question', key: qs[0].key, dup: qs.every((p) => p.dup), q: `⚖️ «${g.rule.cond.slice(0, 70)}»: חסר: ${qs.map((p) => p.ask).join(' · ')}` }; });
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
    const t0 = (rest.trim().split(/\s+/)[0] || '').replace(/[.,:;]+$/, '');   // תואר צמוד לנספר («ילדים אבודים» · «אירועים קטנים») ⇒ חלק «value» — לא נבלע
    const adj = /(ים|ות)$/.test(noun) && /^[\u0590-\u05FF]{3,}(ים|ות)$/.test(t0) && !/^(ב|ל|ש|כ|ו|מאות)/.test(t0) ? t0 : null;   // תואר מתאים לשם ברבים («אירועים קטנים» ✓ · «אוטובוסים ממסוף» ✗)
    if (!neg && !gm && !adj) { g.why = 'חסרים חלקים: אין סינון/קיבוץ'; return null; }   // לא כלל-הרכבה ⇒ לא שואלים על המילה
    const wm = rest.match(/ב[-־]?(\d+)\s*(?:'|דק'|דקות)|(באותה שעה|בשעה)/); const win = wm ? (wm[1] ? +wm[1] : 60) : null;
    const parts = [await ctx.need('part', { part: 'table', word: noun, cond: c })]; const T = parts[0].outcome === 'built' ? parts[0].value : null;
    let filter = null, group = null; const filters = [];
    if (T && adj) { const p = await ctx.need('part', { part: 'value', word: adj, T, noun, cond: c }); parts.push(p); if (p.outcome === 'built' && p.value && p.value.stage) filters.push(`${ctx.sinceWord} ${p.value.stage} ${ctx.aboveWord} 0`); if (p.outcome === 'built' && p.value && p.value.expr) filters.push(p.value.expr); }
    if (T && neg) { const p = await ctx.need('part', { part: 'stage', word: neg[1], T, cond: c }); parts.push(p); if (p.outcome === 'built') filters.push(`${ctx.sinceWord} ${p.value} ${ctx.aboveWord} 0`); }
    if (T && gm) { const p = await ctx.need('part', { part: 'field', word: gm[1], T, cond: c }); parts.push(p); if (p.outcome === 'built') group = p.value; }
    filter = filters.join(' וגם ') || null;
    if (parts.every((p) => p.outcome === 'built')) return { outcome: 'clause', clause: `${ctx.alertWord} ${ctx.whenWord}${filter ? `${filter} וגם ` : ''}מונה ${T.name}${group ? ` לכל ${group}` : ''}${win ? ` ב-${win} הדקות האחרונות` : ''} ${ctx.aboveWord} ${N - 1}`, act: g.rule.act, parts: parts.map((p) => `${p.part}:${p.word}⇐${p.by}`) };
    const no = parts.find((p) => p.outcome === 'declared'); if (no) { g.why = `חלק «${no.word}»: ${no.why}`; return null; }
    const qs = parts.filter((p) => p.outcome === 'question');
    return { outcome: 'question', key: qs[0].key, dup: qs.every((p) => p.dup), q: `🧩 «${c.slice(0, 70)} → ${g.rule.act.slice(0, 30)}»: ${parts.filter((p) => p.outcome === 'built').map((p) => `«${p.word}» = ${p.value && (p.value.name || p.value.stage || p.value.expr || (p.value.none ? 'תיאור' : '')) || p.value} ✓`).join(' · ')}${parts.some((p) => p.outcome === 'built') ? ' · ' : ''}חסר: ${qs.map((p) => p.ask).join(' · ')}` }; });
  // ⇄ חלק-חסר (kind='part'): part ∈ table|field|stage · word · T. סדר-החיפוש: תשובה שנשמרה ⇒ שם ⇒ הגדרות-המסמך ⇒ שאלה (עם אפשרויות מהמחקר)
  CH.register('part', 'answered', async (ctx, g) => {
    const key = partKey(g), said = key && typeof ctx.answers[key] === 'string' ? ctx.answers[key].trim() : ''; if (!said) return null;
    if (said === 'לא') return { outcome: 'declared', why: 'הבעלים ענה «לא»' };
    if (g.part === 'table') { const t = (ctx.tables || []).find((x) => x.name === said); return t ? { outcome: 'built', value: t } : null; }
    if (g.part === 'value') return { outcome: 'built', value: said === (ctx.descWord || 'תיאור') ? { none: true } : [ctx.aboveWord, ctx.belowWord].some((w) => w && said.includes(` ${w.trim()} `)) ? { expr: said } : { stage: said } };   // «actual time מעל planned time» = הגדרה כהשוואת-שדות
    return { outcome: 'built', value: said }; });
  CH.register('part', 'unitTable', async (ctx, g) => {   // «יחידה ילדים = ילד» (תשובה אחת) ⇒ גם הנספר בכללים
    if (g.part !== 'table') return null; const u = ctx.answers[`יחידה ${g.word}`]; const t = typeof u === 'string' && (ctx.tables || []).find((x) => x.name === u.trim()); return t ? { outcome: 'built', value: t } : null; });
  CH.register('part', 'byName', async (ctx, g) => {
    const w = g.word;
    if (g.part === 'value') { const st = (g.T.stages || []).find((x) => stem(x) === stem(w)); return st ? { outcome: 'built', value: { stage: st } } : null; }
    if (g.part === 'table') { const t = (ctx.tables || []).find((x) => stem(w) === stem(x.name) || w.startsWith(stem(x.name)) || stem(w.split('-')[0]) === stem(x.name)); return t ? { outcome: 'built', value: t } : null; }
    if (g.part === 'field') { const f = (g.T.fields || []).find((x) => x === w) || (g.T.fields || []).find((x) => x.split(/\s+/).some((y) => stem(y) === stem(w))); return f ? { outcome: 'built', value: f } : null; }
    const st = (g.T.stages || []).find((x) => stem(x.replace(/^לא\s+/, '')) === stem(w) || fin(x).includes(stem(w))); return st ? { outcome: 'built', value: st } : null; });
  CH.register('part', 'byDoc', async (ctx, g) => {   // המסמך כותב «Zone אזור» ⇒ שדה zone / zone_id בטבלה אחרת = קיבוץ לפי אזור
    if (g.part !== 'field') return null;
    const E = (ctx.tables || []).find((x) => stem(x.name) === stem(g.word)); if (!E) return null;
    const al = (E.alias || []).map((a) => a.toLowerCase()); const f = (g.T.fields || []).find((x) => al.some((a) => x.toLowerCase() === a || x.toLowerCase() === `${a} id` || x.toLowerCase() === `${a}_id`));
    return f ? { outcome: 'built', value: f } : null; });
  CH.register('part', 'byDesc', async (ctx, g) => {   // תואר שמופיע ברוב האזכורים של הנספר במחקר («ילדים אבודים») = תיאור הטבלה, לא סינון
    // «ילדים אבודים» 18 פעמים ב-12 תרחישים = שם-התופעה (תיאור), גם כש«ילדים» לבד מופיע יותר (ילדים וקשישים · ילדים עם …)
    if (g.part !== 'value' || !ctx.corpus) return null; let all = 0, with_ = 0; const src = new Set();
    for (const d of ctx.corpus) { const ws = d.text.split(/[\s,.:;()"״]+/); for (let i = 0; i < ws.length; i++) if (ws[i] === g.noun) { all++; if (stem(ws[i + 1] || '') === stem(g.word)) { with_++; src.add(d.src); } } }
    const ok = (all >= 3 && with_ / all >= 0.5) || (with_ >= 10 && src.size >= 5);
    return ok ? { outcome: 'built', value: { none: true }, why: `במחקר «${g.noun} ${g.word}» ${with_} פעמים ב-${src.size} תרחישים (מתוך ${all} אזכורים של «${g.noun}») — תיאור` } : null; });
  CH.register('part', 'ask', async (ctx, g) => {
    const key = partKey(g); const dup = ctx.asked.has(key); ctx.asked.add(key);
    if (g.part === 'table') { const opt = coTables(ctx, g.word); return { outcome: 'question', key, dup, ask: `«${g.word}» — איזו טבלה נספרת?${opt.length ? ` (במחקר מופיע ליד: ${opt.join(' · ')})` : ''} — ענה שם-טבלה או «לא»`, q: `🧩 «${g.cond.slice(0, 70)}»: «${g.word}» — איזו טבלה נספרת?${opt.length ? ` (במחקר מופיע ליד: ${opt.join(' · ')})` : ''} — ענה שם-טבלה או «לא»` }; }
    if (g.part === 'field') { const ask = `קיבוץ «${g.word}» — איזה שדה ב«${g.T.name}»? (${(g.T.fields || []).join(' · ')}) — או שם שדה חדש, או «לא»`; return { outcome: 'question', key, dup, ask, q: `🧩 «${g.cond.slice(0, 70)}»: ${ask}` }; }
    if (g.part === 'value') { const ask = `«${g.noun} ${g.word}» — «${g.word}» הוא שלב של ${g.T.name}? (${(g.T.stages || []).join(' · ') || '—'}) — ענה שם-שלב (קיים או חדש), או «${ctx.descWord || 'תיאור'}» אם כל ה${g.noun} כאלה`; return { outcome: 'question', key, dup, ask, q: `🧩 «${g.cond.slice(0, 70)}»: ${ask}` }; }
    const ask = `סינון «לא ${g.word}» — אין שלב כזה ב«${g.T.name}» (עכשיו: ${(g.T.stages || []).join(' · ') || '—'}). אילו שלבים להוסיף? (למשל: לא ${g.word})`; return { outcome: 'question', key, dup, ask, q: `🧩 «${g.cond.slice(0, 70)}»: ${ask}` }; });
  // 🗂️ מיון מה שלא נבנה (25.9 «תסיים כל מה שאתה והמחולל יכולים»): «לא בצורה» אינו סיבה — כל כלל מוצהר מקבל סוג, כדי שמה שנשאר יהיה רק כללים אמיתיים בלי צורה
  CH.register('rule', 'declared', async (ctx, g) => {
    const c = g.rule.cond.trim(), full = `${c} → ${g.rule.act}`; const seen = (ctx.seenRules ??= new Set()); const T = (ctx.tables || []).map((t) => t.name);
    const cls = seen.has(full) ? 'כפול'
      : T.some((n) => stem(c) === stem(n)) ? 'הרחבה — עוברת בערוץ-ההרחבות'
      : /✓/.test(full) || (T.some((n) => c.startsWith(n + ' ')) && /(הקמה|פירוק|סוף|פקיעה)/.test(full)) ? 'שורת-טבלה במחקר (בעלים · מקור · מחזור-חיים)'
      : /^\d{1,2}:\d{2}/.test(c) ? 'ציר-זמן — מה קרה, לא כלל'
      : T.some((n) => c.split(/[\s,:;()]+/).some((w) => stem(w) === stem(n))) && (ctx.stateChangeWords || []).some((w) => c.includes(w)) ? 'כלל-מצב — תנאי בלי שדה/מספר (צריך צורה)'
      : 'תיאור / הוראה — אין תנאי למדידה';
    seen.add(full); return { outcome: 'declared', cls, why: g.why || cls }; });
  for (const kind of ['table', 'extend']) CH.register(kind, 'owner', async (ctx, g) => {
    const said = typeof ctx.answers[g.key] === 'string' ? ctx.answers[g.key].trim() : '';
    return said ? { outcome: 'built', said } : { outcome: 'question', key: g.key, q: g.q }; });
}
