/** אטום-קבוע · manual-driver — קודם אוטומטית (צילום-ערך). חוזה: manual-driver.contract.md */
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
