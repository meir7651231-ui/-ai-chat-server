/** קופסת-חיבורים · יומן-החדרים (diary). חוזה: diary.contract.md
 *  המקום היחיד שבו חוטי-היומן נפגשים (חוקי-החשמלאי, LAW.md). מייבאת אך-ורק
 *  אטומים; ההכרעות (מילון-תוויות, ברירות-מחדל, העוזר-הפרטי courseOnDate) חיות כאן.
 *  מקור-אמת (L4): maor-system/src/components/diary/lib.ts. */
import { fmtDate as __pure_fmtDate } from '../atoms/fmt-date.mjs';
import { FMT_DATE_T as __d_fmt_date_T } from '../atoms/fmt-date-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const fmtDate = (...a) => __pure_fmtDate(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_fmt_date_T);
import { isoLocal } from '../atoms/iso-local.mjs';
import { isoToday as isoTodayAtom } from '../atoms/iso-today.mjs';
import { DAY_NAMES } from '../atoms/week-day-names.mjs';
import { pad2 } from '../atoms/pad2.mjs';
import { timeToMin as __pure_timeToMin } from '../atoms/time-to-min.mjs';
import { TIME_TO_MIN_T as __d_time_to_min_T } from '../atoms/time-to-min-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const timeToMin = (...a) => __pure_timeToMin(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_time_to_min_T);
import { minToHM as __pure_minToHM } from '../atoms/min-to-hm.mjs';
import { MIN_TO_HM_T as __d_min_to_hm_T } from '../atoms/min-to-hm-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const minToHMAtom = (...a) => __pure_minToHM(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_min_to_hm_T);
import { groupLabelOf as __pure_groupLabelOf } from '../atoms/group-label-of.mjs';
import { GROUP_LABEL_OF_T as __d_groupLabelOf_GROUP_LABEL_OF_T } from '../atoms/group-label-of-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const groupLabelOf = (...a) => __pure_groupLabelOf(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_groupLabelOf_GROUP_LABEL_OF_T);
import { ABSENCE_REASON_CHIPS } from '../atoms/absence-reason-chips.mjs';
import { makeupEligibility as __pure_makeupEligibility } from '../atoms/makeup-eligibility.mjs';
import { MAKEUP_ELIGIBILITY_T as __d_makeupEligibility_MAKEUP_ELIGIBILITY_T } from '../atoms/makeup-eligibility-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const makeupEligibility = (...a) => __pure_makeupEligibility(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_makeupEligibility_MAKEUP_ELIGIBILITY_T);
import { blockReason as __pure_blockReason } from '../atoms/block-reason.mjs';
import { BLOCK_REASON_T as __d_blockReason_BLOCK_REASON_T } from '../atoms/block-reason-strings.mjs';
import { FULL_HOLIDAYS } from '../atoms/block-reason-data.mjs';
// עטיפת-כריכה (מנוע-הטיהור v2): הדאטה נכרכת כאן — ה-API החיצוני זהה
const blockReasonAtom = (...a) => __pure_blockReason(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), FULL_HOLIDAYS, __d_blockReason_BLOCK_REASON_T);
import { buildSlots as __pure_buildSlots } from '../atoms/build-slots.mjs';
import { BUILD_SLOTS_T as __d_buildSlots_BUILD_SLOTS_T } from '../atoms/build-slots-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const buildSlotsAtom = (...a) => __pure_buildSlots(...a, ...Array(Math.max(0, 7 - a.length)).fill(undefined), __d_buildSlots_BUILD_SLOTS_T);
import { enrollmentsForSession as enrollmentsForSessionAtom } from '../atoms/enrollments-for-session.mjs';
import { weeklyRoomSessions as weeklyRoomSessionsAtom } from '../atoms/weekly-room-sessions.mjs';
import { inactiveRoomCourses as __pure_inactiveRoomCourses } from '../atoms/inactive-room-courses.mjs';
import { INACTIVE_ROOM_COURSES_T as __d_inactiveRoomCourses_INACTIVE_ROOM_COURSES_T } from '../atoms/inactive-room-courses-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const inactiveRoomCoursesAtom = (...a) => __pure_inactiveRoomCourses(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_inactiveRoomCourses_INACTIVE_ROOM_COURSES_T);
import { chipStyle as __pure_chipStyle } from '../atoms/chip-style.mjs';
import { CHIP_STYLE_T as __d_chipStyle_CHIP_STYLE_T } from '../atoms/chip-style-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const chipStyle = (...a) => __pure_chipStyle(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_chipStyle_CHIP_STYLE_T);
import { roomInfoLabel as __pure_roomInfoLabel } from '../atoms/room-info-label.mjs';
import { ROOM_INFO_LABEL_T as __d_roomInfoLabel_ROOM_INFO_LABEL_T } from '../atoms/room-info-label-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const roomInfoLabel = (...a) => __pure_roomInfoLabel(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_roomInfoLabel_ROOM_INFO_LABEL_T);
// שכני-החיווט (מוזרקים לאטומים כשקע — חוק-1):
import { hebParts as __pure_hebParts } from '../atoms/heb-parts.mjs';
import { HEB_PARTS_T as __d_hebParts_HEB_PARTS_T } from '../atoms/heb-parts-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const hebParts = (...a) => __pure_hebParts(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_hebParts_HEB_PARTS_T);
import { HOLIDAYS } from '../atoms/holidays.mjs';
import { sessionsOf } from '../atoms/sessions-of.mjs';
import { termOf as __pure_termOf } from '../atoms/term-of.mjs';
import { INTEGRATION_SETTING_T as __d_termOf_TERM_OF_T } from '../atoms/integration-setting-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const termOf = (...a) => __pure_termOf(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_termOf_TERM_OF_T);
import { planWord as __pure_planWord } from '../atoms/plan-word.mjs';
import { PLAN_WORD_T as __d_planWord_PLAN_WORD_T } from '../atoms/plan-word-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const planWord = (...a) => __pure_planWord(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_planWord_PLAN_WORD_T);

