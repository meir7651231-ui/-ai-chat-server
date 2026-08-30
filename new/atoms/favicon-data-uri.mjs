/** חוט · favicon-data-uri — קודם אוטומטית (אפיון-Golden). חוזה: favicon-data-uri.contract.md */
export function faviconDataUri(emoji, T) {
    const svg = T.k3 +
        emoji +
        T.k1;
    return T.k2 + encodeURIComponent(svg);
}
/** החלת אייקון-הארגון על ה-favicon של הדפדפן — אימוג'י ⇒ SVG; חסר ⇒ הדיפולט. */
