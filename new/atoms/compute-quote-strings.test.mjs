// בדיקת-צילום · compute-quote-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { COMPUTE_QUOTE_T } from './compute-quote-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(COMPUTE_QUOTE_T), "{\"k1\":\"module\",\"k2\":\"integration\",\"k3\":\"subscription\"}");
console.log('OK compute-quote-strings');
