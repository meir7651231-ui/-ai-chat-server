/** 🪨 טיוטת-חוט (דרגת-מחצבה) · eligibleAssignmentsForDay — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/shop7/lib.ts:37-42 (6 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): eligibleAssignmentsForDay
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function eligibleAssignmentsForDay(db, dayId) {
    const taken = new Set(db.deliveries.filter((d) => d.dayId === dayId).map((d) => d.assignmentId));
    return db.shopAssignments.filter((a) => a.status === 'active' && !taken.has(a.id));
}
/** מד-התקדמות ליום — ספירת מסירות לפי סטטוס. */
