import { DONATIONS_COL as C } from './donations-col.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
ok(C === 'donations', 'הערך ' + JSON.stringify(C) + " ≠ 'donations'");
ok(C.length === 9, 'אורך ' + C.length + ' ≠ 9');
ok(/^[a-z]+$/.test(C), 'לא אותיות-לטיניות-קטנות בלבד');
ok(!C.includes('/'), "מכיל '/' — לא מקטע-נתיב יחיד");
if (f) process.exit(1);
console.log('✓ donations-col: 4 דוגמאות-חוזה — ירוק');
