/** 🪨 טיוטת-חוט (דרגת-מחצבה) · fitDimensions — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/photoGallery.ts:28-37 (10 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): fitDimensions
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function fitDimensions(w, h, max) {
    if (w <= 0 || h <= 0)
        return { w: 0, h: 0 };
    const scale = Math.min(1, max / Math.max(w, h));
    return { w: Math.max(1, Math.round(w * scale)), h: Math.max(1, Math.round(h * scale)) };
}
/**
 * סינון-מערך-תמונות מתקבל-מבחוץ (ייבוא/סנכרון/ישן) — רק תמונות-data תקינות מתחת
 * לתקרת-המשקל, עד PHOTO_MAX. שער-חיטוי לפני התמדה.
 */
