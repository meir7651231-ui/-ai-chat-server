// בדיקת-צילום · supporters-terms — המונחים זהים ביט-אחר-ביט למקור.
import { SUPPORTERS_TERMS } from './supporters-terms.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(SUPPORTERS_TERMS), "{\"k1\":\"new\",\"k2\":\"hist\"}");
console.log('OK supporters-terms');
