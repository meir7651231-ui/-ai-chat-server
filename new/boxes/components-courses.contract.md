# חוזה · קופסת-חיבורים "components-courses"

**תפקיד:** הקופסה של מודול-החוגים — מחווטת את חוטי `courses/lib.ts` (ימים, מפגשים,
תמחור, יתרות, התאמת-שיבוץ, גלגל-החוגים) למקום-אחד. כל מה שהיה מולחם בקובץ-המקור
דרך קריאות-שכן — כאן חיווט גלוי (חוק-1: שכן ⇒ שקע-מוזרק).

**מקור-אמת (עוגני-שורה — דיבר 11):** `/home/user/maor-system/src/components/courses/lib.ts`

## שקעי-IO (מוזרקים, לא ממומשים בקופסה)
- `now` — שעון-המכונה (Date), ברירת-מחדל `new Date()`. נכנס ל-`isoToday`/`ageOf`/
  `roomsNow`/`nextSessionDate` (lib.ts:20-22, 66-77, 120-145, 376-388).

## שקעים חוצי-מודול (אטומים, לא ייבוא-קופסה — חוק-3)
- `term-of`   (config.ts:119-126) ⇒ מוזרק ל-`courseDateError`.
- `iso-local` (date-util.ts:13-17) ⇒ מרכיב את `isoToday` (Date⇒YYYY-MM-DD מקומי).
- `norm-search` (validate.ts:51-58) ⇒ לב `normName` (השוואת-שמות חסינת-רווחים).

## הכרעות-הקופסה (חיות כאן, נחתמות במגן-ההכרעה)
- `normName = normSearch(s).replace(/\s/g, '')` — מקור: lib.ts:526-528 (`normNameLocal`).
- שרשרת-הכסף: `paidOf ⇒ payBal ⇒ enrollmentPaidStatus/planLabelOf` (lib.ts:304-326, 421-429).
- שרשרת-התמחור: `lessonPriceForTier + lessonsInTerm ⇒ weightedQuote ⇒ enrollmentQuote` (lib.ts:288-301).
- שרשרת-הכיתה: `GRADE_ORDER ⇒ gradeIndex ⇒ gradeFits ⇒ courseFitsMember` (lib.ts:453-491).
- `DAY_NAMES` מוזרק ל-`groupOptionsOf` (lib.ts:179) ול-`scheduleClashText` (lib.ts:510).
- `sessionsOf` שוקע ל-`roomsNow`/`nextSessionDate`/`scheduleClashText`/`groupOptionsOf`.

## חשיפה (חתך-API של courses/lib.ts)
פונקציות-מחווטות (השקעים הולחמו): `isoToday(now?)` · `ageOf(birth, now?)` ·
`defaultCourseDates(today?)` · `courseDateError(start, end, config?)` · `roomsNow(db, now?)` ·
`groupRemapOnRemoval(sessions, removeIdx)` · `groupOptionsOf(c)` · `termLabel(term, months?)` ·
`weightedQuote(c, opts)` · `enrollmentQuote(c, e)` · `payBal(e)` · `enrollmentPaidStatus(e)` ·
`planLabelOf(e)` · `nextSessionDate(c, now?)` · `gradeIndex(g)` · `gradeFits(c, grade)` ·
`courseFitsMember(c, gender, age, grade?)` · `scheduleClashText(db, memberId, course)` ·
`offerNewFamily(families, q)` · `resolveEnrollFamily(families, famSel, newFamName)`.
פסים-טהורים (כמות-שהם): `fmtDate` · `presentsInMonth` · `sessionsOf` · `groupsHintFromAudience` ·
`coursesOfTeacher` · `groupLabelOf` · `planWord` · `priceSuffix` · `modelMeta` · `lessonsInTerm` ·
`lessonPriceForTier` · `lessonTierOptions` · `paidOf` · `enrollCount` · `duplicateCourse` ·
`pendingMakeups` · `waitlistFor` · `sheetRoster` · `sheetSummary` · `enrollStatusMeta` ·
`chipStyle` · `punchConfirmStep` · `wheelIndexUnderPointer`.
קבועים: `DAY_NAMES` · `DAY_LETTERS` · `WEEKS_PER_MONTH` · `PRICING_TERMS` · `GRADE_ORDER` ·
`OTHER` · `OTHER_LABEL` · `ADD_TEACHER` · `CAT_OPTIONS` · `SEMESTER_OPTIONS` · `PAY_METHODS` ·
`TINTS` · `ENROLL_NEW_FAMILY` · `PUNCH_CONFIRM_MS`.

