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
