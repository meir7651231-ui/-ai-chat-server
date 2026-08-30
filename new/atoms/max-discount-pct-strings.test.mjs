// בדיקת-צילום · max-discount-pct-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { MAX_DISCOUNT_PCT_T } from './max-discount-pct-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(MAX_DISCOUNT_PCT_T), "{\"k1\":100}");
console.log('OK max-discount-pct-strings');
