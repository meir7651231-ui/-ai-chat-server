/** 🪨 טיוטת-חוט (דרגת-מחצבה) · isValidSlug — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/platform/lib.ts:34-38 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): isValidSlug
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function isValidSlug(slug) {
    return /^[a-z0-9-]{2,40}$/.test(slug);
}
/** כל 8 מפתחות המודולים — מקור אחד לפאנל ולקונפיג-הלידה. */
