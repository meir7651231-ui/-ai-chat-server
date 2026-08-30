// בדיקת-צילום · distribution-terms — המונחים זהים ביט-אחר-ביט למקור.
import { DISTRIBUTION_TERMS } from './distribution-terms.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(DISTRIBUTION_TERMS), "{\"k1\":\"pickup\",\"k2\":\"enroute\"}");
console.log('OK distribution-terms');
