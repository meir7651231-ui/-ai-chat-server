/** 🪨 טיוטת-חוט (דרגת-מחצבה) · SMTP_HOSTS — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/smtpUrl.ts:11-20 (10 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): —
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export const SMTP_HOSTS = {
    'gmail.com': 'smtp.gmail.com:465',
    'googlemail.com': 'smtp.gmail.com:465',
    'outlook.com': 'smtp-mail.outlook.com:587',
    'hotmail.com': 'smtp-mail.outlook.com:587',
    'yahoo.com': 'smtp.mail.yahoo.com:465',
    'walla.co.il': 'out.walla.co.il:465',
};
/** שרת-היציאה לפי דומיין-הכתובת; '' = ספק לא-מוכר (נדרש שרת ידני). */
