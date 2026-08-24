/** בדיקת-קצה · קופסת-components-courses — מוכיחה את דוגמאות-החוזה דרך הקופסה בלבד (חוק-4).
 *  DoD (דיבר 12): node new/boxes/components-courses.test.mjs ⇒ exit 0. */
import * as C from './components-courses.mjs';
let f = 0;
const eq = (got, want, msg) => {
  const a = JSON.stringify(got), b = JSON.stringify(want);
  if (a !== b) { console.error(`✗ ${msg}\n   got=${a}\n   want=${b}`); f = 1; }
};
const NOON = (iso) => new Date(iso + 'T12:00:00');

// 1) תאריכים / תצוגה
eq(C.fmtDate('2026-08-24'), '24/08/2026', 'fmtDate');
eq(C.fmtDate(''), '—', 'fmtDate ריק');
eq(C.fmtDate('2026-8'), '—', 'fmtDate חלקי'); // אין d ⇒ —
// אוגוסט (m=7) מתגלגל לשנה"ל הבאה · יולי (m=6) נשאר בנוכחית
eq(C.defaultCourseDates('2026-08-24'), { start: '2026-09-01', end: '2027-07-31' }, 'defaultCourseDates אוגוסט');
eq(C.defaultCourseDates('2026-07-15'), { start: '2025-09-01', end: '2026-07-31' }, 'defaultCourseDates יולי');
// קצה: today שבור ⇒ נופל לשעון-הריצה, אבל לפחות לא זורק ומחזיר טווח תקין
{ const r = C.defaultCourseDates('bad-date'); if (!/^\d{4}-09-01$/.test(r.start)) { console.error('✗ defaultCourseDates שבור'); f = 1; } }

// 2) ageOf (now מוזרק ⇒ דטרמיניסטי)
eq(C.ageOf('2000-06-15', NOON('2026-08-24')), 26, 'ageOf אחרי יום-הולדת');
eq(C.ageOf('2000-12-15', NOON('2026-08-24')), 25, 'ageOf לפני יום-הולדת');
eq(C.ageOf('', NOON('2026-08-24')), null, 'ageOf ריק');
eq(C.ageOf('לא-תאריך', NOON('2026-08-24')), null, 'ageOf שבור');

// 3) courseDateError (termOf מוזרק ⇒ מונח-חוג ברירת-מחדל)
if (!/מוקדם/.test(C.courseDateError('2026-09-01', '2026-08-01') || '')) { console.error('✗ courseDateError end<start'); f = 1; }
eq(C.courseDateError('2026-01-01', '2026-02-01'), null, 'courseDateError תקין');
eq(C.courseDateError('', ''), null, 'courseDateError ריק');
// termOf חי דרך config.terms — מונח מותאם נכנס להודעה
if (!/החוגון/.test(C.courseDateError('2026-09-01', '2026-08-01', { terms: { 'entity.course': 'חוגון' } }) || '')) { console.error('✗ courseDateError termOf'); f = 1; }

// 4) presentsInMonth
eq(C.presentsInMonth(['2026-08-01', '2026-07-30', '2026-08-31'], '2026-08-24'), 2, 'presentsInMonth');
eq(C.presentsInMonth(undefined, '2026-08-24'), 0, 'presentsInMonth undefined');

// 5) מפגשים
eq(C.sessionsOf({ weekday: 2, time: '17:00' }), [{ day: 2, time: '17:00', label: '' }], 'sessionsOf fallback');
eq(C.sessionsOf({ sessions: [{ day: 1, time: '10:00', label: 'א' }] }), [{ day: 1, time: '10:00', label: 'א' }], 'sessionsOf מלא');
eq(C.groupsHintFromAudience('4 קבוצות'), 4, 'groupsHint 4');
eq(C.groupsHintFromAudience('1 קבוצות'), null, 'groupsHint מתחת-טווח');
eq(C.groupsHintFromAudience(''), null, 'groupsHint ריק');
eq(C.groupsHintFromAudience(undefined), null, 'groupsHint undefined');
eq(C.groupLabelOf({ label: '' }, 0), 'קבוצה 1', 'groupLabelOf פוזיציוני');
eq(C.groupLabelOf({ label: 'בוקר' }, 2), 'בוקר', 'groupLabelOf מפורש');
// DAY_NAMES מוזרק ל-groupOptionsOf
eq(C.groupOptionsOf({ sessions: [{ day: 1, time: '17:00', label: '' }, { day: 3, time: '18:00', label: '' }] }),
  [{ v: 'קבוצה 1', t: 'קבוצה 1 · יום שני 17:00' }, { v: 'קבוצה 2', t: 'קבוצה 2 · יום רביעי 18:00' }], 'groupOptionsOf DAY_NAMES');
