// בדיקת-צילום · integer-in-words-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { INTEGER_IN_WORDS_T } from './integer-in-words-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(INTEGER_IN_WORDS_T), "{\"k1\":\"אפס\",\"k2\":\"מיליון\",\"k3\":\"שני מיליון\",\"k4\":\" מיליון\",\"k5\":999999999,\"k6\":1000000,\"k7\":1000}");
console.log('OK integer-in-words-strings');
