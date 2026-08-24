import { subsidyTotal } from './subsidy-total.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const konst = (n) => () => n;
// 1) הפרש בסיסי
ok(subsidyTotal([], konst(500), konst(120)) === 380, 'דוגמה 1: 500-120 ≠ 380');
// 2) אין שיוכים
ok(subsidyTotal([], konst(0), konst(0)) === 0, 'דוגמה 2: 0-0 ≠ 0');
// 3) שולם מלוא-השווי
ok(subsidyTotal([], konst(300), konst(300)) === 0, 'דוגמה 3: אפס-סבסוד שגוי');
// 4) אין עיגול
ok(subsidyTotal([], konst(250.5), konst(100.25)) === 150.25, 'דוגמה 4: עיגול לא-רצוי');
// 5) assignments מועבר כמו-שהוא (אותה רפרנס) לשני השקעים
const as = [{ id: 'a1' }];
let seenG = null, seenC = null;
subsidyTotal(as, (x) => { seenG = x; return 10; }, (x) => { seenC = x; return 4; });
ok(seenG === as && seenC === as, 'דוגמה 5: הרפרנס לא הועברה כמו-שהיא');
if (f) process.exit(1);
console.log('✓ subsidy-total: 5 דוגמאות-חוזה — ירוק');
