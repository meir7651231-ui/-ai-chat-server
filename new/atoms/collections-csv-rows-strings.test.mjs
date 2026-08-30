// בדיקת-צילום · collections-csv-rows-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { COLLECTIONS_CSV_ROWS_T } from './collections-csv-rows-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(COLLECTIONS_CSV_ROWS_T), "{\"k1\":\"תאריך\",\"k2\":\"רכז\",\"k3\":\"קופה\",\"k4\":\"entity.family\",\"k5\":\"משפחה\",\"k6\":\"סכום\",\"k7\":\"מבצע\"}");
console.log('OK collections-csv-rows-strings');
