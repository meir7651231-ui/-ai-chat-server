// בדיקת-צילום · sup-allowed-keys-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { SUP_ALLOWED_KEYS_T } from './sup-allowed-keys-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(SUP_ALLOWED_KEYS_T), "{\"k1\":29}");
console.log('OK sup-allowed-keys-strings');
