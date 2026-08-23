/** 🪨 טיוטת-חוט (דרגת-מחצבה) · dayProgress — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/shop7/lib.ts:43-56 (14 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): dayProgress, deliveriesOfDay
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function dayProgress(db, dayId) {
    const list = deliveriesOfDay(db, dayId);
    return {
        total: list.length,
        pickup: list.filter((d) => d.status === 'pickup').length,
        enroute: list.filter((d) => d.status === 'enroute').length,
        delivered: list.filter((d) => d.status === 'delivered').length,
    };
}
/**
 * רמז-קיבולת (לא-חוסם): כמה מסירות כבר על המתנדב ביום, והאם חרג מ-maxDeliveries.
 * null = אין מגבלה מוגדרת.
 */
