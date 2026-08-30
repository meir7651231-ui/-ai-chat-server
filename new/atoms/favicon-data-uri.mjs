/** חוט · favicon-data-uri — קודם אוטומטית (אפיון-Golden). חוזה: favicon-data-uri.contract.md */
export function faviconDataUri(emoji, T) {
    const svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='52' font-size='72' text-anchor='middle' dominant-baseline='central'>" +
        emoji +
        T.k1;
    return T.k2 + encodeURIComponent(svg);
}
/** החלת אייקון-הארגון על ה-favicon של הדפדפן — אימוג'י ⇒ SVG; חסר ⇒ הדיפולט. */
