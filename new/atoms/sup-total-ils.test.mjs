import { supTotalIls } from './sup-total-ils.mjs';
const supIls = (sp) => sp.ils || 0;
const supUsd = (sp) => sp.usd || 0;
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
// 1) ₪ בלבד
ok(supTotalIls({ ils: 100 }, 3.7, supIls, supUsd) === 100, 'דוגמה 1: ≠ 100');
// 2) ברירת-מחדל rate=3.7
ok(supTotalIls({ usd: 10 }, undefined, supIls, supUsd) === 37, 'דוגמה 2: ≠ 37');
// 3) שער מפורש
ok(supTotalIls({ ils: 100, usd: 100 }, 4, supIls, supUsd) === 500, 'דוגמה 3: ≠ 500');
// 4) תורם ריק
ok(supTotalIls({}, 3.7, supIls, supUsd) === 0, 'דוגמה 4: ≠ 0');
// 5) לא מעוגל
ok(supTotalIls({ ils: 250, usd: 2 }, 3.7, supIls, supUsd) === 257.4, 'דוגמה 5: ≠ 257.4');
if (f) process.exit(1);
console.log('✓ sup-total-ils: 5 דוגמאות-חוזה — ירוק');
