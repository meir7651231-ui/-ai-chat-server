// בדיקת-צילום · min-to-hm-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { MIN_TO_HM_T } from './min-to-hm-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(MIN_TO_HM_T), "{\"k1\":60}");
console.log('OK min-to-hm-strings');
