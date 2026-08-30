// בדיקת-צילום · price-suffix-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { PRICE_SUFFIX_T } from './price-suffix-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(PRICE_SUFFIX_T), "{\"k1\":\"half_year\",\"k2\":\"לחצי שנה\",\"k3\":\"year\",\"k4\":\"לשנה\",\"k5\":\"punch\",\"k6\":\"לחודש\"}");
console.log('OK price-suffix-strings');
