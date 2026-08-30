// בדיקת-צילום · detect-recurring-hok-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { DETECT_RECURRING_HOK_T } from './detect-recurring-hok-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(DETECT_RECURRING_HOK_T), "{\"k1\":\"card\",\"k2\":\"הו״ק \",\"k3\":\"סליקה\",\"k4\":\" (זוהה מהיסטוריה · \",\"k5\":\" חודשים)\",\"k6\":\"auto\",\"k7\":28,\"k8\":10}");
console.log('OK detect-recurring-hok-strings');
