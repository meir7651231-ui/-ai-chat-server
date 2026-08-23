/** 🪨 טיוטת-חוט (דרגת-מחצבה) · pendingDeliveriesToday — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/shop7/lib.ts:73-85 (13 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): pendingDeliveriesToday
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function pendingDeliveriesToday(db, todayIso) {
    const openDays = new Set(db.distributionDays.filter((d) => d.date <= todayIso && !d.closed).map((d) => d.id));
    return db.deliveries.filter((d) => openDays.has(d.dayId) && d.status !== 'delivered');
}
/**
 * שורות תדפיס ליום-חלוקה — מקובצות פר-מתנדב: כותרת-מתנדב ואז
 * "משפחה · סטטוס · 📍 כתובת · הערה" לכל מסירה. familyName/volunteerName/address
 * מוזרקים ב-caller; בלי address השורה זהה-ביט לפורמט הקודם (גל ב׳ — דף-מסלול
 * אמיתי למתנדב על נייר).
 */
