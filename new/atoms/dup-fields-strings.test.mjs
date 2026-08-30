// בדיקת-צילום · dup-fields-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { DUP_FIELDS_T } from './dup-fields-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(DUP_FIELDS_T), "{\"k1\":\"name\",\"k2\":\"שם משפחה\",\"k3\":\"mother\",\"k4\":\"שם האם\",\"k5\":\"father\",\"k6\":\"שם האב\",\"k7\":\"phone\",\"k8\":\"טלפון\",\"k9\":\"phone2\",\"k10\":\"טלפון 2\",\"k11\":\"email\",\"k12\":\"אימייל\",\"k13\":\"city\",\"k14\":\"עיר\",\"k15\":\"address\",\"k16\":\"כתובת\",\"k17\":\"motherId\",\"k18\":\"ת\\\"ז אם\",\"k19\":\"fatherId\",\"k20\":\"ת\\\"ז אב\",\"k21\":\"community\",\"k22\":\"קהילה\",\"k23\":\"language\",\"k24\":\"שפה\",\"k25\":\"maritalStatus\",\"k26\":\"מצב משפחתי\",\"k27\":\"status\",\"k28\":\"סטטוס\",\"k29\":\"kidsHome\",\"k30\":\"ילדים בבית\",\"k31\":\"kidsMarried\",\"k32\":\"ילדים נשואים\",\"k33\":\"createdAt\",\"k34\":\"נרשמה\",\"k35\":\"notes\",\"k36\":\"הערות\"}");
console.log('OK dup-fields-strings');
