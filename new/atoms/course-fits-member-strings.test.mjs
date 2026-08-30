// בדיקת-צילום · course-fits-member-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { COURSE_FITS_MEMBER_T } from './course-fits-member-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(COURSE_FITS_MEMBER_T), "{\"k1\":\"all\"}");
console.log('OK course-fits-member-strings');
