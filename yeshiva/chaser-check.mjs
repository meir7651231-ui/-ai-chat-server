#!/usr/bin/env node
// 🕳️⇒🔁 בדיקת ערוץ-החסרים (הכרעת-בעלים 25.9 «תתקן כבר»): כל חסר שנכנס לערוץ חייב לצאת עם תוצאה (משפט · שאלה · נבנה · מוצהר).
//   (1) כלל-ספירה ⇒ משפט · (2) «שלא X עד HH:MM» בלי שלב ⇒ שאלה אחת (לא שתיים) · (3) כלל בלי צורה ⇒ מוצהר עם סיבה
//   (4) טבלה בלי תשובה ⇒ שאלה · עם תשובה ⇒ נבנה · (5) סוג בלי פותר ⇒ מוצהר · (6) silent תופס חסר בלי תוצאה. exit 1 על כל כשל.
import * as CH from './chaser.mjs'; import * as CS from './chaser-sources.mjs'; import * as K from './koreh.mjs'; import { detectAllClauses } from '../machtzev/generator/capability.mjs';
CS.registerAll(CH);
const T = { name: 'ילד', fields: ['קוד', 'נקודת מפגש'], stages: [] };
const gaps = [
  { kind: 'rule', table: T, rule: { cond: '3 ילדים ב-40 דקות', act: 'תגבור', label: 'נקודות מפגש' } },
  { kind: 'rule', table: T, rule: { cond: 'ילד שלא נאסף עד 01:00', act: 'משטרה' } },
  { kind: 'rule', table: T, rule: { cond: 'ילד לא נאסף עד 01:00', act: 'רווחה' } },
  { kind: 'rule', table: T, rule: { cond: 'הקהל ברחבה', act: 'הודעה' } },
  { kind: 'table', key: 'טבלה קופות', q: '?' }, { kind: 'table', key: 'טבלה ילד', q: '?' }, { kind: 'mystery' },
];
const done = await CH.resolveAll(gaps, { K, answers: { 'טבלה ילד': 'כן' }, asked: new Set(), detect: detectAllClauses, alertWord: 'התראה', whenWord: 'כש', aboveWord: 'מעל', belowWord: 'מתחת ל' });
const fails = []; const o = done.map((x) => x.outcome);
if (o[0] !== 'clause' || !/מונה ילד לכל נקודת מפגש ב-40/.test(done[0].clause)) fails.push(`ספירה-בחלון לא תורגמה: ${done[0].clause || o[0]}`);
if (o[1] !== 'question' || done[1].key !== 'שלבים ילד') fails.push('«שלא נאסף עד» בלי שלב חייב שאלה «שלבים ילד»');
if (!(o[2] === 'question' && done[2].dup)) fails.push('שאלת-שלבים כפולה לאותה טבלה');
if (o[3] !== 'declared' || !done[3].why) fails.push('כלל בלי צורה חייב להיות מוצהר עם סיבה');
if (o[4] !== 'question' || o[5] !== 'built') fails.push('טבלה: בלי תשובה ⇒ שאלה · עם תשובה ⇒ נבנה');
if (o[6] !== 'declared') fails.push('סוג בלי פותר ⇒ מוצהר');
if (CH.silent(done).length) fails.push(`חסרים שקטים: ${CH.silent(done).length}`);
if (CH.silent([{ kind: 'x', outcome: null }]).length !== 1) fails.push('silent לא תופס חסר בלי תוצאה');
if (fails.length) { for (const f of fails) console.error('🚨 chaser: ' + f); process.exit(1); }
console.log(`✓ chaser: ${CH.kinds().length} סוגי-חסר רשומים (${CH.kinds().join(' · ')}) · ${done.length} חסרים ⇒ ${JSON.stringify(CH.summary(done))} · אף אחד לא שקט`);
// (7) הרכבה: «5 אנשים לא מגיבים באותו אזור» ⇒ סינון-שלב + ספירה-לכל-קבוצה · חלק חסר אחד ⇒ שאלה מדויקת
{ const P = { name: 'סדרן', fields: ['שם', 'zone אזור'], stages: ['פעיל', 'לא מגיב'] };
  const d2 = await CH.resolveAll([{ kind: 'rule', table: P, rule: { cond: '5 סדרנים לא מגיבים באותו אזור', act: 'רשת' } }, { kind: 'rule', table: P, rule: { cond: '5 סדרנים לא מגיבים באותו אזור', act: 'רשת' } }],
    { K, answers: {}, asked: new Set(), tables: [P], detect: detectAllClauses, alertWord: 'התראה', whenWord: 'כש', aboveWord: 'מעל', belowWord: 'מתחת ל', sinceWord: 'זמן מאז' });
  const P2 = { ...P, stages: ['פעיל'] }; const d3 = await CH.resolveAll([{ kind: 'rule', table: P2, rule: { cond: '5 סדרנים לא מגיבים באותו אזור', act: 'רשת' } }], { K, answers: {}, asked: new Set(), tables: [P2], detect: detectAllClauses, alertWord: 'התראה', whenWord: 'כש', aboveWord: 'מעל', belowWord: 'מתחת ל', sinceWord: 'זמן מאז' });
  if (d3[0].outcome !== 'question' || !/לא מגיבים/.test(d3[0].q)) { console.error('🚨 chaser: חלק-חסר אחד חייב שאלה מדויקת: ' + d3[0].outcome); process.exit(1); }
  if (d2[0].outcome !== 'clause' || !/זמן מאז לא מגיב מעל 0 וגם מונה סדרן לכל zone אזור מעל 4/.test(d2[0].clause)) { console.error('🚨 chaser: הרכבה לא הרכיבה: ' + (d2[0].clause || d2[0].outcome)); process.exit(1); }
  console.log(`✓ chaser הרכבה: «${d2[0].clause}» · חסר-שלב ⇒ ${d3[0].outcome}: ${d3[0].q.slice(0, 80)}`); }