eq(C.groupOptionsOf({ weekday: 1, time: '17:00' }), [], 'groupOptionsOf מפגש-יחיד');
// groupLabelOf מוזרק ל-groupRemapOnRemoval
{ const r = C.groupRemapOnRemoval([{ label: '' }, { label: '' }, { label: '' }], 0);
  eq(r.removed, 'קבוצה 1', 'groupRemap removed');
  eq([...r.remap.entries()], [['קבוצה 2', 'קבוצה 1'], ['קבוצה 3', 'קבוצה 2']], 'groupRemap remap'); }

// 6) coursesOfTeacher · roomsNow (sessionsOf שוקע · now מוזרק)
eq(C.coursesOfTeacher([{ teacherId: 't1' }, { teacherId: 't2' }], 't1'), [{ teacherId: 't1' }], 'coursesOfTeacher סינון');
eq(C.coursesOfTeacher([{ teacherId: 't1' }], null), [{ teacherId: 't1' }], 'coursesOfTeacher null=הכל');
{ const db = { rooms: [{ id: 'r1', active: true, slot: 60 }, { id: 'r2', active: false }],
    courses: [{ id: 'c1', roomId: 'r1', weekday: 1, time: '17:00' }] };
  const busy = C.roomsNow(db, new Date(2026, 7, 24, 17, 30)); // 2026-08-24 שני 17:30
  eq(busy.length, 1, 'roomsNow חדר-פעיל-יחיד');
  eq(busy[0].busyWith?.id, 'c1', 'roomsNow תפוס'); }

// 7) שרשרת-הכסף: paidOf ⇒ payBal ⇒ enrollmentPaidStatus/planLabelOf
eq(C.paidOf({ payments: [{ amount: 40 }, { amount: NaN }, { amount: 20 }] }), 60, 'paidOf מתעלם-מ-NaN');
eq(C.payBal({ totalDue: 200, payments: [{ amount: 120 }] }), 80, 'payBal יתרה');
eq(C.payBal({ totalDue: 100, payments: [{ amount: 150 }] }), 0, 'payBal לא-שלילי');
eq(C.enrollmentPaidStatus({ totalDue: 200, payments: [{ amount: 200 }] }), 'paid', 'paidStatus paid');
eq(C.enrollmentPaidStatus({ totalDue: 200, payments: [{ amount: 50 }] }), 'partial', 'paidStatus partial');
eq(C.enrollmentPaidStatus({ totalDue: 200, payments: [] }), 'unpaid', 'paidStatus unpaid');
eq(C.enrollmentPaidStatus({ paidFull: true, totalDue: 0, payments: [] }), 'paid', 'paidStatus paidFull');
eq(C.planLabelOf({ plan: 'punch', purchased: 10, status: 'active', absences: [{}], totalDue: 100, payments: [{ amount: 40 }] }),
  'כרטיסייה · 10 · 1 חיס׳ · 💳 ₪60', 'planLabelOf כרטיסייה+יתרה');

// 8) שרשרת-התמחור: lessonPriceForTier + lessonsInTerm ⇒ weightedQuote ⇒ enrollmentQuote
eq(C.weightedQuote({ lessonPrice: 50 }, { freq: 1, unit: 'week', term: 'monthly', tier: '' }),
  { lessons: 4.5, perLesson: 50, total: 217 }, 'weightedQuote שבועי⇒חודשי');
eq(C.lessonPriceForTier({ lessonPrice: 50, lessonPrice1: 40 }, '1'), 40, 'lessonPriceForTier דרג-1');
eq(C.termLabel('months', 3), '3 חודשים', 'termLabel months');
eq(C.termLabel('year'), 'שנתי', 'termLabel year');
eq(C.enrollmentQuote({ perLesson: false }, {}), null, 'enrollmentQuote לא-פר-שיעור');
eq(C.enrollmentQuote({ perLesson: true, lessonPrice: 50 }, { freq: 1, freqUnit: 'week', term: 'monthly' }),
  { lessons: 4.5, perLesson: 50, total: 217 }, 'enrollmentQuote מלא');

