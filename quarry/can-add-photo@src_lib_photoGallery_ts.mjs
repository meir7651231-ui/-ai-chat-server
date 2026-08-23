/** 🪨 טיוטת-חוט (דרגת-מחצבה) · canAddPhoto — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/photoGallery.ts:15-19 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): canAddPhoto
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function canAddPhoto(current) {
    return (current?.length ?? 0) < PHOTO_MAX;
}
/** מחרוזת היא תמונת-data תקינה (data:image/...;base64,...). */