## דוגמאות-מחייבות (מספריות — מוכחות בבדיקה)
- `fmtDate('2026-08-24')` ⇒ `'24/08/2026'`; `fmtDate('')` ⇒ `'—'` (lib.ts:13-18).
- `defaultCourseDates('2026-08-24')` ⇒ `{ start: '2026-09-01', end: '2027-07-31' }` (אוגוסט m=7 ⇒
  מתגלגל לשנה"ל הבאה); `defaultCourseDates('2026-07-15')` ⇒ `{ start: '2025-09-01', end: '2026-07-31' }` (lib.ts:32-40).
- `ageOf('2000-06-15', new Date('2026-08-24T12:00:00'))` ⇒ `26`; `ageOf('')` ⇒ `null` (lib.ts:66-77).
- `courseDateError('2026-09-01', '2026-08-01')` ⇒ מחרוזת-שגיאה (end<start); תקין ⇒ `null` (lib.ts:57-63).
- `presentsInMonth(['2026-08-01', '2026-07-30'], '2026-08-24')` ⇒ `1` (lib.ts:47-50).
- `sessionsOf({ weekday: 2, time: '17:00' })` ⇒ `[{ day: 2, time: '17:00', label: '' }]` (lib.ts:84-86).
- `groupsHintFromAudience('4 קבוצות')` ⇒ `4`; `'1 קבוצות'` ⇒ `null` (מחוץ 2–12) (lib.ts:92-97).
- `payBal({ totalDue: 200, payments: [{ amount: 120 }] })` ⇒ `80` (lib.ts:309-311).
- `enrollmentPaidStatus({ totalDue: 200, payments: [{ amount: 200 }] })` ⇒ `'paid'` (lib.ts:321-326).
- `weightedQuote({ lessonPrice: 50 }, { freq: 1, unit: 'week', term: 'monthly', tier: '' })`
  ⇒ `{ lessons: 4.5, perLesson: 50, total: 217 }` (52/12 שבועות/חודש) (lib.ts:288-295).
- `gradeIndex('כיתה ג׳')` ⇒ `3`; `gradeFits({ gradeMin: 'ב', gradeMax: 'ד' }, 'ה')` ⇒ `false` (lib.ts:456-475).
- `wheelIndexUnderPointer(0, 4)` ⇒ `0`; `punchConfirmStep(false, null, 'x', 0)` ⇒ `{ fire: true, next: null }` (lib.ts:572-597).
- `resolveEnrollFamily([{ id: 'a', name: 'כהן' }], '__new', 'כהן')` ⇒ `{ fam: {id:'a',...}, create: false }` (דה-דופ) (lib.ts:540-553).

## מגן-הכרעה
`components-courses.test.mjs` קורא את מקור-הקופסה ומאשר verbatim: תבנית-`normName`,
הזרקת-`new Date()` כשעון, שלוש-השרשראות (כסף/תמחיר/כיתה), הזרקת-`DAY_NAMES`,
ואיסור-ייבוא-לא-אטומי (חוק-2/3).

## רתמת-זהב
`/home/user/maor-system/machtzev/parity/components-courses.parity.mjs` — טרנספילציה-חיה
של `courses/lib.ts` (עם normSearch/termOf/isoLocal האמיתיים) ≡ הקופסה, קורפוס-LCG seed=20260824,
בלי Date.now (תאריכים קבועים).
