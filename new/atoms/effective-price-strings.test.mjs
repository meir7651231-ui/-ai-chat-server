// בדיקת-צילום · effective-price-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { EFFECTIVE_PRICE_T } from './effective-price-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(EFFECTIVE_PRICE_T), "{\"k1\":100}");
console.log('OK effective-price-strings');
