// בדיקת-צילום · integration-setting-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { INTEGRATION_SETTING_T } from './integration-setting-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(INTEGRATION_SETTING_T), "{\"k1\":\"string\"}");
console.log('OK integration-setting-strings');
