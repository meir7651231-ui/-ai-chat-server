// בדיקת-צילום · wa-digits-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { WA_DIGITS_T } from './wa-digits-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(WA_DIGITS_T), "{\"k1\":10,\"k2\":15}");
console.log('OK wa-digits-strings');
