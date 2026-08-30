// בדיקת-צילום · append-call-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { APPEND_CALL_T } from './append-call-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(APPEND_CALL_T), "{\"k1\":\"skip\"}");
console.log('OK append-call-strings');
