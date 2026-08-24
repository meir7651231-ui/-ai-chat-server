import { canIssueReceipt } from './can-issue-receipt.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const base = { superAdmin: false, isManager: false, cloudRoot: false, cloudConnected: false };
// 1) עבודה מקומית בלי ענן — מתיר
ok(canIssueReceipt({ ...base }) === true, 'לא-מחובר ≠ true');
// 2) עובד/ת מחובר/ת בלי סמכות — חסום
ok(canIssueReceipt({ ...base, cloudConnected: true }) === false, 'עובד-מחובר ≠ false');
// 3) מייל-על
ok(canIssueReceipt({ ...base, cloudConnected: true, superAdmin: true }) === true, 'מייל-על ≠ true');
// 4) מנהל-ארגון
ok(canIssueReceipt({ ...base, cloudConnected: true, isManager: true }) === true, 'מנהל ≠ true');
// 5) לקוח-שורש
ok(canIssueReceipt({ ...base, cloudConnected: true, cloudRoot: true }) === true, 'שורש ≠ true');
if (f) process.exit(1);
console.log('✓ can-issue-receipt: 5 דוגמאות-חוזה — ירוק');
