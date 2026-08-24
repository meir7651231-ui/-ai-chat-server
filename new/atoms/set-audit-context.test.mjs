import { setAuditContext } from './set-audit-context.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };

// 1) נרמול-מייל: trim + אותיות-קטנות
{
  const ctx = setAuditContext('u1', '  Meir@Gmail.Com ', true);
  ok(ctx.auditUid === 'u1', 'ה-uid חייב לעבור כמות-שהוא');
  ok(ctx.auditEmail === 'meir@gmail.com', 'המייל חייב להתנרמל trim+lowercase (בפועל: ' + ctx.auditEmail + ')');
  ok(ctx.auditReadable === true, 'canRead=true חייב להישמר');
  ok(Object.keys(ctx).length === 3, 'האובייקט חייב להכיל בדיוק auditUid+auditEmail+auditReadable');
}
// 2) מייל כבר-מנורמל עובר כמות-שהוא
{
  ok(setAuditContext('u2', 'a@b.com', true).auditEmail === 'a@b.com', 'מייל מנורמל השתנה בדרך');
}
// 3) canRead=false נשמר (עובד/ת)
{
  ok(setAuditContext('u3', 'w@org.il', false).auditReadable === false, 'canRead=false לא נשמר');
}
// 4) uid ריק עובר '' כמות-שהוא (המשמעות אצל הצרכן)
{
  ok(setAuditContext('', 'x@y.z', false).auditUid === '', "uid ריק חייב לעבור '' — לא להיות מומצא");
}
// 5) שתי קריאות זהות ⇒ הפניות שונות, תוכן שווה
{
  const a = setAuditContext('u1', 'a@b.com', true);
  const b = setAuditContext('u1', 'a@b.com', true);
  ok(a !== b, 'אותו אובייקט הוחזר פעמיים — מצב דולף בין קריאות');
  ok(a.auditUid === b.auditUid && a.auditEmail === b.auditEmail && a.auditReadable === b.auditReadable, 'תוכן שתי הקריאות חייב להיות זהה');
}
if (f) process.exit(1);
console.log('✓ set-audit-context: 5 דוגמאות-חוזה — ירוק (טהור; ההשמה = חיווט-קופסה)');
