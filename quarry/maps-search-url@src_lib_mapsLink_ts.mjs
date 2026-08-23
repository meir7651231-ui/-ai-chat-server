/** 🪨 טיוטת-חוט (דרגת-מחצבה) · mapsSearchUrl — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/mapsLink.ts:14-25 (12 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): mapsSearchUrl, encodeURIComponent
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function mapsSearchUrl(address, city = '') {
    const q = [address, city].map(cleanStop).filter(Boolean).join(', ');
    if (!q)
        return null;
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
}
/**
 * מסלול רב-עצירות (למתנדב-חלוקה): היעד = העצירה האחרונה, השאר waypoints
 * (מופרדים ב-| מקודד). המוצא מושמט ⇒ Google פותח מהמיקום הנוכחי.
 * עצירה אחת ⇒ קישור-חיפוש; אפס ⇒ null. (מעל ~9 עצירות Google חותך בעצמו —
 * מקבל את כולן, האחריות על הפיצול במתנדב.)
 */
