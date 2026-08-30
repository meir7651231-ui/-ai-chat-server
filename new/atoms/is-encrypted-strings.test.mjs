// בדיקת-צילום · is-encrypted-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { IS_ENCRYPTED_T } from './is-encrypted-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(IS_ENCRYPTED_T), "{\"k1\":\"object\"}");
console.log('OK is-encrypted-strings');
