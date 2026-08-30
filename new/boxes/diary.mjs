/** קופסת-חיבורים · יומן-החדרים (diary). חוזה: diary.contract.md
 *  המקום היחיד שבו חוטי-היומן נפגשים (חוקי-החשמלאי, LAW.md). מייבאת אך-ורק
 *  אטומים; ההכרעות (מילון-תוויות, ברירות-מחדל, העוזר-הפרטי courseOnDate) חיות כאן.
 *  מקור-אמת (L4): maor-system/src/components/diary/lib.ts. */
import { fmtDate } from '../atoms/fmt-date.mjs';
import { isoLocal } from '../atoms/iso-local.mjs';
import { isoToday as isoTodayAtom } from '../atoms/iso-today.mjs';
import { DAY_NAMES } from '../atoms/week-day-names.mjs';
import { pad2 } from '../atoms/pad2.mjs';
import { timeToMin } from '../atoms/time-to-min.mjs';
import { minToHM as minToHMAtom } from '../atoms/min-to-hm.mjs';
import { groupLabelOf } from '../atoms/group-label-of.mjs';
import { ABSENCE_REASON_CHIPS } from '../atoms/absence-reason-chips.mjs';
import { makeupEligibility } from '../atoms/makeup-eligibility.mjs';
import { blockReason as __pure_blockReason } from '../atoms/block-reason.mjs';
import { FULL_HOLIDAYS } from '../atoms/block-reason-data.mjs';
// עטיפת-כריכה (מנוע-הטיהור v2): הדאטה נכרכת כאן — ה-API החיצוני זהה
const blockReasonAtom = (...a) => __pure_blockReason(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), FULL_HOLIDAYS);
import { buildSlots as buildSlotsAtom } from '../atoms/build-slots.mjs';
import { enrollmentsForSession as enrollmentsForSessionAtom } from '../atoms/enrollments-for-session.mjs';
import { weeklyRoomSessions as weeklyRoomSessionsAtom } from '../atoms/weekly-room-sessions.mjs';
import { inactiveRoomCourses as inactiveRoomCoursesAtom } from '../atoms/inactive-room-courses.mjs';
import { chipStyle } from '../atoms/chip-style.mjs';
import { roomInfoLabel } from '../atoms/room-info-label.mjs';
// שכני-החיווט (מוזרקים לאטומים כשקע — חוק-1):
import { hebParts } from '../atoms/heb-parts.mjs';
import { HOLIDAYS } from '../atoms/holidays.mjs';
import { sessionsOf } from '../atoms/sessions-of.mjs';
import { termOf } from '../atoms/term-of.mjs';
import { planWord } from '../atoms/plan-word.mjs';

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
