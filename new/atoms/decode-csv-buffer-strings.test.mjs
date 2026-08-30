// בדיקת-צילום · decode-csv-buffer-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { DECODE_CSV_BUFFER_T } from './decode-csv-buffer-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(DECODE_CSV_BUFFER_T), "{\"k1\":\"utf-16le\",\"k2\":\"utf-16be\",\"k3\":\"utf-8\",\"k4\":\"windows-1255\"}");
console.log('OK decode-csv-buffer-strings');
