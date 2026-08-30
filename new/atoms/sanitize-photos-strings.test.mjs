// בדיקת-צילום · sanitize-photos-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { SANITIZE_PHOTOS_T } from './sanitize-photos-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(SANITIZE_PHOTOS_T), "{\"k1\":460000}");
console.log('OK sanitize-photos-strings');
