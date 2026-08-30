/** קופסת-חיבורים · רישום-לשנה-הבאה (courses.reenroll) — מחווטת את חוטי-הרישום-מחדש.
 *  חוזה: reenroll.contract.md · מקור-אמת: maor/src/components/courses/reenroll-lib.ts
 *  זה המקום היחיד שבו חוטי-הרישום-מחדש נפגשים (חוקי-החשמלאי, LAW.md). מייבאת
 *  אך-ורק אטומים; שקעי-השכן (atNoon/toIso/findMember) = הכרעות-הקופסה, חיים כאן. */
import { academicYearLabel } from '../atoms/academic-year-label.mjs';
import { nextYearDates } from '../atoms/next-year-dates.mjs';
import { renewOf } from '../atoms/renew-of.mjs';
import { isRenewed } from '../atoms/is-renewed.mjs';
import { enrollSummary as __pure_enrollSummary } from '../atoms/enroll-summary.mjs';
import { ENROLL_SUMMARY_T as __d_enrollSummary_ENROLL_SUMMARY_T } from '../atoms/enroll-summary-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const enrollSummary = (...a) => __pure_enrollSummary(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_enrollSummary_ENROLL_SUMMARY_T);
import { buildReenrollRows as __pure_buildReenrollRows } from '../atoms/build-reenroll-rows.mjs';
import { BUILD_REENROLL_ROWS_T as __d_buildReenrollRows_BUILD_REENROLL_ROWS_T } from '../atoms/build-reenroll-rows-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const buildReenrollRows = (...a) => __pure_buildReenrollRows(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_buildReenrollRows_BUILD_REENROLL_ROWS_T);
import { reenrollCounts as __pure_reenrollCounts } from '../atoms/reenroll-counts.mjs';
import { REENROLL_COUNTS_T as __d_reenrollCounts_REENROLL_COUNTS_T } from '../atoms/reenroll-counts-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const reenrollCounts = (...a) => __pure_reenrollCounts(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_reenrollCounts_REENROLL_COUNTS_T);
import { renewTargets as __pure_renewTargets } from '../atoms/renew-targets.mjs';
import { RENEW_TARGETS_T as __d_renewTargets_RENEW_TARGETS_T } from '../atoms/renew-targets-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const renewTargets = (...a) => __pure_renewTargets(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_renewTargets_RENEW_TARGETS_T);
import { freshNextYearEnrollment as __pure_freshNextYearEnrollment } from '../atoms/fresh-next-year-enrollment.mjs';
import { ELIGIBLE_ASSIGNMENTS_FOR_DAY_T as __d_freshNextYearEnrollment_FRESH_NEXT_YEAR_ENROLLMENT_T } from '../atoms/eligible-assignments-for-day-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const freshNextYearEnrollment = (...a) => __pure_freshNextYearEnrollment(...a, ...Array(Math.max(0, 5 - a.length)).fill(undefined), __d_freshNextYearEnrollment_FRESH_NEXT_YEAR_ENROLLMENT_T);
import { nextYearCourseDraft } from '../atoms/next-year-course-draft.mjs';
import { studentHistory } from '../atoms/student-history.mjs';
import { studentHistoryText } from '../atoms/student-history-text.mjs';
import { reenrollCsvRows as __pure_reenrollCsvRows } from '../atoms/reenroll-csv-rows.mjs';
import { REENROLL_CSV_ROWS_T as __d_reenrollCsvRows_REENROLL_CSV_ROWS_T } from '../atoms/reenroll-csv-rows-strings.mjs';
import { head } from '../atoms/reenroll-csv-rows-data.mjs';
// עטיפת-כריכה (מנוע-הטיהור v2): הדאטה נכרכת כאן — ה-API החיצוני זהה
const reenrollCsvRows = (...a) => __pure_reenrollCsvRows(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), head, __d_reenrollCsvRows_REENROLL_CSV_ROWS_T);
import { reenrollListText as __pure_reenrollListText } from '../atoms/reenroll-list-text.mjs';
import { REENROLL_LIST_TEXT_T as __d_reenrollListText_REENROLL_LIST_TEXT_T } from '../atoms/reenroll-list-text-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const reenrollListText = (...a) => __pure_reenrollListText(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_reenrollListText_REENROLL_LIST_TEXT_T);
import { payBal } from '../atoms/pay-bal.mjs';
import { paidOf } from '../atoms/paid-of.mjs';

