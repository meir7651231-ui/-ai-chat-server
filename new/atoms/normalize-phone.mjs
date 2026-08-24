/** חוט · normalize-phone — קודם אוטומטית (אפיון-Golden). חוזה: normalize-phone.contract.md */
export function normalizePhone(raw) {
    let s = String(raw || '').replace(/[\s\-().]/g, '');
    if (s.startsWith('972'))
        s = '0' + s.slice(3);
    if (raw.startsWith('+972'))
        s = '0' + raw.replace(/[\s\-().]/g, '').slice(4);
    return s;
}
/**
 * עיצוב טלפון ישראלי לתצוגה (פורט נאמן מ-fixPhone באב-טיפוס):
 * משלים ספרת 0 מובילה חסרה למספר בן 8/9 ספרות ומוסיף מקף מפריד —
 * ‎0XX-XXXXXXX‎ (נייד/9 ספרות) או ‎0X-XXXXXXX‎ (קווי/8 ספרות).
 * מספר שכבר מתחיל ב-0, ריק, או באורך חריג — מוחזר אחרי trim בלבד (ללא נגיעה).
 * שים לב: פונקציה נפרדת מ-normalizePhone כדי לא לשבור מפתחות זיהוי כפילויות.
 */
