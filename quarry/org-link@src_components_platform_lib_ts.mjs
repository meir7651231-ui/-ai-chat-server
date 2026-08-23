/** 🪨 טיוטת-חוט (דרגת-מחצבה) · orgLink — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/platform/lib.ts:65-76 (12 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): orgLink
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function orgLink(origin, basePath, slug) {
    return origin + basePath + '?org=' + slug;
}
/** נירמול מייל — trim + אותיות-קטנות (זהה להשוואת ה-Rules). */
