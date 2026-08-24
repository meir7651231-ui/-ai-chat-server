import { NAV_HIST_MAX as N } from './nav-hist-max.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
ok(N === 20, 'הערך ' + N + ' ≠ 20');
ok(Number.isInteger(N), 'לא מספר-שלם');
ok(N > 0, 'לא חיובי');
if (f) process.exit(1);
console.log('✓ nav-hist-max: 3 דוגמאות-חוזה — ירוק');
