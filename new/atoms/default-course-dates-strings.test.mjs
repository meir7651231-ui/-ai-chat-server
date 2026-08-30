// בדיקת-צילום · default-course-dates-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { DEFAULT_COURSE_DATES_T } from './default-course-dates-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(DEFAULT_COURSE_DATES_T), "{\"k1\":10}");
console.log('OK default-course-dates-strings');
