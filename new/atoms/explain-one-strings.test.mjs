// בדיקת-צילום · explain-one-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { EXPLAIN_ONE_T } from './explain-one-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(EXPLAIN_ONE_T), "{\"k1\":\"⚠️ תצורה לא-תקינה: \",\"k2\":\"invalid\"}");
console.log('OK explain-one-strings');
