/** 🪨 טיוטת-חוט (דרגת-מחצבה) · inRange — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/reports/lib.ts:25-31 (7 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): inRange
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function inRange(iso, r) {
    if (!iso)
        return false;
    if (r.from && iso < r.from)
        return false;
    if (r.to && iso > r.to)
        return false;
    return true;
}
