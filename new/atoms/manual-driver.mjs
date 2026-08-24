/** אטום-קבוע · manual-driver — קודם אוטומטית (צילום-ערך). חוזה: manual-driver.contract.md */
/** קישור-חיוג מטלפון שמור: מנקה לספרות/‎+‎; קצר-מדי ⇒ null (הוטמע ממקור tel.ts — פונקציה-טהורה). */
const telHref = (phone) => {
    const cleaned = (phone || '').replace(/[^\d+]/g, '');
    const digits = cleaned.replace(/\D/g, '');
    if (digits.length < 6) return null; // קצר מדי = לא מספר-חיוג תקין
    return 'tel:' + cleaned;
};
export const manualDriver = {
    id: 'manual',
    label: 'חיוג בלחיצה (טלפון קיים)',
    capabilities: { autoDial: false, record: false, screenPop: true },
    callHref: (phone) => telHref(phone),
};
/**
 * בורר-הנהג הפעיל. כרגע ידני-בלבד (downstream). כאן תתווסף בחירת נהג-הקופסה
 * לפי הקונפיג כשהמחבר ל-Yeastar/גרנדסטרים ייכתב — ה-UI לא ישתנה.
 */
