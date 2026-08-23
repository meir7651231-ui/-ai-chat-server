/** 🪨 טיוטת-חוט (דרגת-מחצבה) · normName — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/supporters/lib.ts:360-395 (36 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): normName, normSearch
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function normName(s) {
    return normSearch(s).replace(/\s/g, '');
}
/** מילות-מפתח לעמודת-השם. 'תורם' נוסף בשביל יצוא-הסליקה (כותרת "תורם"). */
