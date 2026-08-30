// בדיקת-צילום · model-meta-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { MODEL_META_T } from './model-meta-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(MODEL_META_T), "{\"k1\":\"punch\",\"k2\":\"כרטיסייה · \",\"k3\":\" ניקובים\",\"k4\":\"#fdf1d4\",\"k5\":\"half_year\",\"k6\":\"מנוי חצי-שנתי\",\"k7\":\"#e7edf5\",\"k8\":\"year\",\"k9\":\"מנוי שנתי\",\"k10\":\"#efe7f3\",\"k11\":\"#7c3aed\",\"k12\":\"מנוי חודשי\"}");
console.log('OK model-meta-strings');