// 9) שרשרת-הכיתה: GRADE_ORDER ⇒ gradeIndex ⇒ gradeFits ⇒ courseFitsMember
eq(C.gradeIndex('כיתה ג׳'), 3, 'gradeIndex סובלני');
eq(C.gradeIndex(''), -1, 'gradeIndex ריק');
eq(C.gradeIndex('לא-כיתה'), -1, 'gradeIndex לא-מוכר');
eq(C.gradeFits({ gradeMin: 'ב', gradeMax: 'ד' }, 'ה'), false, 'gradeFits מחוץ-לטווח');
eq(C.gradeFits({ gradeMin: 'ב', gradeMax: 'ד' }, 'ג'), true, 'gradeFits בטווח');
eq(C.gradeFits({}, 'ה'), true, 'gradeFits בלי-טווח=רך');
eq(C.gradeFits({ gradeMin: 'ב' }, 'לא-מזוהה'), true, 'gradeFits כיתה-לא-מזוהה=רך');
eq(C.courseFitsMember({ gender: 'f' }, 'm', null), false, 'courseFitsMember מגדר');
eq(C.courseFitsMember({ ageMin: 8, ageMax: 12 }, undefined, 6), false, 'courseFitsMember גיל');
eq(C.courseFitsMember({ gradeMin: 'ב', gradeMax: 'ד' }, undefined, null, 'ה'), false, 'courseFitsMember כיתה');
eq(C.courseFitsMember({}, undefined, null), true, 'courseFitsMember הכל-חסר=מתאים');

// 10) scheduleClashText (sessionsOf + DAY_NAMES מוזרקים)
eq(C.scheduleClashText({ courses: [{ id: 'c2', name: 'ציור', weekday: 1, time: '17:00' }],
  enrollments: [{ memberId: 'm1', courseId: 'c2', status: 'active' }] }, 'm1', { id: 'c1', weekday: 1, time: '17:00' }),
  '⚠ התנגשות לו"ז: כבר משובצ/ת ל"ציור" — יום שני 17:00', 'scheduleClash התנגשות');
eq(C.scheduleClashText({ courses: [{ id: 'c2', name: 'ציור', weekday: 2, time: '17:00' }],
  enrollments: [{ memberId: 'm1', courseId: 'c2', status: 'active' }] }, 'm1', { id: 'c1', weekday: 1, time: '17:00' }),
  null, 'scheduleClash בלי-התנגשות');

// 11) enroll dedup: normName (norm-search + הסרת-רווחים)
eq(C.offerNewFamily([{ name: 'בן דוד' }], 'בןדוד'), false, 'offerNewFamily דה-דופ-רווחים');
eq(C.offerNewFamily([{ name: 'כהן' }], 'לוי'), true, 'offerNewFamily חדש');
eq(C.offerNewFamily([], 'a'), false, 'offerNewFamily קצר-מדי');
eq(C.resolveEnrollFamily([{ id: 'a', name: 'כהן' }], '__new', 'כהן'), { fam: { id: 'a', name: 'כהן' }, create: false }, 'resolveEnrollFamily דה-דופ');
eq(C.resolveEnrollFamily([{ id: 'a', name: 'כהן' }], '__new', 'לוי'), { fam: null, create: true }, 'resolveEnrollFamily חדש');
eq(C.resolveEnrollFamily([{ id: 'a', name: 'כהן' }], 'a', ''), { fam: { id: 'a', name: 'כהן' }, create: false }, 'resolveEnrollFamily קיים');

// 12) גלגל + ניקוב-כפול + מונים
eq(C.wheelIndexUnderPointer(0, 4), 0, 'wheel 0');
eq(C.wheelIndexUnderPointer(0, 1), 0, 'wheel n<=1');
eq(C.punchConfirmStep(false, null, 'x', 0), { fire: true, next: null }, 'punch כבוי=מיידי');
eq(C.punchConfirmStep(true, null, 'x', 1000), { fire: false, next: { id: 'x', armedAt: 1000 } }, 'punch זריון');
eq(C.punchConfirmStep(true, { id: 'x', armedAt: 1000 }, 'x', 2000), { fire: true, next: null }, 'punch אישור-בחלון');
eq(C.enrollCount({ enrollments: [{ courseId: 'c1', status: 'active' }, { courseId: 'c1', status: 'ended' }, { courseId: 'c1', status: 'wait' }] }, 'c1'), 1, 'enrollCount לא-סופר-ended/wait');

