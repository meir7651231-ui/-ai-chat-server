import { SCALE_MAX } from './scale-max.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
ok(SCALE_MAX === 1.6, 'הערך ' + SCALE_MAX + ' ≠ 1.6');
ok(Number.isFinite(SCALE_MAX), 'לא מספר סופי');
ok(SCALE_MAX > 1, 'התקרה לא מעל 1');
if (f) process.exit(1);
console.log('✓ scale-max: 3 דוגמאות-חוזה — ירוק');
