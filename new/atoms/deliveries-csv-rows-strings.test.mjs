// בדיקת-צילום · deliveries-csv-rows-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { DELIVERIES_CSV_ROWS_T } from './deliveries-csv-rows-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(DELIVERIES_CSV_ROWS_T), "{\"k1\":\"תאריך\",\"k2\":\"entity.family\",\"k3\":\"משפחה\",\"k4\":\"כתובת\",\"k5\":\"מתנדב\",\"k6\":\"סטטוס\",\"k7\":\"הערה\"}");
console.log('OK deliveries-csv-rows-strings');
