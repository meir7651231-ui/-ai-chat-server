// בדיקת-צילום · time-to-min-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { TIME_TO_MIN_T } from './time-to-min-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(TIME_TO_MIN_T), "{\"k1\":60}");
console.log('OK time-to-min-strings');
