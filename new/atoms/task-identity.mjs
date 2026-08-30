/** חוט · task-identity — קודם אוטומטית (אפיון-Golden). חוזה: task-identity.contract.md */
export function taskIdentity(email, T) {
    const e = (email ?? '').trim().toLowerCase();
    return e || T.k1;
}
/** המשימות הפתוחות של עובד/ת — ממוינות: עדיפות ⇒ יעד-קרוב ⇒ ותיקה-קודם. */
