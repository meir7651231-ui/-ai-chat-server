// בדיקת-צילום · enroll-new-family-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { ENROLL_NEW_FAMILY_T } from './enroll-new-family-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(ENROLL_NEW_FAMILY_T), "{\"k1\":\"__new\",\"k2\":\"כ\",\"k3\":\"מ\",\"k4\":\"נ\",\"k5\":\"פ\",\"k6\":\"צ\"}");
console.log('OK enroll-new-family-strings');
