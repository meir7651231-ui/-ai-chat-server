/** אטום-קבוע · audit-categories — קודם אוטומטית (צילום-ערך). חוזה: audit-categories.contract.md */
export const makeAUDIT_CATEGORIES = (T) => ([
    T.k1,
    T.k2,
    T.k3,
    T.k4,
    T.k5,
    T.k6,
    T.k7,
    T.k8,
]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const digits = (x) => (x || '').replace(/\D/g, '');
/** אבחון תקינות מספר טלפון — מחזיר תיאור הבעיה או null אם תקין. */
