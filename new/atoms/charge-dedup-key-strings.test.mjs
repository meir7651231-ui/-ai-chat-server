// בדיקת-צילום · charge-dedup-key-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { CHARGE_DEDUP_KEY_T } from './charge-dedup-key-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(CHARGE_DEDUP_KEY_T), "{\"k1\":\"txn:\",\"k2\":\"ref:\"}");
console.log('OK charge-dedup-key-strings');
