// בדיקת-צילום · caller-id-terms — המונחים זהים ביט-אחר-ביט למקור.
import { CALLER_ID_TERMS } from './caller-id-terms.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(CALLER_ID_TERMS), "{\"k1\":\"family\",\"k2\":\"member\"}");
console.log('OK caller-id-terms');
