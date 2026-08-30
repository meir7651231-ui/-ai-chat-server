// בדיקת-צילום · heb-annual-eq-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { HEB_ANNUAL_EQ_T } from './heb-annual-eq-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(HEB_ANNUAL_EQ_T), "{\"k1\":\"Adar\",\"k2\":\"Adar I\",\"k3\":\"Adar II\",\"k4\":30}");
console.log('OK heb-annual-eq-strings');
