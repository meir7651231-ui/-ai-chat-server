// בדיקת-צילום · create-cloud-key-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { CREATE_CLOUD_KEY_T } from './create-cloud-key-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(CREATE_CLOUD_KEY_T), "{\"k1\":\"pass\",\"k2\":\"יצירת מפתח-הצפנה נכשלה\"}");
console.log('OK create-cloud-key-strings');
