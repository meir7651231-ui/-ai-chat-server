// בדיקת-צילום · supporters-import-format-rows-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { SUPPORTERS_IMPORT_FORMAT_ROWS_T } from './supporters-import-format-rows-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(SUPPORTERS_IMPORT_FORMAT_ROWS_T), "{\"k1\":\"שם\",\"k2\":\"טלפון\",\"k3\":\"אימייל\",\"k4\":\"ת\\\"ז\",\"k5\":\"כתובת\",\"k6\":\"קטגוריה\",\"k7\":\"עבור\"}");
console.log('OK supporters-import-format-rows-strings');
