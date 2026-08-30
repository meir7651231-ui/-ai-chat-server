// בדיקת-צילום · makeup-eligibility-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { MAKEUP_ELIGIBILITY_T } from './makeup-eligibility-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(MAKEUP_ELIGIBILITY_T), "{\"k1\":\"noshow\",\"k2\":48}");
console.log('OK makeup-eligibility-strings');
