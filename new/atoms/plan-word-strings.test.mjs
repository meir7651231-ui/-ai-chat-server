// בדיקת-צילום · plan-word-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { PLAN_WORD_T } from './plan-word-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(PLAN_WORD_T), "{\"k1\":\"punch\",\"k2\":\"כרטיסייה\",\"k3\":\"half_year\",\"k4\":\"מנוי חצי-שנתי\",\"k5\":\"year\",\"k6\":\"מנוי שנתי\",\"k7\":\"מנוי חודשי\"}");
console.log('OK plan-word-strings');
