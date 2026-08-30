// בדיקת-צילום · strip-sup-key-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { STRIP_SUP_KEY_T } from './strip-sup-key-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(STRIP_SUP_KEY_T), "{\"k1\":\"skey\"}");
console.log('OK strip-sup-key-strings');
