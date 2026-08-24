import { PHOTO_MAX_DIM as V } from './photo-max-dim.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
ok(V === 800, 'ערך ' + V + ' ≠ 800');
ok(typeof V === 'number', 'טיפוס ' + typeof V + ' ≠ number');
ok(Number.isInteger(V), 'לא שלם');
ok(V > 0, 'לא חיובי');
if (f) process.exit(1);
console.log('✓ photo-max-dim: 4 דוגמאות-חוזה — ירוק');
