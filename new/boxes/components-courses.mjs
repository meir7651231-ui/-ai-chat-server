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
import { defaultCourseDates as __pure_defaultCourseDates } from '../atoms/default-course-dates.mjs';
import { DEFAULT_COURSE_DATES_T as __d_default_course_dates_T } from '../atoms/default-course-dates-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const defaultCourseDatesWire = (...a) => __pure_defaultCourseDates(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_default_course_dates_T);
import { presentsInMonth as __pure_presentsInMonth } from '../atoms/presents-in-month.mjs';
import { INTEGRATION_SETTING_T as __d_presentsInMonth_PRESENTS_IN_MONTH_T } from '../atoms/integration-setting-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const presentsInMonth = (...a) => __pure_presentsInMonth(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_presentsInMonth_PRESENTS_IN_MONTH_T);
import { courseDateError as __pure_courseDateError } from '../atoms/course-date-error.mjs';
import { COURSE_DATE_ERROR_T as __d_courseDateError_COURSE_DATE_ERROR_T } from '../atoms/course-date-error-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const courseDateErrorWire = (...a) => __pure_courseDateError(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_courseDateError_COURSE_DATE_ERROR_T);
import { ageOf as ageOfWire } from '../atoms/age-of.mjs';
import { termOf as __pure_termOf } from '../atoms/term-of.mjs';
import { INTEGRATION_SETTING_T as __d_termOf_TERM_OF_T } from '../atoms/integration-setting-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const termOf = (...a) => __pure_termOf(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_termOf_TERM_OF_T);
import { normSearch as __pure_normSearch } from '../atoms/norm-search.mjs';
import { NORM_SEARCH_T as __d_normSearch_NORM_SEARCH_T } from '../atoms/norm-search-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const normSearch = (...a) => __pure_normSearch(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_normSearch_NORM_SEARCH_T);
import { DAY_NAMES } from '../atoms/day-names.mjs';
import { DAY_LETTERS } from '../atoms/day-letters.mjs';
import { sessionsOf } from '../atoms/sessions-of.mjs';
import { groupsHintFromAudience as __pure_groupsHintFromAudience } from '../atoms/groups-hint-from-audience.mjs';
import { GROUPS_HINT_FROM_AUDIENCE_T as __d_groups_hint_from_audience_T } from '../atoms/groups-hint-from-audience-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const groupsHintFromAudience = (...a) => __pure_groupsHintFromAudience(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_groups_hint_from_audience_T);
import { coursesOfTeacher } from '../atoms/courses-of-teacher.mjs';
import { roomsNow as __pure_roomsNow } from '../atoms/rooms-now.mjs';
import { ROOMS_NOW_T as __d_rooms_now_T } from '../atoms/rooms-now-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const roomsNowWire = (...a) => __pure_roomsNow(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_rooms_now_T);
import { groupLabelOf as __pure_groupLabelOf } from '../atoms/group-label-of.mjs';
import { GROUP_LABEL_OF_T as __d_groupLabelOf_GROUP_LABEL_OF_T } from '../atoms/group-label-of-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const groupLabelOf = (...a) => __pure_groupLabelOf(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_groupLabelOf_GROUP_LABEL_OF_T);
import { groupRemapOnRemoval as groupRemapWire } from '../atoms/group-remap-on-removal.mjs';
import { groupOptionsOf as __pure_groupOptionsOf } from '../atoms/group-options-of.mjs';
import { GROUP_OPTIONS_OF_T as __d_groupOptionsOf_GROUP_OPTIONS_OF_T } from '../atoms/group-options-of-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const groupOptionsWire = (...a) => __pure_groupOptionsOf(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_groupOptionsOf_GROUP_OPTIONS_OF_T);
import { planWord as __pure_planWord } from '../atoms/plan-word.mjs';
import { PLAN_WORD_T as __d_planWord_PLAN_WORD_T } from '../atoms/plan-word-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const planWord = (...a) => __pure_planWord(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_planWord_PLAN_WORD_T);
import { priceSuffix as __pure_priceSuffix } from '../atoms/price-suffix.mjs';
import { PRICE_SUFFIX_T as __d_priceSuffix_PRICE_SUFFIX_T } from '../atoms/price-suffix-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const priceSuffix = (...a) => __pure_priceSuffix(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_priceSuffix_PRICE_SUFFIX_T);
import { modelMeta as __pure_modelMeta } from '../atoms/model-meta.mjs';
import { MODEL_META_T as __d_modelMeta_MODEL_META_T } from '../atoms/model-meta-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const modelMeta = (...a) => __pure_modelMeta(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_modelMeta_MODEL_META_T);
import { WEEKS_PER_MONTH } from '../atoms/weeks-per-month.mjs';
import { PRICING_TERMS } from '../atoms/pricing-terms.mjs';
import { termLabel as __pure_termLabel } from '../atoms/term-label.mjs';
import { TERM_LABEL_T as __d_termLabel_TERM_LABEL_T } from '../atoms/term-label-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const termLabelWire = (...a) => __pure_termLabel(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_termLabel_TERM_LABEL_T);
import { lessonsInTerm as __pure_lessonsInTerm } from '../atoms/lessons-in-term.mjs';
import { LESSONS_IN_TERM_T as __d_lessonsInTerm_LESSONS_IN_TERM_T } from '../atoms/lessons-in-term-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const lessonsInTerm = (...a) => __pure_lessonsInTerm(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_lessonsInTerm_LESSONS_IN_TERM_T);
import { lessonPriceForTier } from '../atoms/lesson-price-for-tier.mjs';
import { lessonTierOptions as __pure_lessonTierOptions } from '../atoms/lesson-tier-options.mjs';
import { LESSON_TIER_OPTIONS_T as __d_lessonTierOptions_LESSON_TIER_OPTIONS_T } from '../atoms/lesson-tier-options-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const lessonTierOptions = (...a) => __pure_lessonTierOptions(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_lessonTierOptions_LESSON_TIER_OPTIONS_T);
import { weightedQuote as weightedQuoteWire } from '../atoms/weighted-quote.mjs';
import { enrollmentQuote as enrollmentQuoteWire } from '../atoms/enrollment-quote.mjs';
import { paidOf } from '../atoms/paid-of.mjs';
import { payBal as payBalWire } from '../atoms/pay-bal.mjs';
import { enrollmentPaidStatus as __pure_enrollmentPaidStatus } from '../atoms/enrollment-paid-status.mjs';
import { ENROLLMENT_PAID_STATUS_T as __d_enrollmentPaidStatus_ENROLLMENT_PAID_STATUS_T } from '../atoms/enrollment-paid-status-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const enrollmentPaidStatusWire = (...a) => __pure_enrollmentPaidStatus(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_enrollmentPaidStatus_ENROLLMENT_PAID_STATUS_T);
import { enrollCount as __pure_enrollCount } from '../atoms/enroll-count.mjs';
import { ENROLL_COUNT_T as __d_enrollCount_ENROLL_COUNT_T } from '../atoms/enroll-count-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const enrollCount = (...a) => __pure_enrollCount(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_enrollCount_ENROLL_COUNT_T);
import { duplicateCourse as __pure_duplicateCourse } from '../atoms/duplicate-course.mjs';
import { DUPLICATE_COURSE_T as __d_duplicateCourse_DUPLICATE_COURSE_T } from '../atoms/duplicate-course-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const duplicateCourse = (...a) => __pure_duplicateCourse(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_duplicateCourse_DUPLICATE_COURSE_T);
import { pendingMakeups as __pure_pendingMakeups } from '../atoms/pending-makeups.mjs';
import { ENROLL_COUNT_T as __d_pendingMakeups_PENDING_MAKEUPS_T } from '../atoms/enroll-count-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const pendingMakeups = (...a) => __pure_pendingMakeups(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_pendingMakeups_PENDING_MAKEUPS_T);
import { waitlistFor as __pure_waitlistFor } from '../atoms/waitlist-for.mjs';
import { WAITLIST_FOR_T as __d_waitlistFor_WAITLIST_FOR_T } from '../atoms/waitlist-for-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const waitlistFor = (...a) => __pure_waitlistFor(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_waitlistFor_WAITLIST_FOR_T);
import { nextSessionDate as nextSessionDateWire } from '../atoms/next-session-date.mjs';
import { sheetRoster as __pure_sheetRoster } from '../atoms/sheet-roster.mjs';
import { ENROLL_COUNT_T as __d_sheetRoster_SHEET_ROSTER_T } from '../atoms/enroll-count-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const sheetRoster = (...a) => __pure_sheetRoster(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_sheetRoster_SHEET_ROSTER_T);
import { sheetSummary } from '../atoms/sheet-summary.mjs';
import { OTHER } from '../atoms/other.mjs';
import { OTHER_LABEL } from '../atoms/other-label.mjs';
import { ADD_TEACHER } from '../atoms/add-teacher.mjs';
import { CAT_OPTIONS } from '../atoms/cat-options.mjs';
import { SEMESTER_OPTIONS } from '../atoms/semester-options.mjs';
import { PAY_METHODS } from '../atoms/pay-methods.mjs';
import { TINTS } from '../atoms/tints.mjs';
import { enrollStatusMeta as __pure_enrollStatusMeta } from '../atoms/enroll-status-meta.mjs';
import { ENROLL_STATUS_META_T as __d_enrollStatusMeta_ENROLL_STATUS_META_T } from '../atoms/enroll-status-meta-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const enrollStatusMeta = (...a) => __pure_enrollStatusMeta(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_enrollStatusMeta_ENROLL_STATUS_META_T);
import { planLabelOf as __pure_planLabelOf } from '../atoms/plan-label-of.mjs';
import { PLAN_LABEL_OF_T as __d_planLabelOf_PLAN_LABEL_OF_T } from '../atoms/plan-label-of-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const planLabelWire = (...a) => __pure_planLabelOf(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_planLabelOf_PLAN_LABEL_OF_T);
import { chipStyle as __pure_chipStyle } from '../atoms/chip-style.mjs';
import { CHIP_STYLE_T as __d_chipStyle_CHIP_STYLE_T } from '../atoms/chip-style-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const chipStyle = (...a) => __pure_chipStyle(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_chipStyle_CHIP_STYLE_T);
import { GRADE_ORDER } from '../atoms/grade-order.mjs';
import { gradeIndex as gradeIndexWire } from '../atoms/grade-index.mjs';
import { gradeFits as gradeFitsWire } from '../atoms/grade-fits.mjs';
import { courseFitsMember as __pure_courseFitsMember } from '../atoms/course-fits-member.mjs';
import { COURSE_FITS_MEMBER_T as __d_courseFitsMember_COURSE_FITS_MEMBER_T } from '../atoms/course-fits-member-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const courseFitsWire = (...a) => __pure_courseFitsMember(...a, ...Array(Math.max(0, 5 - a.length)).fill(undefined), __d_courseFitsMember_COURSE_FITS_MEMBER_T);
import { scheduleClashText as __pure_scheduleClashText } from '../atoms/schedule-clash-text.mjs';
import { SCHEDULE_CLASH_TEXT_T as __d_schedule_clash_text_T } from '../atoms/schedule-clash-text-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const scheduleClashWire = (...a) => __pure_scheduleClashText(...a, ...Array(Math.max(0, 5 - a.length)).fill(undefined), __d_schedule_clash_text_T);
import { ENROLL_NEW_FAMILY } from '../atoms/enroll-new-family.mjs';
import { offerNewFamily as offerNewFamilyWire } from '../atoms/offer-new-family.mjs';
import { resolveEnrollFamily as __pure_resolveEnrollFamily } from '../atoms/resolve-enroll-family.mjs';
import { RESOLVE_ENROLL_FAMILY_T as __d_resolve_enroll_family_T } from '../atoms/resolve-enroll-family-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const resolveEnrollFamilyWire = (...a) => __pure_resolveEnrollFamily(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_resolve_enroll_family_T);
import { PUNCH_CONFIRM_MS } from '../atoms/punch-confirm-ms.mjs';
import { punchConfirmStep as __pure_punchConfirmStep } from '../atoms/punch-confirm-step.mjs';
import { PUNCH_CONFIRM_STEP_T as __d_punch_confirm_step_T } from '../atoms/punch-confirm-step-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const punchConfirmStep = (...a) => __pure_punchConfirmStep(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_punch_confirm_step_T);
import { wheelIndexUnderPointer as __pure_wheelIndexUnderPointer } from '../atoms/wheel-index-under-pointer.mjs';
import { WHEEL_INDEX_UNDER_POINTER_T as __d_wheel_index_under_pointer_T } from '../atoms/wheel-index-under-pointer-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const wheelIndexUnderPointer = (...a) => __pure_wheelIndexUnderPointer(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_wheel_index_under_pointer_T);

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
