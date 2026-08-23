/** 🪨 טיוטת-חוט (דרגת-מחצבה) · providerClearer — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/nedarimSync.ts:119-123 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): providerClearer
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function providerClearer(provider) {
    return /sola/i.test(provider || '') ? 'סולה' : 'נדרים';
}
/** בניית רשומת-hist מעסקה (רק שדות לא-ריקים; d/a/c תמיד). */
