import { supAvgDon } from './sup-avg-don.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
// שקעי-הבדיקה כמוגדר בחוזה (סמנטיקת-המקור המצומצמת לדוגמאות)
const totIls = (sp, r) => (sp.ils || 0) + (sp.usd || 0) * r;
const cnt = (sp) => sp.count || 0;
// 1) ממוצע בסיסי
ok(supAvgDon([{ ils: 400, count: 2 }, { ils: 200, count: 1 }], 3.7, totIls, cnt) === 200, 'דוגמה 1: ≠ 200');
// 2) עיגול-מטה
ok(supAvgDon([{ ils: 1000, count: 3 }], 3.7, totIls, cnt) === 333, 'דוגמה 2: ≠ 333');
// 3) עיגול-מעלה
ok(supAvgDon([{ ils: 500, count: 3 }], 3.7, totIls, cnt) === 167, 'דוגמה 3: ≠ 167');
// 4) אפס תרומות ⇒ null
ok(supAvgDon([{ ils: 0, count: 0 }, { ils: 0, count: 0 }], 3.7, totIls, cnt) === null, 'דוגמה 4: ≠ null');
// 5) השער זורם לשקע
ok(supAvgDon([{ ils: 100, usd: 100, count: 1 }], 4, totIls, cnt) === 500, 'דוגמה 5: ≠ 500');
// 6) ברירת-מחדל rate=3.7
ok(supAvgDon([{ ils: 0, usd: 10, count: 1 }], undefined, totIls, cnt) === 37, 'דוגמה 6: ≠ 37');
if (f) process.exit(1);
console.log('✓ sup-avg-don: 6 דוגמאות-חוזה — ירוק');
