/** 🪨 טיוטת-חוט (דרגת-מחצבה) · deliveriesOfDay — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/shop7/lib.ts:25-28 (4 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): deliveriesOfDay
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function deliveriesOfDay(db, dayId) {
    return db.deliveries.filter((d) => d.dayId === dayId);
}
