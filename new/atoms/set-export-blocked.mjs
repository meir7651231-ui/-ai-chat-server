/** חוט · set-export-blocked — חישוב מצב שער-יציאת-המידע החדש: דגל-חסימה + התרעה מנורמלת.
 *  חוזה: set-export-blocked.contract.md
 *  חולץ כלשונו מ-maor/src/lib/exportGate.ts:19-24; במקור הושם לשני משתני-המודול
 *  blocked/notify — ההשמה (וברירת-המחדל הבטוחה "לא-חסום") הן חיווט-קופסה
 *  (חוק-1/חוק-5 — האטום מחשב את ערך-המצב בלבד, לא מחזיק מצב ולא קורא ל-toast). */
export function setExportBlocked(isBlocked, onBlocked) {
    return { blocked: isBlocked, notify: onBlocked ?? null };
}
