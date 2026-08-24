/** 🪨 טיוטת-חוט (דרגת-מחצבה) · DEFAULT_FAVICON — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/config.ts:886-889 (4 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): —
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export const DEFAULT_FAVICON = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='38' fill='%23f3c76b'/><circle cx='50' cy='50' r='20' fill='%23b45309'/></svg>";
/** בניית data-URI ל-favicon מאימוג'י (טהור — נבדק ביחידה). encodeURIComponent מנטרל הזרקה. */
