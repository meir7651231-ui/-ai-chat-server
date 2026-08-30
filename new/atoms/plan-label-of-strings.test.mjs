// בדיקת-צילום · plan-label-of-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { PLAN_LABEL_OF_T } from './plan-label-of-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(PLAN_LABEL_OF_T), "{\"k1\":\"punch\",\"k2\":\"כרטיסייה · \",\"k3\":\"paused\",\"k4\":\" · מוקפא ⏸\",\"k5\":\"ended\",\"k6\":\" · הסתיים\",\"k7\":\" חיס׳\"}");
console.log('OK plan-label-of-strings');
