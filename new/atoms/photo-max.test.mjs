import { PHOTO_MAX as V } from './photo-max.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
ok(V === 5, 'ערך ' + V + ' ≠ 5');
ok(typeof V === 'number', 'טיפוס ' + typeof V + ' ≠ number');
ok(Number.isInteger(V), 'לא שלם');
ok(V > 0, 'לא חיובי');
if (f) process.exit(1);
console.log('✓ photo-max: 4 דוגמאות-חוזה — ירוק');
