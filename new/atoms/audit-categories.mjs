/** אטום-קבוע · audit-categories — קודם אוטומטית (צילום-ערך). חוזה: audit-categories.contract.md */
export const AUDIT_CATEGORIES = [
    'כפילות',
    'ת"ז',
    'טלפון',
    'אימייל',
    'כתובת',
    'לוגיקה',
    'ילדים',
    'קשר',
];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const digits = (x) => (x || '').replace(/\D/g, '');
/** אבחון תקינות מספר טלפון — מחזיר תיאור הבעיה או null אם תקין. */
