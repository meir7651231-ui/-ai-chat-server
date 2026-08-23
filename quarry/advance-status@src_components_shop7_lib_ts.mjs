/** 🪨 טיוטת-חוט (דרגת-מחצבה) · advanceStatus — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/shop7/lib.ts:15-20 (6 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): advanceStatus
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function advanceStatus(status) {
    const i = ORDER.indexOf(status);
    return i < 0 || i >= ORDER.length - 1 ? 'delivered' : ORDER[i + 1];
}
/** תווית הסטטוס לתצוגה. */
