/** 🪨 טיוטת-חוט (דרגת-מחצבה) · volunteerLoadHint — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/shop7/lib.ts:57-63 (7 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): volunteerLoadHint, deliveriesOfVolunteer
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function volunteerLoadHint(db, vol, dayId) {
    const count = deliveriesOfVolunteer(db, vol.id, dayId).length;
    if (vol.maxDeliveries == null)
        return { count, over: false };
    return { count, over: count >= vol.maxDeliveries };
}
/** מסירות של משפחה (לפאנל כרטיס-המשפחה — תצוגה בלבד). */
