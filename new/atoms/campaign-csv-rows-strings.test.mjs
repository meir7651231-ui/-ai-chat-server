// בדיקת-צילום · campaign-csv-rows-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { CAMPAIGN_CSV_ROWS_T } from './campaign-csv-rows-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(CAMPAIGN_CSV_ROWS_T), "{\"k1\":\"שם\",\"k2\":\"תוצאה\",\"k3\":\"הערה\",\"k4\":\"מתי\"}");
console.log('OK campaign-csv-rows-strings');
