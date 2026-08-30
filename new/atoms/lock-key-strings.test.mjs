// בדיקת-צילום · lock-key-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { LOCK_KEY_T } from './lock-key-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(LOCK_KEY_T), "{\"k1\":\"maor_lock\"}");
console.log('OK lock-key-strings');
