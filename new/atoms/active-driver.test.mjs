import { activeDriver } from './active-driver.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
// 1) אותה רפרנס — לא עותק
const d = { id: 'manual' };
ok(activeDriver(d) === d, 'לא הוחזרה אותה רפרנס');
// 2) נהג מלא — שום שדה לא שונה
const full = { id: 'manual', label: 'חיוג בלחיצה', capabilities: { autoDial: false } };
const got = activeDriver(full);
ok(got.id === 'manual', "id ≠ 'manual'");
ok(got.capabilities.autoDial === false, 'autoDial שונה');
// 3) עיוור לתוכן (חוק-5)
ok(activeDriver(7) === 7, 'ערך-זקיף 7 לא הוחזר כמו-שהוא');
if (f) process.exit(1);
console.log('✓ active-driver: 3 דוגמאות-חוזה — ירוק');
