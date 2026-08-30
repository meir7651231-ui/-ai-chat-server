// בדיקת-צילום · explain-one-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { EXPLAIN_ONE_T } from './explain-one-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(EXPLAIN_ONE_T), "{\"k1\":\"⚠️ תצורה לא-תקינה: \",\"k2\":\"invalid\",\"k3\":400}");
console.log('OK explain-one-strings');
