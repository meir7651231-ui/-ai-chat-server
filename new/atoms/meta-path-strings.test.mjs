// בדיקת-צילום · meta-path-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { META_PATH_T } from './meta-path-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(META_PATH_T), "{\"k1\":\"meta/org\",\"k2\":\"orgs/\",\"k3\":\"/meta/org\"}");
console.log('OK meta-path-strings');
