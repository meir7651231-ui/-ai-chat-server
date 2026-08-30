// בדיקת-צילום · encrypt-doc-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { ENCRYPT_DOC_T } from './encrypt-doc-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(ENCRYPT_DOC_T), "{\"k1\":\"AES-GCM\",\"k2\":12}");
console.log('OK encrypt-doc-strings');
