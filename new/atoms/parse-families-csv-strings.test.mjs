// בדיקת-צילום · parse-families-csv-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { PARSE_FAMILIES_CSV_T } from './parse-families-csv-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(PARSE_FAMILIES_CSV_T), "{\"k1\":\"שם פרטי שם משפחה\",\"k2\":\"#NAME?\",\"k3\":\"רגיל\",\"k4\":\"ביתר\",\"k5\":\"ביתר עלית\",\"k6\":\"ביתר עילית\",\"k7\":\"לא פעיל\",\"k8\":\"inactive\",\"k9\":\"active\",\"k10\":\"אלמנ\",\"k11\":\"אלמן\",\"k12\":\"אלמן/ה\",\"k13\":\"גרוש\",\"k14\":\"גרושים\",\"k15\":\"נשואים\",\"k16\":\"עברית\",\"k17\":\"חסידי\",\"k18\":\"השתתפה ביריד חנוכה תשפ\\\"ו\"}");
console.log('OK parse-families-csv-strings');
