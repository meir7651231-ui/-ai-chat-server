// בדיקת-צילום · lib-lock-terms — המונחים זהים ביט-אחר-ביט למקור.
import { LIB_LOCK_TERMS } from './lib-lock-terms.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(LIB_LOCK_TERMS), "{\"k1\":\"maor.lock.v1::\",\"k2\":\"maor_lock\"}");
console.log('OK lib-lock-terms');
