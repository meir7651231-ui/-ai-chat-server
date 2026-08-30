// בדיקת-צילום · don-allowed-keys-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { DON_ALLOWED_KEYS_T } from './don-allowed-keys-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(DON_ALLOWED_KEYS_T), "{\"k1\":29}");
console.log('OK don-allowed-keys-strings');
