// בדיקת-צילום · doc-skey-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { DOC_SKEY_T } from './doc-skey-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(DOC_SKEY_T), "{\"k1\":\"supporters\",\"k2\":\"events\",\"k3\":\"string\"}");
console.log('OK doc-skey-strings');
