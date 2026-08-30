// בדיקת-צילום · upcoming-holidays-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { UPCOMING_HOLIDAYS_T } from './upcoming-holidays-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(UPCOMING_HOLIDAYS_T), "{\"k1\":45}");
console.log('OK upcoming-holidays-strings');
