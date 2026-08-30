// בדיקת-צילום · enroll-count-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { ENROLL_COUNT_T } from './enroll-count-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(ENROLL_COUNT_T), "{\"k1\":\"ended\",\"k2\":\"wait\"}");
console.log('OK enroll-count-strings');
