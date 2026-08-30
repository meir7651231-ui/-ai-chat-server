// בדיקת-צילום · cockpit-csv-rows-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { COCKPIT_CSV_ROWS_T } from './cockpit-csv-rows-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(COCKPIT_CSV_ROWS_T), "{\"k1\":\"שיחה\",\"k2\":\"תודה\",\"k3\":\"הו״ק\",\"k4\":\"קבוצה\",\"k5\":\"שם\",\"k6\":\"טלפון\",\"k7\":\"סיבה\"}");
console.log('OK cockpit-csv-rows-strings');
