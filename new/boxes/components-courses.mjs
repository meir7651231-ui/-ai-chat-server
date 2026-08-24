/** קופסת-חיבורים · מודול-החוגים — מחווטת את חוטי courses/lib.ts. חוזה: components-courses.contract.md
 *  זה המקום היחיד שבו החוטים נפגשים (חוקי-החשמלאי, LAW.md). מייבאת אך-ורק אטומים.
 *
 *  מקור-האמת: /home/user/maor-system/src/components/courses/lib.ts (גרף-הקריאות שבטיוטה).
 *
 *  שקעי-IO אמיתיים (מוזרקים, לא ממומשים כאן):
 *   · now — שעון-המכונה (Date). isoToday/ageOf/roomsNow/nextSessionDate מקבלים now
 *           מוזרק; ברירת-מחדל new Date() נאמנה למקור (lib.ts:20-22,66-77,120,376).
 *  שקעים-חוצי-מודול שהפכו לאטומים (חוק-3 — לא ייבוא-קופסה):
 *   · term-of   (מילון-המונחים, config.ts:119) — מוזרק ל-course-date-error.
 *   · iso-local (date-util.ts:13) — מרכיב את isoToday (Date⇒YYYY-MM-DD מקומי).
 *   · norm-search (validate.ts:51) — לב ה-normName (השוואת-שמות חסינת-רווחים). */
import { fmtDate } from '../atoms/fmt-date.mjs';
import { isoToday as isoTodayWire } from '../atoms/iso-today.mjs';
import { isoLocal } from '../atoms/iso-local.mjs';
import { defaultCourseDates as defaultCourseDatesWire } from '../atoms/default-course-dates.mjs';
import { presentsInMonth } from '../atoms/presents-in-month.mjs';
import { courseDateError as courseDateErrorWire } from '../atoms/course-date-error.mjs';
import { ageOf as ageOfWire } from '../atoms/age-of.mjs';
import { termOf } from '../atoms/term-of.mjs';
import { normSearch } from '../atoms/norm-search.mjs';
import { DAY_NAMES } from '../atoms/day-names.mjs';
import { DAY_LETTERS } from '../atoms/day-letters.mjs';
import { sessionsOf } from '../atoms/sessions-of.mjs';
import { groupsHintFromAudience } from '../atoms/groups-hint-from-audience.mjs';
import { coursesOfTeacher } from '../atoms/courses-of-teacher.mjs';
import { roomsNow as roomsNowWire } from '../atoms/rooms-now.mjs';
import { groupLabelOf } from '../atoms/group-label-of.mjs';
import { groupRemapOnRemoval as groupRemapWire } from '../atoms/group-remap-on-removal.mjs';
import { groupOptionsOf as groupOptionsWire } from '../atoms/group-options-of.mjs';
import { planWord } from '../atoms/plan-word.mjs';
import { priceSuffix } from '../atoms/price-suffix.mjs';
import { modelMeta } from '../atoms/model-meta.mjs';
import { WEEKS_PER_MONTH } from '../atoms/weeks-per-month.mjs';
import { PRICING_TERMS } from '../atoms/pricing-terms.mjs';
import { termLabel as termLabelWire } from '../atoms/term-label.mjs';
import { lessonsInTerm } from '../atoms/lessons-in-term.mjs';
import { lessonPriceForTier } from '../atoms/lesson-price-for-tier.mjs';
import { lessonTierOptions } from '../atoms/lesson-tier-options.mjs';
import { weightedQuote as weightedQuoteWire } from '../atoms/weighted-quote.mjs';
import { enrollmentQuote as enrollmentQuoteWire } from '../atoms/enrollment-quote.mjs';
import { paidOf } from '../atoms/paid-of.mjs';
import { payBal as payBalWire } from '../atoms/pay-bal.mjs';
import { enrollmentPaidStatus as enrollmentPaidStatusWire } from '../atoms/enrollment-paid-status.mjs';
import { enrollCount } from '../atoms/enroll-count.mjs';
import { duplicateCourse } from '../atoms/duplicate-course.mjs';
import { pendingMakeups } from '../atoms/pending-makeups.mjs';
import { waitlistFor } from '../atoms/waitlist-for.mjs';
import { nextSessionDate as nextSessionDateWire } from '../atoms/next-session-date.mjs';
import { sheetRoster } from '../atoms/sheet-roster.mjs';
import { sheetSummary } from '../atoms/sheet-summary.mjs';
import { OTHER } from '../atoms/other.mjs';
import { OTHER_LABEL } from '../atoms/other-label.mjs';
import { ADD_TEACHER } from '../atoms/add-teacher.mjs';
import { CAT_OPTIONS } from '../atoms/cat-options.mjs';
import { SEMESTER_OPTIONS } from '../atoms/semester-options.mjs';
import { PAY_METHODS } from '../atoms/pay-methods.mjs';
import { TINTS } from '../atoms/tints.mjs';
import { enrollStatusMeta } from '../atoms/enroll-status-meta.mjs';
import { planLabelOf as planLabelWire } from '../atoms/plan-label-of.mjs';
import { chipStyle } from '../atoms/chip-style.mjs';
import { GRADE_ORDER } from '../atoms/grade-order.mjs';
import { gradeIndex as gradeIndexWire } from '../atoms/grade-index.mjs';
import { gradeFits as gradeFitsWire } from '../atoms/grade-fits.mjs';
import { courseFitsMember as courseFitsWire } from '../atoms/course-fits-member.mjs';
import { scheduleClashText as scheduleClashWire } from '../atoms/schedule-clash-text.mjs';
import { ENROLL_NEW_FAMILY } from '../atoms/enroll-new-family.mjs';
import { offerNewFamily as offerNewFamilyWire } from '../atoms/offer-new-family.mjs';
import { resolveEnrollFamily as resolveEnrollFamilyWire } from '../atoms/resolve-enroll-family.mjs';
import { PUNCH_CONFIRM_MS } from '../atoms/punch-confirm-ms.mjs';
import { punchConfirmStep } from '../atoms/punch-confirm-step.mjs';
import { wheelIndexUnderPointer } from '../atoms/wheel-index-under-pointer.mjs';

