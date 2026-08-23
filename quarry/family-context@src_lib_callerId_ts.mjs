/** 🪨 טיוטת-חוט (דרגת-מחצבה) · familyContext — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/callerId.ts:113-118 (6 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): familyContext
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function familyContext(db, famId) {
    const openDeliveries = (db.deliveries || []).filter((d) => d.familyId === famId && d.status !== 'delivered').length;
    const activeAssignments = (db.shopAssignments || []).filter((a) => a.famId === famId && a.status === 'active').length;
    return { openDeliveries, activeAssignments };
}
