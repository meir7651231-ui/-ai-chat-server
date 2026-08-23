/** 🪨 טיוטת-חוט (דרגת-מחצבה) · manualDriver — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/telephony/driver.ts:34-44 (11 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): telHref
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
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
