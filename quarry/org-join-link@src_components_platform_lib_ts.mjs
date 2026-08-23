/** 🪨 טיוטת-חוט (דרגת-מחצבה) · orgJoinLink — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/platform/lib.ts:99-107 (9 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): orgJoinLink
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function orgJoinLink(origin, basePath, slug, code) {
    return origin + basePath + '?org=' + slug + '&join=' + code;
}
/**
 * קוד-הזמנה מלא לעובד/ת (ORGADMIN — "קוד מהבוס"): ‏{slug}.{code}. מקודד את
 * הסלאג בתוך הקוד כדי שההרשמה במסך-האחיד תדע לאיזה ארגון לנתב את הבקשה — בלי
 * שאילתה ובלי קישור. הסלאג הוא [a-z0-9-] והקוד base36 ⇒ הנקודה מפרידה חד-משמעית.
 */
