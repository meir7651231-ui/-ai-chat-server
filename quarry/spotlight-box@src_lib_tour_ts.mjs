/** 🪨 טיוטת-חוט (דרגת-מחצבה) · spotlightBox — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/tour.ts:98-109 (12 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): spotlightBox
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function spotlightBox(rect, vw, vh, pad = 10) {
    if (!rect || rect.width <= 0 || rect.height <= 0)
        return null;
    const left = Math.max(0, rect.left - pad);
    const top = Math.max(0, rect.top - pad);
    return {
        left,
        top,
        width: Math.min(vw - left, rect.width + pad * 2),
        height: Math.min(vh - top, rect.height + pad * 2),
    };
}
