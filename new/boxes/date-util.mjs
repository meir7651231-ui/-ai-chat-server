/** קופסת-חיבורים · כלי-התאריך (date-util). חוזה: date-util.contract.md
 *  ארבעת חוטי maor/src/lib/date-util.ts מחווטים לפי גרף-המקור
 *  (box-drafts/lib-date-util.box-draft.md): isoToday⇒isoLocal ·
 *  isoDaysAgo⇒isoLocal · isoLocal/dateInRange עצמאיים.
 *  שקע-IO יחיד: שעון-המכונה — isoToday מקבל now מוזרק (ברירת-מחדל
 *  new Date(), נאמן-למקור date-util.ts:10); isoDaysAgo קורא לשעון בתוך
 *  החוט עצמו כלשון-המקור (date-util.ts:21). */
import { isoLocal } from '../atoms/iso-local.mjs';
import { isoToday as isoTodayWire } from '../atoms/iso-today.mjs';
import { isoDaysAgo as isoDaysAgoWire } from '../atoms/iso-days-ago.mjs';
import { dateInRange } from '../atoms/date-in-range.mjs';

// ── החיווט: השכן isoLocal מוזרק לשקעי-הפירמוט (חוק-1) ──
export const isoToday = (now = new Date()) => isoTodayWire(isoLocal, now);
export const isoDaysAgo = (days) => isoDaysAgoWire(days, isoLocal);

// חוטים בלי-שקעים — מוגשים כמות-שהם (החיווט: בחירת-האטום בלבד)
export { isoLocal, dateInRange };
