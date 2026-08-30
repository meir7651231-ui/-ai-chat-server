// בדיקת-צילום · format-israeli-phone-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { FORMAT_ISRAELI_PHONE_T } from './format-israeli-phone-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(FORMAT_ISRAELI_PHONE_T), "{\"k1\":10}");
console.log('OK format-israeli-phone-strings');
