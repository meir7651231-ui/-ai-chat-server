/** 🪨 טיוטת-חוט (דרגת-מחצבה) · sameLoc — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/navhist.ts:23-27 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): sameLoc
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function sameLoc(a, b) {
    return a.view === b.view && a.selFamilyId === b.selFamilyId && a.selCourseId === b.selCourseId;
}
/** דחיפת המיקום הקודם למחסנית — תקרה 20, הישן ביותר נזרק (legacy:166). */
