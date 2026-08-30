// בדיקת-צילום · ayin-advance-label-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { AYIN_ADVANCE_LABEL_T } from './ayin-advance-label-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(AYIN_ADVANCE_LABEL_T), "{\"k1\":\"new\",\"k2\":\"lead\",\"k3\":\"✓ אישור — \",\"k4\":\"eyes\",\"k5\":\"answer\",\"k6\":\"done\",\"k7\":\"📞 דחיפה ללוח\"}");
console.log('OK ayin-advance-label-strings');
