// בדיקת-צילום · normalize-prices-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { NORMALIZE_PRICES_T } from './normalize-prices-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(NORMALIZE_PRICES_T), "{\"k1\":\"object\",\"k2\":\"number\"}");
console.log('OK normalize-prices-strings');
