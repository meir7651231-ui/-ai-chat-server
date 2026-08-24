import { PHOTO_MAX_LEN as V } from './photo-max-len.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
ok(V === 460000, 'ערך ' + V + ' ≠ 460000');
ok(typeof V === 'number', 'טיפוס ' + typeof V + ' ≠ number');
ok(Number.isInteger(V), 'לא שלם');
ok(V > 0, 'לא חיובי');
if (f) process.exit(1);
console.log('✓ photo-max-len: 4 דוגמאות-חוזה — ירוק');
