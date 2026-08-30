// בדיקת-צילום · build-custom-export-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { BUILD_CUSTOM_EXPORT_T } from './build-custom-export-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(BUILD_CUSTOM_EXPORT_T), "{\"k1\":\"courses\",\"k2\":\"יום \",\"k3\":\"punch\",\"k4\":\"כרטיסייה\",\"k5\":\"half_year\",\"k6\":\"מנוי חצי-שנתי\",\"k7\":\"year\",\"k8\":\"מנוי שנתי\",\"k9\":\"מנוי חודשי\",\"k10\":\" · יתרה ₪\",\"k11\":\" תשלומים · ₪\",\"k12\":\" חיסורים\",\"k13\":\"events\",\"k14\":\"כן\",\"k15\":\"לא\",\"k16\":\"supporters.ayin\",\"k17\":\"entity.donations\",\"k18\":\"תרומות\"}");
console.log('OK build-custom-export-strings');
