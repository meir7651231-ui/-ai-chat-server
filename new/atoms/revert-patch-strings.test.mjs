// בדיקת-צילום · revert-patch-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { REVERT_PATCH_T } from './revert-patch-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(REVERT_PATCH_T), "{\"k1\":\"answer\"}");
console.log('OK revert-patch-strings');
