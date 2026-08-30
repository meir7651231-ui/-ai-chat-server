// בדיקת-צילום · csvx-wiring-data — הערכים זהים ביט-אחר-ביט למקור בקופסה.
import * as D from './csvx-wiring-data.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify([D.REVOKE_MS]), JSON.stringify([5000]));
console.log('OK csvx-wiring-data');
