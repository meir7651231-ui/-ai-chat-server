/** קופסת-חיבורים · חלוקה (SHOP7) — מתנדבים · יום-חלוקה · מסירות.
 *  חוזה: distribution.contract.md · מקור-אמת: maor/src/components/shop7/lib.ts
 *  זה המקום היחיד שבו חוטי-SHOP7 נפגשים (חוקי-החשמלאי, LAW.md). מייבא אך-ורק
 *  אטומים; שקעי-IO/מודולים-אחרים (smartFilter) = פרמטרים-מוזרקים מתועדים. */
import { advanceStatus as __pure_advanceStatus } from '../atoms/advance-status.mjs';
import { ORDER } from '../atoms/advance-status-data.mjs';
// עטיפת-כריכה (מנוע-הטיהור v2): הדאטה נכרכת כאן — ה-API החיצוני זהה
const advanceStatus = (...a) => __pure_advanceStatus(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), ORDER);
import { deliveriesOfDay } from '../atoms/deliveries-of-day.mjs';
import { deliveriesOfVolunteer } from '../atoms/deliveries-of-volunteer.mjs';
import { eligibleAssignmentsForDay as __pure_eligibleAssignmentsForDay } from '../atoms/eligible-assignments-for-day.mjs';
import { ELIGIBLE_ASSIGNMENTS_FOR_DAY_T as __d_eligibleAssignmentsForDay_ELIGIBLE_ASSIGNMENTS_FOR_DAY_T } from '../atoms/eligible-assignments-for-day-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const eligibleAssignmentsForDay = (...a) => __pure_eligibleAssignmentsForDay(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_eligibleAssignmentsForDay_ELIGIBLE_ASSIGNMENTS_FOR_DAY_T);
import { dayProgress as __pure_dayProgress } from '../atoms/day-progress.mjs';
import { DAY_PROGRESS_T as __d_dayProgress_DAY_PROGRESS_T } from '../atoms/day-progress-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const dayProgress = (...a) => __pure_dayProgress(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_dayProgress_DAY_PROGRESS_T);
import { volunteerLoadHint } from '../atoms/volunteer-load-hint.mjs';
import { deliveriesOfFamily } from '../atoms/deliveries-of-family.mjs';
import { pendingDeliveriesToday as __pure_pendingDeliveriesToday } from '../atoms/pending-deliveries-today.mjs';
import { PENDING_DELIVERIES_TODAY_T as __d_pendingDeliveriesToday_PENDING_DELIVERIES_TODAY_T } from '../atoms/pending-deliveries-today-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const pendingDeliveriesToday = (...a) => __pure_pendingDeliveriesToday(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_pendingDeliveriesToday_PENDING_DELIVERIES_TODAY_T);
import { deliveryListLines } from '../atoms/delivery-list-lines.mjs';
import { deliveriesCsvRows as __pure_deliveriesCsvRows } from '../atoms/deliveries-csv-rows.mjs';
import { DELIVERIES_CSV_ROWS_T as __d_deliveriesCsvRows_DELIVERIES_CSV_ROWS_T } from '../atoms/deliveries-csv-rows-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const deliveriesCsvRows = (...a) => __pure_deliveriesCsvRows(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_deliveriesCsvRows_DELIVERIES_CSV_ROWS_T);
import { volunteerRouteStops } from '../atoms/volunteer-route-stops.mjs';
import { termOf as __pure_termOf } from '../atoms/term-of.mjs';
import { INTEGRATION_SETTING_T as __d_termOf_TERM_OF_T } from '../atoms/integration-setting-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const termOf = (...a) => __pure_termOf(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_termOf_TERM_OF_T);

// ── מילון-התוויות (הכרעה — חי בקופסה, לא בחוטים) ──
// מקור: shop7/lib.ts:20-22 — pickup→איסוף · enroute→בדרך · delivered→נמסר.
// המפה עצמה היא *המשמעות*; החוטים (delivery-list-lines/deliveries-csv-rows/filter)
// מקבלים אותה כשקע-פונקציה statusLabel.
const STATUS_LABEL = { pickup: 'איסוף', enroute: 'בדרך', delivered: 'נמסר' };
const statusLabel = (status) =>
  status === 'pickup' ? STATUS_LABEL.pickup : status === 'enroute' ? STATUS_LABEL.enroute : STATUS_LABEL.delivered;

// ── שקעי-סינון (הכרעה — בוררי-השדות חיים בקופסה) ──
// מקור: shop7/lib.ts:149-163 — קיצור-דרך על שאילתה-ריקה, ואז smartFilter
// (חוט מודול-החיפוש, מוזרק כשקע) על בוררי-השדות שלמטה.
const VOL_TERMS = (v) => [v.name, v.phone, v.area ?? ''];
const DELIVERY_TERMS = (r) => [r.familyName, r.volunteerName, statusLabel(r.status)];

// ── החשיפה ──
export { advanceStatus, statusLabel, deliveriesOfDay, deliveriesOfVolunteer, eligibleAssignmentsForDay, deliveriesOfFamily, pendingDeliveriesToday, volunteerRouteStops };

/** מד-התקדמות ליום — deliveriesOfDay מחווט פנימית (שקע-שכן). */
export const progressOfDay = (db, dayId) => dayProgress(db, dayId, deliveriesOfDay);

/** רמז-קיבולת למתנדב — deliveriesOfVolunteer מחווט פנימית (שקע-שכן). */
export const loadHint = (db, vol, dayId) => volunteerLoadHint(db, vol, dayId, deliveriesOfVolunteer);

/** שורות-תדפיס יום-חלוקה — statusLabel (מילון-הקופסה) מחווט פנימית. */
export const listLines = (rows) => deliveryListLines(rows, statusLabel);

/** שורות-CSV של מסירות — termOf (אטום) + statusLabel (מילון-הקופסה) מחווטים פנימית. */
export const csvRows = (db, config) => deliveriesCsvRows(db, config, termOf, statusLabel);

/** סינון מתנדבים — smartFilter הוא שקע-מוזרק (חוט מודול-החיפוש); בורר-השדות חי בקופסה. */
export function filterVolunteers(vols, q, smartFilter) {
  if (!q.trim()) return vols;
  return smartFilter(q, vols, VOL_TERMS);
}

/** סינון מסירות — smartFilter שקע-מוזרק; בורר-השדות + statusLabel חיים בקופסה. */
export function filterDeliveries(rows, q, smartFilter) {
  if (!q.trim()) return rows;
  return smartFilter(q, rows, DELIVERY_TERMS);
}