// (8) «וגם» אחרי «כש» (רגרסיה שנתפסה 25.9: whenRegex דרש מילה צמודה ⇒ החלק השני נבלע) · ספירה עם סינון נשארת ספירה
{ const a = detectAllClauses('התראה כשציון מתחת ל-55 וגם ציון מעל 10'), b = detectAllClauses('התראה כשזמן מאז לא מגיב מעל 0 וגם מונה אדם לכל אזור מעל 2');
  if (a.length !== 2 || !a[1].and || b.length !== 2 || !b[1].and) { console.error('🚨 chaser: «וגם» נבלע — ' + JSON.stringify([a.length, b.length])); process.exit(1); }
  console.log('✓ «וגם»: שני החלקים נקראים (גם אחרי «כש»)'); }
// (9) ⇄ חלק-חסר עובר בערוץ (25.9 «תשדרג את הקיים»): «5 בעלי-תפקידים לא מגיבים באזור צפון» — המילה לא שם-טבלה ⇒ שאלה עם אפשרויות מהמחקר (לא «חסר» ועצירה)
//     אחרי תשובה ⇒ השלב/השדה נשאלים בנפרד · «אזור» ⇒ שדה zone דרך השם-הלועזי שבמסמך (Zone) · כל חלק נרשם ב-subs ואף אחד לא שקט
{ const Z = { name: 'אזור', alias: ['Zone'], fields: ['geometry', 'sector'], stages: ['open'] }, A = { name: 'אדם', alias: ['Person'], fields: ['code', 'roles', 'sector'], stages: ['registered', 'on site'] }, S = { name: 'שיבוץ', alias: ['Assignment'], fields: ['person', 'zone'], stages: [] };
  const R = { kind: 'rule', table: A, rule: { cond: '5 בעלי-תפקידים לא מגיבים באזור צפון', act: 'רשת' } };
  const corpus = [{ text: 'אם 5 בעלי-תפקידים לא מגיבים, אדם אחד בודק. בעלי-תפקידים הם אדם עם תפקיד.' }];
  const run = async (answers, tables) => { const cx = { K, answers, asked: new Set(), tables, corpus, subs: [], detect: detectAllClauses, alertWord: 'התראה', whenWord: 'כש', aboveWord: 'מעל', belowWord: 'מתחת ל', sinceWord: 'זמן מאז' }; return { d: (await CH.resolveAll([R], cx))[0], subs: cx.subs }; };
  const a = await run({}, [Z, A, S]);
  if (a.d.outcome !== 'question' || a.d.key !== 'מילה בעלי-תפקידים' || !/אדם/.test(a.d.q)) { console.error('🚨 chaser: מילה שאינה שם-טבלה חייבת שאלה עם אפשרויות מהמחקר: ' + (a.d.q || a.d.why)); process.exit(1); }
  const b = await run({ 'מילה בעלי-תפקידים': 'אדם' }, [Z, A, S]);
  if (b.d.outcome !== 'question' || b.d.key !== 'שלבים אדם') { console.error('🚨 chaser: אחרי תשובה — השלב נשאל: ' + b.d.key); process.exit(1); }
  const A2 = { ...A, stages: [...A.stages, 'לא מגיב'] }; const c = await run({ 'מילה בעלי-תפקידים': 'אדם', 'שדה אדם: אזור': 'sector' }, [Z, A2, S]);
  if (c.d.outcome !== 'clause' || !/זמן מאז לא מגיב מעל 0 וגם מונה אדם לכל sector מעל 4/.test(c.d.clause)) { console.error('🚨 chaser: אחרי התשובות — הרכבה: ' + (c.d.clause || c.d.q)); process.exit(1); }
  const S2 = { ...S, stages: ['לא מגיב'] }; const e = await run({ 'מילה בעלי-תפקידים': 'שיבוץ' }, [Z, A, S2]);
  if (e.d.outcome !== 'clause' || !/לכל zone/.test(e.d.clause) || !e.subs.some((p) => p.by === 'byDoc')) { console.error('🚨 chaser: «אזור» ⇒ שדה zone דרך Zone שבמסמך: ' + (e.d.clause || e.d.q)); process.exit(1); }
  for (const x of [a, b, c, e]) if (!x.subs.length || CH.silent(x.subs).length) { console.error('🚨 chaser: חלק-חסר לא עבר בערוץ / שקט'); process.exit(1); }
  console.log(`✓ חלק-חסר ⇒ ערוץ: «${a.d.key}» (${a.d.q.match(/במחקר[^)]*/)?.[0] || '—'}) ⇒ «${b.d.key}» ⇒ «${c.d.clause}» · zone דרך המסמך`); }
