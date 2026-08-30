// בדיקת-צילום · wheel-index-under-pointer-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { WHEEL_INDEX_UNDER_POINTER_T } from './wheel-index-under-pointer-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(WHEEL_INDEX_UNDER_POINTER_T), "{\"k1\":360}");
console.log('OK wheel-index-under-pointer-strings');
