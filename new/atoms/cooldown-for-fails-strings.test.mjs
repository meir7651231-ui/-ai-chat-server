// בדיקת-צילום · cooldown-for-fails-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { COOLDOWN_FOR_FAILS_T } from './cooldown-for-fails-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(COOLDOWN_FOR_FAILS_T), "{\"k1\":30000,\"k2\":15000,\"k3\":5000}");
console.log('OK cooldown-for-fails-strings');