// ── הכרעות-הקופסה: מוסכמת-התאריכים (חיה כאן, לא בחוטים) ──
// מקור: reenroll-lib.ts:15-23 — פרסור לצהריים-מקומי (בלי היסט-UTC) והחזרה ל-ISO.
// אלו החלטות-חיווט (הפורמט/המוסכמה), לא אטומים — כמו מילון-התוויות בקופסת-החלוקה.
const atNoon = (iso) => new Date(`${iso}T12:00:00`);
const toIso = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
};

// ── הכרעת-הקופסה: איתור בן/בת-משפחה (חיה כאן) ──
// מקור: reenroll-lib.ts:110-116 — סריקת families.members, המופע-הראשון זוכה,
// שם-משפחה = f.name || ''. שקע-השכן של buildReenrollRows (חוק-1 — לא נכנס לאטום).
const findMember = (db, memberId) => {
  for (const f of db.families) {
    const m = f.members.find((x) => x.id === memberId);
    if (m) return { member: m, family: f.name || '' };
  }
  return { member: null, family: '' };
};

// ── חיווט-פנימי: סדר-הזרקת-השקעים הוא *המשמעות* וחי כאן ──
// paidOf ⇒ payBal ⇒ enrollSummary (קסקדת-הכספים); atNoon/toIso ⇒ תאריכים.
const wiredPayBal = (e) => payBal(e, paidOf);
const wiredEnrollSummary = (e) => enrollSummary(e, wiredPayBal, paidOf);
const wiredAcademicYearLabel = (startIso) => academicYearLabel(startIso, atNoon);
const wiredNextYearDates = (start, end) => nextYearDates(start, end, atNoon, toIso);

/** שורות מסך-הרישום — ארבעת השקעים (isRenewed·renewOf·enrollSummary·findMember) מחווטים פנימית. */
const wiredBuildReenrollRows = (db, filter) =>
  buildReenrollRows(db, filter, { isRenewed, renewOf, enrollSummary: wiredEnrollSummary, findMember });

/** טיוטת-חוג לשנה הבאה — nextYearDates+academicYearLabel (המחווטים) מוזרקים. */
const wiredNextYearCourseDraft = (src, newId) =>
  nextYearCourseDraft(src, newId, wiredNextYearDates, wiredAcademicYearLabel);

/** היסטוריית-תלמיד/ה — academicYearLabel+enrollSummary (המחווטים) מוזרקים. */
const wiredStudentHistory = (db, memberId) =>
  studentHistory(db, memberId, wiredAcademicYearLabel, wiredEnrollSummary);

// ── החשיפה (מראה את ה-API הציבורי של reenroll-lib.ts) ──
export {
  // פסים-טהורים (אפס שקעים) — מועברים כלשונם.
  renewOf, isRenewed, reenrollCounts, renewTargets, freshNextYearEnrollment,
  studentHistoryText, reenrollCsvRows, reenrollListText,
  // מחווטים — השקעים (atNoon/toIso/payBal/paidOf/findMember) הולחמו פנימית.
  wiredAcademicYearLabel as academicYearLabel,
  wiredNextYearDates as nextYearDates,
  wiredEnrollSummary as enrollSummary,
  wiredBuildReenrollRows as buildReenrollRows,
  wiredNextYearCourseDraft as nextYearCourseDraft,
  wiredStudentHistory as studentHistory,
};
