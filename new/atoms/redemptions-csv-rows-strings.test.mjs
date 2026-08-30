// בדיקת-צילום · redemptions-csv-rows-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { REDEMPTIONS_CSV_ROWS_T } from './redemptions-csv-rows-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(REDEMPTIONS_CSV_ROWS_T), "{\"k1\":\"תאריך\",\"k2\":\"מוטב\",\"k3\":\"פריט\",\"k4\":\"חבילה\",\"k5\":\"שולם\",\"k6\":\"שווי\",\"k7\":\"אישור\",\"k8\":\"מבוטל\",\"k9\":\"בוטל ב-\"}");
console.log('OK redemptions-csv-rows-strings');
