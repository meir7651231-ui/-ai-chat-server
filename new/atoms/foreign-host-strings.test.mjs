// בדיקת-צילום · foreign-host-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { FOREIGN_HOST_T } from './foreign-host-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(FOREIGN_HOST_T), "{\"k1\":\"localhost\",\"k2\":\".local\"}");
console.log('OK foreign-host-strings');
