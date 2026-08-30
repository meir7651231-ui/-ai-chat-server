// בדיקת-צילום · fam-history-of-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { FAM_HISTORY_OF_T } from './fam-history-of-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(FAM_HISTORY_OF_T), "{\"k1\":\"הצטרפות\",\"k2\":\"#e7edf5\",\"k3\":\"ה\",\"k4\":\"entity.family\",\"k5\":\"משפחה\",\"k6\":\" הצטרפה\",\"k7\":\"אירוע\",\"k8\":\"#efe7f3\",\"k9\":\"#7c3aed\",\"k10\":\" · ✓ בוצע\",\"k11\":\"entity.cred\",\"k12\":\"אמינות\",\"k13\":\"#f6ead1\",\"k14\":\" נק׳)\",\"k15\":\"מסמך\",\"k16\":\"#eceae2\",\"k17\":\"מסמך נוסף: \",\"k18\":\"entity.enrollment\",\"k19\":\"שיבוץ\",\"k20\":\"#eef7e6\",\"k21\":\"נרשמ/ה \",\"k22\":\" ל\",\"k23\":\"wait\",\"k24\":\" · ברשימת-המתנה\",\"k25\":\"תשלום\",\"k26\":\"תשלום ₪\",\"k27\":\"No-Show\",\"k28\":\"היעדרות\",\"k29\":\"#fdeaea\",\"k30\":\"היעדרות — \",\"k31\":\" · זכאי/ת השלמה\"}");
console.log('OK fam-history-of-strings');
