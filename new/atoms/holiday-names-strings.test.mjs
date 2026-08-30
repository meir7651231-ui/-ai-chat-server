// בדיקת-צילום · holiday-names-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { HOLIDAY_NAMES_T } from './holiday-names-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(HOLIDAY_NAMES_T), "{\"k1\":400}");
console.log('OK holiday-names-strings');
