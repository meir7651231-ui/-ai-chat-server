// בדיקת-צילום · heb-parts-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { HEB_PARTS_T } from './heb-parts-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(HEB_PARTS_T), "{\"k1\":\"en-u-ca-hebrew\",\"k2\":\"numeric\",\"k3\":\"long\",\"k4\":\"day\",\"k5\":\"month\",\"k6\":\"year\"}");
console.log('OK heb-parts-strings');
