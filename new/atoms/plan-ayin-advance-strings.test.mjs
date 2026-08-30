// בדיקת-צילום · plan-ayin-advance-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { PLAN_AYIN_ADVANCE_T } from './plan-ayin-advance-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(PLAN_AYIN_ADVANCE_T), "{\"k1\":\"new\",\"k2\":\"lead\",\"k3\":\"eyes\",\"k4\":\"answer\",\"k5\":\"נמסר — נרשם בלוח היומי ובכרטיס\",\"k6\":\"done\",\"k7\":\"הטיפול הושלם ✓ — נרשם בלוח\"}");
console.log('OK plan-ayin-advance-strings');
