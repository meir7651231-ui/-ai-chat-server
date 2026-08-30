// בדיקת-צילום · safe-https-url-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { SAFE_HTTPS_URL_T } from './safe-https-url-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(SAFE_HTTPS_URL_T), "{\"k1\":\"https:\"}");
console.log('OK safe-https-url-strings');
