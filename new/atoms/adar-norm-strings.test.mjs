// בדיקת-צילום · adar-norm-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { ADAR_NORM_T } from './adar-norm-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(ADAR_NORM_T), "{\"k1\":\"Adar II\",\"k2\":\"Adar\"}");
console.log('OK adar-norm-strings');
