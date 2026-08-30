// בדיקת-צילום · heb-date-full-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { HEB_DATE_FULL_T } from './heb-date-full-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(HEB_DATE_FULL_T), "{\"k1\":\"he-u-ca-hebrew\",\"k2\":\"long\",\"k3\":\"numeric\",\"k4\":10}");
console.log('OK heb-date-full-strings');
