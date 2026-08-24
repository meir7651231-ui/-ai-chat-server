import { supAllowedKeys } from './sup-allowed-keys.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const SHARED = '_shared_';
// 1) בסיס — המשותף אחרון
ok(eq(supAllowedKeys(['חינוך', 'רווחה'], SHARED), ['חינוך', 'רווחה', '_shared_']), 'דוגמה 1');
// 2) trim + דדופ + סינון-ריקים
ok(eq(supAllowedKeys([' חינוך ', 'חינוך', '', 'רווחה'], SHARED), ['חינוך', 'רווחה', '_shared_']), 'דוגמה 2');
// 3) חיתוך ל-29 + משותף = 30 (מגבלת in של Firestore)
const many = Array.from({ length: 35 }, (_, i) => 'p' + (i + 1));
const got3 = supAllowedKeys(many, SHARED);
ok(got3.length === 30, 'דוגמה 3: אורך ≠ 30');
ok(got3[0] === 'p1' && got3[28] === 'p29' && got3[29] === '_shared_', 'דוגמה 3: תוכן-החיתוך שגוי');
// 4) ריק ⇒ רק המשותף
ok(eq(supAllowedKeys([], SHARED), ['_shared_']), 'דוגמה 4');
// 5) סדר-הקלט נשמר
ok(eq(supAllowedKeys(['ב', 'א'], SHARED), ['ב', 'א', '_shared_']), 'דוגמה 5');
if (f) process.exit(1);
console.log('✓ sup-allowed-keys: 5 דוגמאות-חוזה — ירוק');
