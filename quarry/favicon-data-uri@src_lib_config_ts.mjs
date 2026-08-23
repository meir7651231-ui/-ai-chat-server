/** 🪨 טיוטת-חוט (דרגת-מחצבה) · faviconDataUri — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/config.ts:890-898 (9 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): faviconDataUri, encodeURIComponent
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function faviconDataUri(emoji) {
    const svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='52' font-size='72' text-anchor='middle' dominant-baseline='central'>" +
        emoji +
        '</text></svg>';
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
}
/** החלת אייקון-הארגון על ה-favicon של הדפדפן — אימוג'י ⇒ SVG; חסר ⇒ הדיפולט. */
