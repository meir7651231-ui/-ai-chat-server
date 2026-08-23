/** 🪨 טיוטת-חוט (דרגת-מחצבה) · isAdminUser — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/config.ts:673-686 (14 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): isAdminUser
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function isAdminUser(config, email) {
    const admins = config.adminEmails;
    if (!admins || admins.length === 0)
        return true;
    if (!email)
        return false;
    const e = email.trim().toLowerCase();
    return admins.some((a) => a.trim().toLowerCase() === e);
}
/**
 * הרשאת פעולה-הרסנית/מוגבלת אחידה (בקשת-בעלים 23.8: "מנהל תמיד · הדלקה-פר-עובד"):
 * מנהל-ארגון/בעלים תמיד מורשים; עובד/ת רק אם הודלק/ה לו/ה במפורש (`features[key]===true`
 * בקונפיג-האפקטיבי — נגזרת effectiveConfigFor על GRANTABLE_STAFF_FEATURES). key שאינו
 * ברשימת-ההדלקה לעולם לא יקבל `true` לעובד ⇒ נשאר מנהל-בלבד. משטח יחיד לכל המסכים.
 */
