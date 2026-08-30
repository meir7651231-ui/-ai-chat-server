// בדיקת-צילום · build-reenroll-rows-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { BUILD_REENROLL_ROWS_T } from './build-reenroll-rows-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(BUILD_REENROLL_ROWS_T), "{\"k1\":\"undecided\"}");
console.log('OK build-reenroll-rows-strings');
