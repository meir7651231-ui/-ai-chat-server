import { SCALE_MIN } from './scale-min.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
ok(SCALE_MIN === 0.8, 'הערך ' + SCALE_MIN + ' ≠ 0.8');
ok(Number.isFinite(SCALE_MIN), 'לא מספר סופי');
ok(SCALE_MIN > 0 && SCALE_MIN < 1, 'הרצפה לא בין 0 ל-1');
if (f) process.exit(1);
console.log('✓ scale-min: 3 דוגמאות-חוזה — ירוק');
