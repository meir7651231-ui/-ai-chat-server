// בדיקת-צילום · parse-any-date-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { PARSE_ANY_DATE_T } from './parse-any-date-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(PARSE_ANY_DATE_T), "{\"k1\":12,\"k2\":31,\"k3\":100,\"k4\":10,\"k5\":2000,\"k6\":1900,\"k7\":1899,\"k8\":11,\"k9\":30}");
console.log('OK parse-any-date-strings');
