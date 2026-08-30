// בדיקת-צילום · round2-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { ROUND2_T } from './round2-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(ROUND2_T), "{\"k1\":100}");
console.log('OK round2-strings');
