/** קופסת-חיבורים · חלוקה (SHOP7) — מתנדבים · יום-חלוקה · מסירות.
 *  חוזה: distribution.contract.md · מקור-אמת: maor/src/components/shop7/lib.ts
 *  זה המקום היחיד שבו חוטי-SHOP7 נפגשים (חוקי-החשמלאי, LAW.md). מייבא אך-ורק
 *  אטומים; שקעי-IO/מודולים-אחרים (smartFilter) = פרמטרים-מוזרקים מתועדים. */
import { advanceStatus } from '../atoms/advance-status.mjs';
import { deliveriesOfDay } from '../atoms/deliveries-of-day.mjs';
import { deliveriesOfVolunteer } from '../atoms/deliveries-of-volunteer.mjs';
import { eligibleAssignmentsForDay } from '../atoms/eligible-assignments-for-day.mjs';
import { dayProgress } from '../atoms/day-progress.mjs';
import { volunteerLoadHint } from '../atoms/volunteer-load-hint.mjs';
import { deliveriesOfFamily } from '../atoms/deliveries-of-family.mjs';
import { pendingDeliveriesToday } from '../atoms/pending-deliveries-today.mjs';
import { deliveryListLines } from '../atoms/delivery-list-lines.mjs';
import { deliveriesCsvRows } from '../atoms/deliveries-csv-rows.mjs';
import { volunteerRouteStops } from '../atoms/volunteer-route-stops.mjs';
import { termOf } from '../atoms/term-of.mjs';

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
