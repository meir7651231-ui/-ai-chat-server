// בדיקת-צילום · lessons-in-term-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { LESSONS_IN_TERM_T } from './lessons-in-term-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(LESSONS_IN_TERM_T), "{\"k1\":\"week\",\"k2\":\"month\",\"k3\":\"once\",\"k4\":\"weekly\",\"k5\":\"biweekly\",\"k6\":\"monthly\",\"k7\":\"months\",\"k8\":\"half_year\",\"k9\":\"year\"}");
console.log('OK lessons-in-term-strings');
