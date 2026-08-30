// בדיקת-צילום · support-preview-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { SUPPORT_PREVIEW_T } from './support-preview-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(SUPPORT_PREVIEW_T), "{\"k1\":40}");
console.log('OK support-preview-strings');
