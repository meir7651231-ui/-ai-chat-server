// בדיקת-צילום · families-import-format-rows-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { FAMILIES_IMPORT_FORMAT_ROWS_T } from './families-import-format-rows-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(FAMILIES_IMPORT_FORMAT_ROWS_T), "{\"k1\":\"שם\",\"k2\":\"ת\\\"ז אב\",\"k3\":\"טלפון\",\"k4\":\"שם האם\",\"k5\":\"ת\\\"ז אם\",\"k6\":\"טלפון 2\",\"k7\":\"עיר\",\"k8\":\"כתובת\",\"k9\":\"אלמן\",\"k10\":\"קהילה\",\"k11\":\"הערות\"}");
console.log('OK families-import-format-rows-strings');
