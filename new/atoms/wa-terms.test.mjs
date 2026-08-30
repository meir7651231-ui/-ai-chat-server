// בדיקת-צילום · wa-terms — המונחים זהים ביט-אחר-ביט למקור.
import { WA_TERMS } from './wa-terms.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(WA_TERMS), "{\"k1\":\"העמותה\"}");
console.log('OK wa-terms');
