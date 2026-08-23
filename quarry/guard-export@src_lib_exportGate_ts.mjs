/** 🪨 טיוטת-חוט (דרגת-מחצבה) · guardExport — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/exportGate.ts:33-40 (8 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): guardExport
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function guardExport() {
    if (blocked) {
        notify?.();
        return false;
    }
    return true;
}
