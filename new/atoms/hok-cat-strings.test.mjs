// בדיקת-צילום · hok-cat-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { HOK_CAT_T } from './hok-cat-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(HOK_CAT_T), "{\"k1\":\"הו\\\"ק\",\"k2\":12}");
console.log('OK hok-cat-strings');
