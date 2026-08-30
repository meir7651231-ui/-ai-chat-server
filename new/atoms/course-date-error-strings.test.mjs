// בדיקת-צילום · course-date-error-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { COURSE_DATE_ERROR_T } from './course-date-error-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(COURSE_DATE_ERROR_T), "{\"k1\":\"entity.course\",\"k2\":\"חוג\",\"k3\":\"תאריך הסיום מוקדם מתאריך ההתחלה — ה\",\"k4\":\" לא יופיע בלוח. תקנו את התאריכים\"}");
console.log('OK course-date-error-strings');
