/** 🪨 טיוטת-חוט (דרגת-מחצבה) · filterDeliveries — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/shop7/lib.ts:155-162 (8 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): filterDeliveries, smartFilter, statusLabel
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function filterDeliveries(rows, q) {
    if (!q.trim())
        return rows;
    return smartFilter(q, rows, (r) => [r.familyName, r.volunteerName, statusLabel(r.status)]);
}
