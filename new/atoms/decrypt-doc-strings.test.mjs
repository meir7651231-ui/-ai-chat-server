// בדיקת-צילום · decrypt-doc-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { DECRYPT_DOC_T } from './decrypt-doc-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(DECRYPT_DOC_T), "{\"k1\":\"AES-GCM\"}");
console.log('OK decrypt-doc-strings');
