import { MAX_UPLOAD_BYTES as B } from './max-upload-bytes.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
ok(B === 8388608, 'הערך ' + B + ' ≠ 8388608');
ok(B === 8 * 1024 * 1024, 'לא שווה ל-8×1024×1024');
ok(Number.isInteger(B), 'לא מספר-שלם');
ok(B > 0, 'לא חיובי');
if (f) process.exit(1);
console.log('✓ max-upload-bytes: 4 דוגמאות-חוזה — ירוק');
