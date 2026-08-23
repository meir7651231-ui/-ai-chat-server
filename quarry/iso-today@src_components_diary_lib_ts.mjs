/** 🪨 טיוטת-חוט (דרגת-מחצבה) · isoToday — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/diary/lib.ts:28-31 (4 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): isoToday, localIso
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function isoToday() {
    return localIso(new Date());
}
