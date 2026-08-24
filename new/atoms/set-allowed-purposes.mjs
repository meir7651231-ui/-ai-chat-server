/** חוט · set-allowed-purposes — נרמול רשימת-הייעודים-המותרים לעובד/ת: ריק ⇒ null.
 *  חוזה: set-allowed-purposes.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloud.ts:112-121; במקור הושם למשתנה-המודול
 *  allowedPurposes — ההשמה היא חיווט-קופסה (חוק-1/חוק-5 — האטום מחשב את
 *  הערך המנורמל בלבד, לא מחזיק מצב). */
export function setAllowedPurposes(p) {
    return p && p.length ? p : null;
}
