/** 🪨 טיוטת-חוט (דרגת-מחצבה) · smtpHostFor — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/smtpUrl.ts:21-32 (12 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): smtpHostFor, lastIndexOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function smtpHostFor(email) {
    const at = email.lastIndexOf('@');
    if (at < 1)
        return '';
    const domain = email.slice(at + 1).trim().toLowerCase();
    return SMTP_HOSTS[domain] ?? '';
}
/**
 * הרכבת ה-URL המלא. host בפורמט 'host:port' (מ-smtpHostFor או ידני).
 * מחזיר null כשחסר משהו. שם-משתמש/סיסמה עוברים encodeURIComponent —
 * סיסמת-אפליקציה עם תווים מיוחדים לא שוברת את הכתובת.
 */
