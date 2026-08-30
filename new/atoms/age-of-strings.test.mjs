// בדיקת-צילום · age-of-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { AGE_OF_T } from './age-of-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(AGE_OF_T), "{\"k1\":10}");
console.log('OK age-of-strings');
