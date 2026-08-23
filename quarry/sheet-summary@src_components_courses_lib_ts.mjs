/** 🪨 טיוטת-חוט (דרגת-מחצבה) · sheetSummary — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/lib.ts:396-400 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): sheetSummary
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function sheetSummary(roster, dateIso) {
    return { present: roster.filter((e) => (e.presents ?? []).includes(dateIso)).length, total: roster.length };
}
/** ערכי הבחירה בטופס — verbatim מהמקור; '__other' פותח הקלדה חופשית. */
