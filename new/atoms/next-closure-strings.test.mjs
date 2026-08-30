// בדיקת-צילום · next-closure-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { NEXT_CLOSURE_T } from './next-closure-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(NEXT_CLOSURE_T), "{\"k1\":\"default\",\"k2\":\"Asia/Jerusalem\"}");
console.log('OK next-closure-strings');
