/** חוט · deliveries-of-volunteer — מסירות של מתנדב (אופציונלית: ביום נתון).
 *  חוזה: deliveries-of-volunteer.contract.md
 *  חולץ כלשונו מ-maor/src/components/shop7/lib.ts:29-31 · אפס import (חוק-1). */
export function deliveriesOfVolunteer(db, volId, dayId) {
    return db.deliveries.filter((d) => d.volunteerId === volId && (!dayId || d.dayId === dayId));
}
