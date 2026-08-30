// בדיקת-צילום · platform-terms — המונחים זהים ביט-אחר-ביט למקור.
import { PLATFORM_TERMS } from './platform-terms.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(PLATFORM_TERMS), "{\"k1\":\"default\",\"k2\":\"or-rishon\"}");
console.log('OK platform-terms');
