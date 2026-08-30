// בדיקת-צילום · read-file-as-data-url-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { READ_FILE_AS_DATA_URL_T } from './read-file-as-data-url-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(READ_FILE_AS_DATA_URL_T), "{\"k1\":\"הקובץ גדול מדי להטמעה (מקסימום \",\"k2\":\"MB) — הוסיפו קישור במקום\"}");
console.log('OK read-file-as-data-url-strings');
