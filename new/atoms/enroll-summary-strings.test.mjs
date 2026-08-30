// בדיקת-צילום · enroll-summary-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { ENROLL_SUMMARY_T } from './enroll-summary-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(ENROLL_SUMMARY_T), "{\"k1\":\"פעיל\",\"k2\":\"מושהה\",\"k3\":\"הסתיים\",\"k4\":\"רשימת-המתנה\"}");
console.log('OK enroll-summary-strings');
