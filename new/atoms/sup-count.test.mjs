import { supCount } from './sup-count.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
// 1) מונה שמור בלבד
ok(supCount({ count: 5 }) === 5, 'דוגמה 1: {count:5} ≠ 5');
// 2) קבלות + היסטוריה
ok(supCount({ count: 2, hist: [{ a: 100 }, { a: 50 }] }) === 4, 'דוגמה 2: 2+2 ≠ 4');
// 3) רק שורות-חיוב חיוביות
ok(supCount({ count: 0, hist: [{ a: 0 }, { a: -30 }, { a: 80 }] }) === 1, 'דוגמה 3: אפס/זיכוי נספרו');
// 4) אובייקט ריק
ok(supCount({}) === 0, 'דוגמה 4: {} ≠ 0');
// 5) hist ריק
ok(supCount({ count: 3, hist: [] }) === 3, 'דוגמה 5: hist ריק שיבש את המונה');
// 6) שורה בלי a
ok(supCount({ count: 1, hist: [{}] }) === 1, 'דוגמה 6: שורה בלי a נספרה');
if (f) process.exit(1);
console.log('✓ sup-count: 6 דוגמאות-חוזה — ירוק');
