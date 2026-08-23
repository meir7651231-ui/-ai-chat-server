/** 🪨 טיוטת-חוט (דרגת-מחצבה) · monthKey — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/reports/lib.ts:59-63 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): monthKey
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function monthKey(iso) {
    return iso.slice(0, 7);
}
/** תצוגת חודש MM/YYYY. */
