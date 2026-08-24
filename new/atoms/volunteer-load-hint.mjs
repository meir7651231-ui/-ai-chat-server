/** חוט · volunteer-load-hint — רמז-קיבולת (לא-חוסם) למתנדב ביום-חלוקה.
 *  חוזה: volunteer-load-hint.contract.md
 *  חולץ כלשונו מ-maor/src/components/shop7/lib.ts:57-61; השכן
 *  deliveriesOfVolunteer (מסירות-של-מתנדב) הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function volunteerLoadHint(db, vol, dayId, deliveriesOfVolunteer) {
  const count = deliveriesOfVolunteer(db, vol.id, dayId).length;
  if (vol.maxDeliveries == null) return { count, over: false };
  return { count, over: count >= vol.maxDeliveries };
}
