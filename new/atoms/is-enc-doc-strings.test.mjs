// בדיקת-צילום · is-enc-doc-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { IS_ENC_DOC_T } from './is-enc-doc-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(IS_ENC_DOC_T), "{\"k1\":\"object\",\"k2\":\"string\"}");
console.log('OK is-enc-doc-strings');
