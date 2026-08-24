/** חוט · deliveries-of-day — מסירות של יום-חלוקה. חוזה: deliveries-of-day.contract.md
 *  חולץ כלשונו מ-maor/src/components/shop7/lib.ts:25-27 · אפס import (חוק-1). */
export function deliveriesOfDay(db, dayId) {
    return db.deliveries.filter((d) => d.dayId === dayId);
}
