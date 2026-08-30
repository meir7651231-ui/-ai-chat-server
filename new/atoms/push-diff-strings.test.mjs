// בדיקת-צילום · push-diff-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { PUSH_DIFF_T } from './push-diff-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(PUSH_DIFF_T), "{\"k1\":400}");
console.log('OK push-diff-strings');
