import { supLastInPeriod } from './sup-last-in-period.mjs';
const supLast = (sp) => sp.last || '';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
// 1) בלי סינון — true תמיד, גם לתורם ריק
ok(supLastInPeriod({}, null, null, supLast) === true, 'דוגמה 1: null/null על {} ≠ true');
ok(supLastInPeriod({ last: '2026-08-24' }, null, null, supLast) === true, 'דוגמה 1ב: null/null ≠ true');
// 2) שנה תואמת
ok(supLastInPeriod({ last: '2026-08-24' }, 2026, null, supLast) === true, 'דוגמה 2: שנה 2026 ≠ true');
// 3) שנה אחרת
ok(supLastInPeriod({ last: '2026-08-24' }, 2025, null, supLast) === false, 'דוגמה 3: שנה 2025 ≠ false');
// 4) שנה+חודש
ok(supLastInPeriod({ last: '2026-08-24' }, 2026, 8, supLast) === true, 'דוגמה 4: 2026/8 ≠ true');
ok(supLastInPeriod({ last: '2026-08-24' }, 2026, 7, supLast) === false, 'דוגמה 4ב: 2026/7 ≠ false');
// 5) חודש בלבד
ok(supLastInPeriod({ last: '2026-08-24' }, null, 8, supLast) === true, 'דוגמה 5: חודש-בלבד ≠ true');
// 6) אין תרומה + סינון ⇒ false
ok(supLastInPeriod({}, 2026, null, supLast) === false, 'דוגמה 6: תורם-ריק עם סינון ≠ false');
if (f) process.exit(1);
console.log('✓ sup-last-in-period: 6 דוגמאות-חוזה — ירוק');
