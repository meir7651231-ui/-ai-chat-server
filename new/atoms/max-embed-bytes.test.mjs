import { MAX_EMBED_BYTES as B } from './max-embed-bytes.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
ok(B === 3145728, 'הערך ' + B + ' ≠ 3145728');
ok(B === 3 * 1024 * 1024, 'לא שווה ל-3×1024×1024');
ok(Number.isInteger(B), 'לא מספר-שלם');
ok(B > 0, 'לא חיובי');
if (f) process.exit(1);
console.log('✓ max-embed-bytes: 4 דוגמאות-חוזה — ירוק');
