// בדיקת-צילום · done-today-for-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { DONE_TODAY_FOR_T } from './done-today-for-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(DONE_TODAY_FOR_T), "{\"k1\":10}");
console.log('OK done-today-for-strings');
