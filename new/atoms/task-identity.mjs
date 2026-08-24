/** חוט · task-identity — קודם אוטומטית (אפיון-Golden). חוזה: task-identity.contract.md */
export function taskIdentity(email) {
    const e = (email ?? '').trim().toLowerCase();
    return e || 'מקומי';
}
/** המשימות הפתוחות של עובד/ת — ממוינות: עדיפות ⇒ יעד-קרוב ⇒ ותיקה-קודם. */
