// בדיקת-צילום · decode-csv-buffer-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { DECODE_CSV_BUFFER_T } from './decode-csv-buffer-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(DECODE_CSV_BUFFER_T), "{\"k1\":\"utf-16le\",\"k2\":\"utf-16be\",\"k3\":\"utf-8\",\"k4\":\"windows-1255\",\"k5\":255,\"k6\":254,\"k7\":400}");
console.log('OK decode-csv-buffer-strings');
