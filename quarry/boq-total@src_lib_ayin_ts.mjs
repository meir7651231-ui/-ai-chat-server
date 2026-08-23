/** 🪨 טיוטת-חוט (דרגת-מחצבה) · boqTotal — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/ayin.ts:99-103 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): boqTotal, boqLineAmount
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function boqTotal(a) {
    return a.names.reduce((t, n) => t + boqLineAmount(n), 0);
}
/** סה"כ שעות בשעתון-הפרויקט. טהור. */