// 13) קבועי-המילון (חשופים כמות-שהם)
eq(C.DAY_NAMES[1], 'שני', 'DAY_NAMES');
eq(C.DAY_LETTERS[0], 'א׳', 'DAY_LETTERS');
eq(C.PRICING_TERMS.length, 7, 'PRICING_TERMS');
eq(C.GRADE_ORDER[0], 'גן', 'GRADE_ORDER');
eq(C.ENROLL_NEW_FAMILY, '__new', 'ENROLL_NEW_FAMILY');
eq(C.PUNCH_CONFIRM_MS, 3000, 'PUNCH_CONFIRM_MS');
eq(C.OTHER, '__other', 'OTHER');
eq(C.CAT_OPTIONS.length, 9, 'CAT_OPTIONS');

/* 🛡 מגן-הכרעה: ההכרעות (normName · שעון-מוזרק · שלוש-השרשראות · DAY_NAMES) חתומות verbatim במקור-הקופסה. */
import { readFileSync } from 'node:fs';
const src = readFileSync(new URL('./components-courses.mjs', import.meta.url), 'utf8');
if (!src.includes("normSearch(s).replace(/\\s/g, '')")) { console.error('✗ מגן: תבנית-normName שונתה'); f = 1; }
if (!src.includes('now = new Date()')) { console.error('✗ מגן: הזרקת-שעון-ברירת-מחדל שונתה'); f = 1; }
// שרשרת-הכסף: paidOf ⇒ payBal ⇒ enrollmentPaidStatus/planLabelOf — הסדר הוא המשמעות
if (!src.includes('payBalWire(e, paidOf)')) { console.error('✗ מגן: שרשרת-כסף payBal'); f = 1; }
if (!src.includes('enrollmentPaidStatusWire(e, wiredPayBal, paidOf)')) { console.error('✗ מגן: שרשרת-כסף paidStatus'); f = 1; }
if (!src.includes('planLabelWire(e, planWord, wiredPayBal)')) { console.error('✗ מגן: שרשרת-כסף planLabel'); f = 1; }
// שרשרת-התמחיר
if (!src.includes('weightedQuoteWire(c, opts, lessonPriceForTier, lessonsInTerm)')) { console.error('✗ מגן: שרשרת-תמחיר weightedQuote'); f = 1; }
if (!src.includes('enrollmentQuoteWire(c, e, wiredWeightedQuote)')) { console.error('✗ מגן: שרשרת-תמחיר enrollmentQuote'); f = 1; }
// שרשרת-הכיתה
if (!src.includes('gradeIndexWire(g, GRADE_ORDER)')) { console.error('✗ מגן: שרשרת-כיתה gradeIndex'); f = 1; }
if (!src.includes('gradeFitsWire(c, childGrade, wiredGradeIndex)')) { console.error('✗ מגן: שרשרת-כיתה gradeFits'); f = 1; }
if (!src.includes('courseFitsWire(c, gender, age, grade, wiredGradeFits)')) { console.error('✗ מגן: שרשרת-כיתה courseFitsMember'); f = 1; }
// DAY_NAMES מוזרק לתוויות
if (!src.includes('groupOptionsWire(c, sessionsOf, groupLabelOf, DAY_NAMES)')) { console.error('✗ מגן: DAY_NAMES ל-groupOptions'); f = 1; }
if (!src.includes('scheduleClashWire(db, memberId, course, sessionsOf, DAY_NAMES)')) { console.error('✗ מגן: DAY_NAMES ל-scheduleClash'); f = 1; }
// חוק-2/3: אך-ורק ייבוא-אטומים (אין ייבוא-קופסה / ייבוא-יחסי לא-אטומי)
if (/from '\.\.\/boxes\//.test(src) || /from '\.\/[a-z-]+\.mjs'/.test(src)) { console.error('✗ מגן: ייבוא לא-אטומי'); f = 1; }

if (f) process.exit(1);
console.log('✓ קופסת-components-courses: 13 קבוצות-קצה + מגן-הכרעה (normName/שעון/3-שרשראות/DAY_NAMES) — ירוק');
