// בדיקת-צילום · phone-region-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { PHONE_REGION_T } from './phone-region-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(PHONE_REGION_T), "{\"k1\":\"intl\"}");
console.log('OK phone-region-strings');
