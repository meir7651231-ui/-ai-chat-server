/** 🪨 טיוטת-חוט (דרגת-מחצבה) · isDataImage — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/photoGallery.ts:20-27 (8 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): isDataImage
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function isDataImage(s) {
    return typeof s === 'string' && /^data:image\/(png|jpe?g|webp|gif);base64,/.test(s);
}
/**
 * ממדי-יעד אחרי הקטנה — משמר יחס-גובה-רוחב, הצלע-הגדולה ל-max לכל-היותר (לא
 * מגדיל תמונה קטנה). מחזיר מספרים שלמים חיוביים.
 */