// ── חוטים טהורים — חשיפה ישירה (אפס שקע) ──
export { fmtDate, DAY_NAMES, pad2, timeToMin, groupLabelOf, ABSENCE_REASON_CHIPS,
  makeupEligibility, chipStyle, roomInfoLabel };

// ── חיווט-פנימי: שכן-שוקע (חוק-1) ──
export const localIso = isoLocal;                       // diary localIso(d) ≡ isoLocal(d)
export const isoToday = (now) => isoTodayAtom(isoLocal, now);
export const minToHM = (min) => minToHMAtom(min, pad2);
export const blockReason = (d, blockingOn = true) => blockReasonAtom(d, blockingOn, hebParts, HOLIDAYS);
export const weeklyRoomSessions = (db, roomId, iso) => weeklyRoomSessionsAtom(db, roomId, iso, sessionsOf);
export const inactiveRoomCourses = (db, iso, config) => inactiveRoomCoursesAtom(db, iso, config, termOf);
export const enrollmentsForSession = (db, c, sessionIndex) =>
  enrollmentsForSessionAtom(db, c, sessionIndex, sessionsOf, groupLabelOf);

// ── הכרעת-קופסה: העוזר-הפרטי courseOnDate (מקור: lib.ts:130-132) ──
// טווח-פעילות חוג בתאריך; חי כאן כי הוא חיווט-פנימי של buildSlots, לא אטום-חשוף.
const courseOnDate = (c, iso) => (!c.start || iso >= c.start) && (!c.end || iso <= c.end);
export const buildSlots = (db, room, iso, blocked, config, cleaningOn = true) =>
  buildSlotsAtom(db, room, iso, blocked, config,
    { timeToMin, minToHM, sessionsOf, courseOnDate, termOf }, cleaningOn);

// ── הכרעת-קופסה: וריאנט-היומן של planLabelOf (מקור: lib.ts:261-266) ──
// שונה מוריאנט-הקורסים (atom plan-label-of): יתרת-כרטיסייה purchased-used, בלי status/חוב.
export const planLabelOf = (e) =>
  e.plan === 'punch'
    ? `כרטיסייה · יתרה ${Math.max(0, e.purchased - e.used)}/${e.purchased}`
    : planWord(e.plan);

// ── הכרעת-קופסה: וריאנט-היומן של enrollStatusMeta (מקור: lib.ts:268-275) ──
// מילון-תוויות; ברירת-מחדל **null** (שונה מוריאנט-הקורסים שמחזיר {label:'פעיל'…}).
export const enrollStatusMeta = (e) => {
  if (e.status === 'paused') return { label: 'מוקפא', bg: '#fdf1d4', c: '#9a6414' };
  if (e.status === 'ended') return { label: 'הסתיים', bg: '#eceae2', c: '#8b8474' };
  if (e.status === 'wait') return { label: 'רשימת-המתנה ⏳', bg: '#e7edf5', c: '#3a5a86' };
  return null;
};
