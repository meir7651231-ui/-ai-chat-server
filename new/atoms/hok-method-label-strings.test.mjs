// בדיקת-צילום · hok-method-label-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { HOK_METHOD_LABEL_T } from './hok-method-label-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(HOK_METHOD_LABEL_T), "{\"k1\":\"bank\",\"k2\":\"הו\\\"ק בנקאית\",\"k3\":\"card\",\"k4\":\"אשראי בסליקה\",\"k5\":\"cash\",\"k6\":\"מזומן חודשי\",\"k7\":\"אחר\"}");
console.log('OK hok-method-label-strings');
