/** חוט · smtp-host-for — שרת-היציאה (host:port) לפי דומיין כתובת-המייל.
 *  חוזה: smtp-host-for.contract.md
 *  חולץ כלשונו מ-maor/src/lib/smtpUrl.ts:21-26 (תורגם TS→JS);
 *  טבלת-הספקים SMTP_HOSTS (אותו קובץ, שורות 11-18) הוטבעה כקבוע-פרטי —
 *  נתון של האטום, לא קריאת-שכן (חוק-1; קיים גם כאטום-קבוע smtp-hosts). */

/** ספקים מוכרים — דומיין-המייל ⇒ שרת-היציאה שלו. לא מוכר ⇒ שדה-שרת ידני. */

export function smtpHostFor(email, SMTP_HOSTS) {
    const at = email.lastIndexOf('@');
    if (at < 1)
        return '';
    const domain = email.slice(at + 1).trim().toLowerCase();
    return SMTP_HOSTS[domain] ?? '';
}
