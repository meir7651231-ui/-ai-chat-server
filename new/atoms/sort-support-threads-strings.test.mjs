// בדיקת-צילום · sort-support-threads-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { SORT_SUPPORT_THREADS_T } from './sort-support-threads-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(SORT_SUPPORT_THREADS_T), "{\"k1\":\"admin\",\"k2\":\"number\"}");
console.log('OK sort-support-threads-strings');
