// בדיקת-צילום · reenroll-csv-rows-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { REENROLL_CSV_ROWS_T } from './reenroll-csv-rows-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(REENROLL_CSV_ROWS_T), "{\"k1\":\"yes\",\"k2\":\"ממשיך\",\"k3\":\"לא ממשיך\",\"k4\":\"hold\",\"k5\":\"בהמתנה\",\"k6\":\"כן\"}");
console.log('OK reenroll-csv-rows-strings');
