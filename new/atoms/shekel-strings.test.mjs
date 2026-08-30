// בדיקת-צילום · shekel-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { SHEKEL_T } from './shekel-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(SHEKEL_T), "{\"k1\":\"maor_prices\"}");
console.log('OK shekel-strings');
