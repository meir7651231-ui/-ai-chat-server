import { smtpHostFor as __pure_smtpHostFor } from './smtp-host-for.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v2; בדיקה לא מייבאת אטום-שכן)
const __d_smtpHostFor_SMTP_HOSTS = {
    'gmail.com': 'smtp.gmail.com:465',
    'googlemail.com': 'smtp.gmail.com:465',
    'outlook.com': 'smtp-mail.outlook.com:587',
    'hotmail.com': 'smtp-mail.outlook.com:587',
    'yahoo.com': 'smtp.mail.yahoo.com:465',
    'walla.co.il': 'out.walla.co.il:465',
};
const smtpHostFor = (...a) => __pure_smtpHostFor(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_smtpHostFor_SMTP_HOSTS);
let f = 0;
const eq = (a, b, msg) => { if (a !== b) { console.error(`✗ ${msg} ⇒ ${JSON.stringify(a)}`); f = 1; } };

// 1) ספק מוכר
eq(smtpHostFor('user@gmail.com'), 'smtp.gmail.com:465', 'gmail שגוי');

// 2) הנמכה + גיזום על הדומיין
eq(smtpHostFor('Me@HOTMAIL.Com '), 'smtp-mail.outlook.com:587', 'הנמכה/גיזום שגויים');

// 3) ספק ישראלי
eq(smtpHostFor('vaad@walla.co.il'), 'out.walla.co.il:465', 'walla שגוי');

// 4) ספק לא-מוכר ⇒ ''
eq(smtpHostFor('office@myorg.org.il'), '', 'לא-מוכר החזיר ערך');

// 5) אין @ ⇒ ''
eq(smtpHostFor('nodomain'), '', 'בלי @ החזיר ערך');

// 6) @ בעמדה 0 ⇒ ''
eq(smtpHostFor('@gmail.com'), '', '@ ראשון החזיר ערך');

if (f) process.exit(1);
console.log('✓ smtp-host-for: 6 דוגמאות-חוזה — ירוק');
