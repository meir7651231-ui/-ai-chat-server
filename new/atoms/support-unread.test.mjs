import { supportUnread } from './support-unread.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
// 1) אין שיחה
ok(supportUnread(null, 'admin') === 0, 'דוגמה 1: ≠ 0');
// 2) צד-מנהל
ok(supportUnread({ unreadAdmin: 3, unreadUser: 1 }, 'admin') === 3, 'דוגמה 2: ≠ 3');
// 3) צד-משתמש
ok(supportUnread({ unreadAdmin: 3, unreadUser: 1 }, 'user') === 1, 'דוגמה 3: ≠ 1');
// 4) שלילי נחסם
ok(supportUnread({ unreadAdmin: -2 }, 'admin') === 0, 'דוגמה 4: ≠ 0');
// 5) שדה חסר
ok(supportUnread({}, 'admin') === 0, 'דוגמה 5: ≠ 0');
// 6) מחרוזת אינה מספר
ok(supportUnread({ unreadUser: '5' }, 'user') === 0, 'דוגמה 6: ≠ 0');
// 7) אפס ⇒ אין תג
ok(supportUnread({ unreadAdmin: 0 }, 'admin') === 0, 'דוגמה 7: ≠ 0');
if (f) process.exit(1);
console.log('✓ support-unread: 7 דוגמאות-חוזה — ירוק');
