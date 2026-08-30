// בדיקת-צילום · renew-targets-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { RENEW_TARGETS_T } from './renew-targets-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(RENEW_TARGETS_T), "{\"k1\":\"yes\"}");
console.log('OK renew-targets-strings');
