// בדיקת-צילום · normalize-telephony-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { NORMALIZE_TELEPHONY_T } from './normalize-telephony-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(NORMALIZE_TELEPHONY_T), "{\"k1\":\"object\",\"k2\":\"sim\",\"k3\":\"string\",\"k4\":\"boolean\"}");
console.log('OK normalize-telephony-strings');
