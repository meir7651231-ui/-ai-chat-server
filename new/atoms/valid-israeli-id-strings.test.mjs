// בדיקת-צילום · valid-israeli-id-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { VALID_ISRAELI_ID_T } from './valid-israeli-id-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(VALID_ISRAELI_ID_T), "{\"k1\":10}");
console.log('OK valid-israeli-id-strings');
