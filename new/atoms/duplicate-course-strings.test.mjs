// בדיקת-צילום · duplicate-course-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { DUPLICATE_COURSE_T } from './duplicate-course-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(DUPLICATE_COURSE_T), "{\"k1\":\" (עותק)\"}");
console.log('OK duplicate-course-strings');