// ── הכרעת-הקופסה: normName (חיה כאן, לא באטום) ──
// מקור: lib.ts:526-528 — normNameLocal = normSearch(s) + הסרת כל הרווחים הפנימיים
// ("בן דוד" ≡ "בןדוד"). זו הרכבת-שקע (norm-search ⇒ replace), לא אטום.
const normName = (s) => normSearch(s).replace(/\s/g, '');

// ── חיווט-פנימי: הזרקת-השקעים היא *המשמעות* וחיה כאן (חוק-1: שכן ⇒ שקע-מוזרק) ──
// שרשרת-הכסף: paidOf ⇒ payBal ⇒ enrollmentPaidStatus/planLabelOf. הסדר הוא המשמעות.
const wiredPayBal = (e) => payBalWire(e, paidOf);
const wiredEnrollmentPaidStatus = (e) => enrollmentPaidStatusWire(e, wiredPayBal, paidOf);
const wiredPlanLabelOf = (e) => planLabelWire(e, planWord, wiredPayBal);
// שרשרת-התמחור: lessonPriceForTier + lessonsInTerm ⇒ weightedQuote ⇒ enrollmentQuote.
const wiredWeightedQuote = (c, opts) => weightedQuoteWire(c, opts, lessonPriceForTier, lessonsInTerm);
const wiredEnrollmentQuote = (c, e) => enrollmentQuoteWire(c, e, wiredWeightedQuote);
// שרשרת-הכיתה: GRADE_ORDER ⇒ gradeIndex ⇒ gradeFits ⇒ courseFitsMember.
const wiredGradeIndex = (g) => gradeIndexWire(g, GRADE_ORDER);
const wiredGradeFits = (c, childGrade) => gradeFitsWire(c, childGrade, wiredGradeIndex);
const wiredCourseFits = (c, gender, age, grade) => courseFitsWire(c, gender, age, grade, wiredGradeFits);
// מפגשים-בפועל (sessionsOf) שוקעים לכל חוט שסורק לו"ז; DAY_NAMES מוזרק לתוויות.
const wiredRoomsNow = (db, now = new Date()) => roomsNowWire(db, now, sessionsOf);
const wiredGroupRemap = (sessions, removeIdx) => groupRemapWire(sessions, removeIdx, groupLabelOf);
const wiredGroupOptions = (c) => groupOptionsWire(c, sessionsOf, groupLabelOf, DAY_NAMES);
const wiredNextSession = (c, now = new Date()) => nextSessionDateWire(c, now, sessionsOf);
const wiredScheduleClash = (db, memberId, course) => scheduleClashWire(db, memberId, course, sessionsOf, DAY_NAMES);
// term-of ⇒ course-date-error (מונח-החוג המותאם); PRICING_TERMS ⇒ term-label.
const wiredCourseDateError = (start, end, config) => courseDateErrorWire(start, end, config, termOf);
const wiredTermLabel = (term, months) => termLabelWire(term, months, PRICING_TERMS);
// שעון-מקומי: isoToday מרכיב iso-local על השעון המוזרק (ברירת-מחדל new Date()).
const wiredIsoToday = (now = new Date()) => isoTodayWire(isoLocal, now);
// normName ⇒ offer/resolve-enroll-family (דה-דופ שמות חסין-רווחים).
const wiredOfferNewFamily = (families, q) => offerNewFamilyWire(families, q, normName);
const wiredResolveEnrollFamily = (families, famSel, newFamName) => resolveEnrollFamilyWire(families, famSel, newFamName, normName);

