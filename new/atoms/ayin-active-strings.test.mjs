// בדיקת-צילום · ayin-active-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { AYIN_ACTIVE_T } from './ayin-active-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(AYIN_ACTIVE_T), "{\"k1\":\"new\"}");
console.log('OK ayin-active-strings');
