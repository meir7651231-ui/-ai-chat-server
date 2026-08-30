// בדיקת-צילום · empty-telephony-config-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { EMPTY_TELEPHONY_CONFIG_T } from './empty-telephony-config-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(EMPTY_TELEPHONY_CONFIG_T), "{\"k1\":\"קו ראשי\",\"k2\":\"sim\"}");
console.log('OK empty-telephony-config-strings');
