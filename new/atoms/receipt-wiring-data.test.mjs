// בדיקת-צילום · receipt-wiring-data — הערכים זהים ביט-אחר-ביט למקור בקופסה.
import * as D from './receipt-wiring-data.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify([D.REVOKE_MS, D.FRAME_MS]), JSON.stringify([5000, 60_000]));
console.log('OK receipt-wiring-data');
