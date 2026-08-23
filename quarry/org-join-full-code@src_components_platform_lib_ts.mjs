/** 🪨 טיוטת-חוט (דרגת-מחצבה) · orgJoinFullCode — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/platform/lib.ts:108-112 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): orgJoinFullCode
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function orgJoinFullCode(slug, code) {
    return slug + '.' + code;
}
/** פירוק "קוד מהבוס" ל-{slug, code}. null אם הצורה אינה תקינה (סלאג חוקי + קוד לא-ריק). */
