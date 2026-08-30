// בדיקת-צילום · smtp-url-terms — יושר-מחדש (מנוע-הטיהור).
import { SMTP_URL_TERMS } from './smtp-url-terms.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(SMTP_URL_TERMS), "{\"k1\":\"מייל: מלאו גם כתובת וגם סיסמת-אפליקציה\",\"k2\":\"מייל: הספק לא מוכר — מלאו את שדה שרת-היציאה (host:port)\"}");
console.log('OK');
