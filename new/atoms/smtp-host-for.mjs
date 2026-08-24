/** חוט · smtp-host-for — שרת-היציאה (host:port) לפי דומיין כתובת-המייל.
 *  חוזה: smtp-host-for.contract.md
 *  חולץ כלשונו מ-maor/src/lib/smtpUrl.ts:21-26 (תורגם TS→JS);
 *  טבלת-הספקים SMTP_HOSTS (אותו קובץ, שורות 11-18) הוטבעה כקבוע-פרטי —
 *  נתון של האטום, לא קריאת-שכן (חוק-1; קיים גם כאטום-קבוע smtp-hosts). */

/** ספקים מוכרים — דומיין-המייל ⇒ שרת-היציאה שלו. לא מוכר ⇒ שדה-שרת ידני. */
const SMTP_HOSTS = {
    'gmail.com': 'smtp.gmail.com:465',
    'googlemail.com': 'smtp.gmail.com:465',
    'outlook.com': 'smtp-mail.outlook.com:587',
    'hotmail.com': 'smtp-mail.outlook.com:587',
    'yahoo.com': 'smtp.mail.yahoo.com:465',
    'walla.co.il': 'out.walla.co.il:465',
};

export function smtpHostFor(email) {
    const at = email.lastIndexOf('@');
    if (at < 1)
        return '';
    const domain = email.slice(at + 1).trim().toLowerCase();
    return SMTP_HOSTS[domain] ?? '';
}
