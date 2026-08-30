// בדיקת-צילום · sanitize-support-text-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { SANITIZE_SUPPORT_TEXT_T } from './sanitize-support-text-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(SANITIZE_SUPPORT_TEXT_T), "{\"k1\":2000}");
console.log('OK sanitize-support-text-strings');
