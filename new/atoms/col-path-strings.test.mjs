// בדיקת-צילום · col-path-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { COL_PATH_T } from './col-path-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(COL_PATH_T), "{\"k1\":\"orgs/\"}");
console.log('OK col-path-strings');