// (10) פותר שלא צורך את כל החלקים לא בונה חלק מהכלל · תואר צמוד ⇒ חלק · סף בלי מספר ⇒ שאלה (לא ניחוש) · שדה אחרי מילת-השוואה ⇒ מוצהר
{ const E = { name: 'אירוע', fields: ['kind', 'point'], stages: ['open', 'closed'] }, P = { name: 'נקודה', alias: ['Point'], fields: ['משפחות ממתינות', 'תקן שוטרים'], stages: [] };
  const cx = { K, answers: {}, asked: new Set(), tables: [E, P], corpus: [], subs: [], compareWords: ['מתקרב', 'מתחת'], detect: detectAllClauses, alertWord: 'התראה', whenWord: 'כש', aboveWord: 'מעל', belowWord: 'מתחת ל', sinceWord: 'זמן מאז' };
  const d = await CH.resolveAll([{ kind: 'rule', table: E, rule: { cond: '3 אירועים קטנים באותה נקודה באותה שעה', act: 'ריכוז' } }, { kind: 'rule', table: P, rule: { cond: 'משפחות ממתינות מתקרב לקיבולת', act: 'התראה' } }, { kind: 'rule', table: P, rule: { cond: 'ספירה מתחת לתקן שוטרים', act: 'התראה' } }], cx);
  const bad = [];
  if (d[0].outcome !== 'question' || d[0].by !== 'compose' || d[0].key !== 'תואר אירוע: קטנים') bad.push(`«אירועים קטנים באותה נקודה» חייב הרכבה+שאלה על «קטנים», לא «3 אירועים»: ${d[0].clause || d[0].key}`);
  if (d[1].outcome !== 'question' || d[1].key !== 'סף נקודה: משפחות ממתינות') bad.push('סף בלי מספר ⇒ שאלה');
  if (d[2].outcome !== 'declared' || !/ספירה מול/.test(d[2].why)) bad.push('שדה אחרי מילת-השוואה ⇒ מוצהר עם סיבה');
  const d2 = await CH.resolveAll([{ kind: 'rule', table: E, rule: { cond: '3 אירועים קטנים באותה נקודה באותה שעה', act: 'ריכוז' } }], { ...cx, asked: new Set(), answers: { 'תואר אירוע: קטנים': 'open' } });
  if (d2[0].outcome !== 'clause' || !/זמן מאז open מעל 0 וגם מונה אירוע לכל point ב-60 הדקות האחרונות מעל 2/.test(d2[0].clause)) bad.push('אחרי תשובה: ' + (d2[0].clause || d2[0].q));
  if (bad.length) { for (const b of bad) console.error('🚨 chaser: ' + b); process.exit(1); }
  console.log(`✓ כל החלקים נצרכים: «${d2[0].clause}» · סף ⇒ שאלה · ספירה-מול-שדה ⇒ מוצהר`); }
