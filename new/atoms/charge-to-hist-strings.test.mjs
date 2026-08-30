// בדיקת-צילום · charge-to-hist-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { CHARGE_TO_HIST_T } from './charge-to-hist-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(CHARGE_TO_HIST_T), "{\"k1\":10}");
console.log('OK charge-to-hist-strings');
