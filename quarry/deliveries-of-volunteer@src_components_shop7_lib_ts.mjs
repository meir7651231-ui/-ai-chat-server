/** 🪨 טיוטת-חוט (דרגת-מחצבה) · deliveriesOfVolunteer — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/shop7/lib.ts:29-36 (8 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): deliveriesOfVolunteer
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function deliveriesOfVolunteer(db, volId, dayId) {
    return db.deliveries.filter((d) => d.volunteerId === volId && (!dayId || d.dayId === dayId));
}
/**
 * שיוכי-חנות פעילים שטרם הפכו למסירה **ביום הזה** — הקלט לבורר-השיוך.
 * מבוסס על db.shopAssignments (SHOP6); לא משכפל, רק מצביע.
 */
