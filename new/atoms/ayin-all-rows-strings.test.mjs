// בדיקת-צילום · ayin-all-rows-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { AYIN_ALL_ROWS_T } from './ayin-all-rows-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(AYIN_ALL_ROWS_T), "{\"k1\":\"תורם/ת\",\"k2\":\"טלפון\",\"k3\":\"שם\",\"k4\":\"הערה\",\"k5\":\"סטטוס\",\"k6\":\"שלב\",\"k7\":\"טופל ✓\",\"k8\":\"ממתין\"}");
console.log('OK ayin-all-rows-strings');
