/** 🪨 טיוטת-חוט (דרגת-מחצבה) · sanitizePhotos — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/photoGallery.ts:38-42 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): sanitizePhotos, isDataImage
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function sanitizePhotos(raw) {
    if (!Array.isArray(raw))
        return [];
    return raw.filter((x) => isDataImage(x) && x.length <= PHOTO_MAX_LEN).slice(0, PHOTO_MAX);
}
