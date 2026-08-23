/** 🪨 טיוטת-חוט (דרגת-מחצבה) · emptyDiff — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud-diff.ts:184-187 (4 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): emptyDiff
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function emptyDiff(d) {
    return d.sets.length === 0 && d.deletes.length === 0 && d.meta === null;
}
