/** בדיקת-קצה · קופסת-reenroll — מוכיחה את דוגמאות-החוזה דרך הקופסה בלבד (חוק-4).
 *  DoD (דיבר 12): node new/boxes/reenroll.test.mjs ⇒ exit 0. */
import * as R from './reenroll.mjs';
let f = 0;
const eq = (got, want, msg) => {
  const a = JSON.stringify(got), b = JSON.stringify(want);
  if (a !== b) { console.error(`✗ ${msg}\n   got=${a}\n   want=${b}`); f = 1; }
};

// 1) academicYearLabel — ספט׳ ⇒ שנה-נוכחית · לפני-ספט׳ ⇒ שנה-קודמת
eq(R.academicYearLabel('2026-09-01'), '2026/27', 'academicYearLabel ספט׳');
eq(R.academicYearLabel('2026-06-01'), '2025/26', 'academicYearLabel יוני');
eq(R.academicYearLabel('2027-01-15'), '2026/27', 'academicYearLabel ינואר');

// 2) nextYearDates — שומר יום/חודש
eq(R.nextYearDates('2026-09-01', '2027-06-30'), { start: '2027-09-01', end: '2028-06-30' }, 'nextYearDates');

// 3) renewOf / 4) isRenewed
eq(R.renewOf({ renew: 'yes' }), 'yes', 'renewOf yes');
eq(R.renewOf({}), '', 'renewOf חסר');
eq(R.isRenewed({ renewedToId: 'x' }), true, 'isRenewed true');
eq(R.isRenewed({}), false, 'isRenewed false');

// 5) enrollSummary — כספים+נוכחות; lastPresent=הגדול-לקסיקוגרפית
const e5 = { status: 'active', presents: ['2026-01-05', '2026-01-01'], absences: [{ noshow: true }, {}], totalDue: 200, payments: [{ amount: 120 }] };
eq(R.enrollSummary(e5), { presents: 2, absences: 2, noshow: 1, balance: 80, paid: 120, statusLabel: 'פעיל', lastPresent: '2026-01-05' }, 'enrollSummary');
// קצה: שדות חסרים לגמרי
eq(R.enrollSummary({ status: 'wait' }), { presents: 0, absences: 0, noshow: 0, balance: 0, paid: 0, statusLabel: 'רשימת-המתנה', lastPresent: '' }, 'enrollSummary ריק');

// 6) buildReenrollRows — מיון עברי + findMember + סינונים
const db = {
  families: [
    { id: 'fa', name: 'כהן', members: [{ id: 'm1', first: 'בני' }, { id: 'm2', first: 'אבי' }] },
    { id: 'fb', name: 'לוי', members: [{ id: 'm3', first: 'גדי' }] },
  ],
  courses: [{ id: 'c1', name: 'גיטרה', start: '2026-09-01', end: '2027-06-30', year: '2026/27' }],
  enrollments: [
    { id: 'e1', memberId: 'm1', courseId: 'c1', renew: 'yes', status: 'active', presents: [], absences: [], payments: [], totalDue: 0 },
    { id: 'e2', memberId: 'm2', courseId: 'c1', renew: 'no', status: 'active', presents: [], absences: [], payments: [], totalDue: 0 },
    { id: 'e3', memberId: 'm3', courseId: 'c1', status: 'active', renewedToId: 'zz', presents: [], absences: [], payments: [], totalDue: 0 },
  ],
};
const rows = R.buildReenrollRows(db);
eq(rows.map((r) => r.memberName), ['אבי', 'בני', 'גדי'], 'buildReenrollRows מיון-עברי');
eq(rows.map((r) => r.familyName), ['כהן', 'כהן', 'לוי'], 'buildReenrollRows findMember');
eq(rows[2].renewed, true, 'buildReenrollRows renewed');
// undecided ⇒ רק גדי (e3, בלי שדה renew) · לא-קיים ⇒ ריק
eq(R.buildReenrollRows(db, { decision: 'undecided' }).map((r) => r.memberName), ['גדי'], 'filter undecided');
eq(R.buildReenrollRows(db, { decision: 'yes' }).map((r) => r.memberName), ['בני'], 'filter yes');
// includeRenewed:false ⇒ מסיר את e3
eq(R.buildReenrollRows(db, { includeRenewed: false }).map((r) => r.e.id), ['e2', 'e1'], 'filter includeRenewed');
// q רב-מילתי
eq(R.buildReenrollRows(db, { q: 'בני כהן' }).map((r) => r.memberName), ['בני'], 'filter q רב-מילתי');
eq(R.buildReenrollRows(db, { q: 'בני לוי' }).length, 0, 'filter q שולל');

// 7) reenrollCounts
eq(R.reenrollCounts(rows), { total: 3, yes: 1, no: 1, hold: 0, undecided: 1, renewed: 1 }, 'reenrollCounts');

// 8) renewTargets — yes && !renewed
eq(R.renewTargets(rows).map((r) => r.e.id), ['e1'], 'renewTargets');