// (11) ספירה מול שדה: «שוטרים במעבר מתחת לתקן שוטרים» — «שוטרים» = שיבוץ (תשובת-יחידה) ⇒ «שוטר» הוא ערך-הסינון · חסר שדה-קישור/תפקיד ⇒ שאלה
{ const M = { name: 'מעבר', fields: ['from zone', 'תקן שוטרים'], stages: [] }, Sh = { name: 'שיבוץ', fields: ['person', 'post'], stages: [] };
  const base = { K, asked: new Set(), corpus: [], subs: [], roleFieldWords: ['תפקיד'], compareWords: ['מתחת'], detect: detectAllClauses, alertWord: 'התראה', whenWord: 'כש', aboveWord: 'מעל', belowWord: 'מתחת ל', sinceWord: 'זמן מאז' };
  const R = { kind: 'rule', table: M, rule: { cond: 'שוטרים במעבר מתחת לתקן שוטרים', act: 'התראה' } };
  const a = (await CH.resolveAll([R], { ...base, tables: [M, Sh], answers: { 'יחידה שוטרים': 'שיבוץ' } }))[0];
  const Sh2 = { ...Sh, fields: [...Sh.fields, 'מעבר', 'תפקיד'] }; const b = (await CH.resolveAll([R], { ...base, asked: new Set(), tables: [M, Sh2], answers: { 'יחידה שוטרים': 'שיבוץ' } }))[0];
  if (a.outcome !== 'question' || a.key !== 'שדה שיבוץ: מעבר' || b.outcome !== 'clause' || b.clause !== 'התראה כשמונה שיבוץ שוטר פחות תקן שוטרים מתחת ל 0') { console.error('🚨 chaser: ספירה-מול-שדה: ' + JSON.stringify([a.outcome, a.key, b.clause || b.q])); process.exit(1); }
  console.log(`✓ ספירה מול שדה: חסר קישור ⇒ «${a.key}» · אחרי ⇒ «${b.clause}»`); }
// (12) השפעת-מצב ותלות: «גשם: המדרגות חלקות → קיבולת יורדת» ⇒ שאלת-מקדם ⇒ נבנה (מקדם) · «נכס נפל» ⇒ פועל ⇒ שלב ⇒ התראה עם «נופלים איתו»
{ const St = { name: 'מדרגות', fields: ['קיבולת'], stages: [] }, As = { name: 'נכס', fields: ['kind', 'depends on', 'feeds'], stages: ['ok', 'down'] };
  const base = { K, asked: new Set(), corpus: [], subs: [], tables: [St, As], effectVerbs: ['יורדת'], stateChangeWords: ['נפל'], edgeFields: { down: ['feeds'], up: ['depends on'] }, reachWords: ['נופלים איתו'], detect: detectAllClauses, alertWord: 'התראה', whenWord: 'כש', aboveWord: 'מעל', belowWord: 'מתחת ל', sinceWord: 'זמן מאז' };
  const E = { kind: 'rule', table: St, rule: { cond: 'גשם ב-05:00: המדרגות חלקות', act: 'קיבולת יורדת' } }, D = { kind: 'rule', table: As, rule: { cond: 'נכס נפל', act: 'מה נופל איתו' } };
  const a = await CH.resolveAll([E, D], { ...base, answers: {} }); const b = await CH.resolveAll([E, D], { ...base, asked: new Set(), answers: { 'השפעה מדרגות: קיבולת במצב גשם': '0.8', 'תואר נכס: נפל': 'down' } });
  const bad = []; if (a[0].outcome !== 'question' || a[0].key !== 'השפעה מדרגות: קיבולת במצב גשם') bad.push('השפעה בלי מקדם ⇒ שאלה'); if (a[1].outcome !== 'question' || a[1].key !== 'תואר נכס: נפל') bad.push('תלות: פועל ⇒ שאלת-שלב');
  if (b[0].outcome !== 'built' || !b[0].effect || b[0].effect.n !== 0.8) bad.push('השפעה עם מקדם ⇒ נבנה'); if (b[1].outcome !== 'clause' || b[1].clause !== 'התראה כשזמן מאז down מעל 0 וגם נופלים איתו מעל 0') bad.push('תלות ⇒ ' + (b[1].clause || b[1].q));
  if (bad.length) { for (const x of bad) console.error('🚨 chaser: ' + x); process.exit(1); }
  console.log(`✓ השפעת-מצב ⇒ ${b[0].why} · תלות ⇒ «${b[1].clause}»`); }