// ── החשיפה: אותו חתך-API של courses/lib.ts, עכשיו כחיווט גלוי ──
export const isoToday = wiredIsoToday;
export const ageOf = (birth, now = new Date()) => ageOfWire(birth, now);
// defaultCourseDates: ברירת-המחדל היא "היום" (lib.ts:32 today = isoTodayLocal()).
export const defaultCourseDates = (today = wiredIsoToday()) => defaultCourseDatesWire(today);
export const courseDateError = wiredCourseDateError;
export const roomsNow = wiredRoomsNow;
export const groupRemapOnRemoval = wiredGroupRemap;
export const groupOptionsOf = wiredGroupOptions;
export const termLabel = wiredTermLabel;
export const weightedQuote = wiredWeightedQuote;
export const enrollmentQuote = wiredEnrollmentQuote;
export const payBal = wiredPayBal;
export const enrollmentPaidStatus = wiredEnrollmentPaidStatus;
export const planLabelOf = wiredPlanLabelOf;
export const nextSessionDate = wiredNextSession;
export const gradeIndex = wiredGradeIndex;
export const gradeFits = wiredGradeFits;
export const courseFitsMember = wiredCourseFits;
export const scheduleClashText = wiredScheduleClash;
export const offerNewFamily = wiredOfferNewFamily;
export const resolveEnrollFamily = wiredResolveEnrollFamily;

// חוטים בלי-שקעים — נבחרים כמות-שהם (החיווט = בחירת-האטום בלבד):
export {
  fmtDate, presentsInMonth, sessionsOf, groupsHintFromAudience, coursesOfTeacher,
  groupLabelOf, planWord, priceSuffix, modelMeta, lessonsInTerm, lessonPriceForTier,
  lessonTierOptions, paidOf, enrollCount, duplicateCourse, pendingMakeups, waitlistFor,
  sheetRoster, sheetSummary, enrollStatusMeta, chipStyle, punchConfirmStep, wheelIndexUnderPointer,
};
// קבועי-המילון (סדר/תוויות — נבחרים כמות-שהם):
export {
  DAY_NAMES, DAY_LETTERS, WEEKS_PER_MONTH, PRICING_TERMS, GRADE_ORDER,
  OTHER, OTHER_LABEL, ADD_TEACHER, CAT_OPTIONS, SEMESTER_OPTIONS, PAY_METHODS, TINTS,
  ENROLL_NEW_FAMILY, PUNCH_CONFIRM_MS,
};