// 9) freshNextYearEnrollment — איפוס-היסטוריה, שמירת-תמחור
const src9 = { id: 'old', memberId: 'm1', courseId: 'c1', plan: 'punch', purchased: 10, used: 4, group: 'ג1', absences: [{}], payments: [{ amount: 50 }], totalDue: 300, dueDate: '2026-01-01', status: 'ended', note: 'x', enrolledAt: '2025-09-01', freq: 1, tier: 'B' };
eq(R.freshNextYearEnrollment(src9, 'c2', 'new1', '2026-08-24'), {
  id: 'new1', memberId: 'm1', courseId: 'c2', plan: 'punch', purchased: 0, used: 0, group: 'ג1',
  absences: [], payments: [], totalDue: 300, dueDate: '', status: 'active', note: '', enrolledAt: '2026-08-24', freq: 1, tier: 'B',
}, 'freshNextYearEnrollment');
eq(R.freshNextYearEnrollment(src9, 'c2', 'new2', '2026-08-24', 'ג9').group, 'ג9', 'freshNextYearEnrollment groupOverride');

// 10) nextYearCourseDraft
eq(R.nextYearCourseDraft({ id: 'c1', name: 'גיטרה', start: '2026-09-01', end: '2027-06-30', room: 'A' }, 'c2'),
  { id: 'c2', name: 'גיטרה', start: '2027-09-01', end: '2028-06-30', room: 'A', year: '2027/28', prevYearId: 'c1' }, 'nextYearCourseDraft');

// 11) studentHistory — מהחדש-לישן, fromRenewal/renewedForward
const dbH = {
  families: [{ id: 'fa', name: 'כהן', members: [{ id: 'm1', first: 'בני' }] }],
  courses: [
    { id: 'cA', name: 'ישן', start: '2024-09-01', end: '2025-06-30', year: '2024/25' },
    { id: 'cB', name: 'חדש', start: '2025-09-01', end: '2026-06-30', year: '2025/26' },
  ],
  enrollments: [
    { id: 'h1', memberId: 'm1', courseId: 'cA', status: 'ended', renewedToId: 'h2', enrolledAt: '2024-09-01', presents: [], absences: [], payments: [], totalDue: 0 },
    { id: 'h2', memberId: 'm1', courseId: 'cB', status: 'active', enrolledAt: '2025-09-01', presents: [], absences: [], payments: [], totalDue: 0 },
  ],
};
const hist = R.studentHistory(dbH, 'm1');
eq(hist.map((h) => h.courseName), ['חדש', 'ישן'], 'studentHistory מיון');
eq([hist[0].fromRenewal, hist[0].renewedForward], [true, false], 'studentHistory חדש');
eq([hist[1].fromRenewal, hist[1].renewedForward], [false, true], 'studentHistory ישן');

// 12) reenrollCsvRows — כותרת + decWord
const csv = R.reenrollCsvRows(rows);
eq(csv[0], ['תלמיד/ה', 'משפחה', 'חוג', 'נוכחות', 'חיסורים', 'יתרה ₪', 'סטטוס', 'החלטה', 'נרשם לשנה הבאה', 'הערה'], 'csv כותרת');
// ממויין עברי: אבי(no) · בני(yes) · גדי(renewed/undecided)
eq(csv[1][7], 'לא ממשיך', 'csv decWord no');
eq(csv[2][7], 'ממשיך', 'csv decWord yes');
eq(csv[3][8], 'כן', 'csv renewed');
eq(csv.length, 4, 'csv אורך');

// 13) reenrollListText / studentHistoryText
const lt = R.reenrollListText(rows).split('\n');
if (!lt.some((l) => l.includes('✓נרשם'))) { console.error('✗ listText ✓נרשם'); f = 1; }
if (!lt.some((l) => l.includes('לא ממשיך'))) { console.error('✗ listText לא ממשיך'); f = 1; }
eq(R.studentHistoryText(hist).split('\n').length, 2, 'studentHistoryText שורות');

/* 🛡 מגן-הכרעה: ההכרעות (atNoon/toIso/findMember) + סדר-קסקדת-הכספים חתומים verbatim במקור-הקופסה. */
import { readFileSync } from 'node:fs';
const src = readFileSync(new URL('./reenroll.mjs', import.meta.url), 'utf8');
if (!src.includes('T12:00:00')) { console.error('✗ מגן: מוסכמת-atNoon שונתה'); f = 1; }
if (!src.includes("padStart(2, '0')")) { console.error('✗ מגן: פורמט-toIso שונה'); f = 1; }
if (!src.includes("f.name || ''")) { console.error('✗ מגן: הכרעת-findMember שונתה'); f = 1; }
// קסקדת-הכספים: paidOf מוזרק ל-payBal, ושניהם ל-enrollSummary — הסדר הוא המשמעות
if (src.indexOf('payBal(e, paidOf)') < 0 || src.indexOf('enrollSummary(e, wiredPayBal, paidOf)') < 0) { console.error('✗ מגן: קסקדת-הכספים שונתה'); f = 1; }
// חוק-2/3: אך-ורק ייבוא-אטומים
if (/from '\.\.\/boxes\//.test(src) || /from '\.\/[a-z-]+\.mjs'/.test(src)) { console.error('✗ מגן: ייבוא לא-אטומי'); f = 1; }

if (f) process.exit(1);
console.log('✓ קופסת-reenroll: 13 קבוצות-קצה + מגן-הכרעה (atNoon/toIso/findMember/קסקדת-כספים) — ירוק');
