// בדיקת-צילום · find-all-open-plans-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { FIND_ALL_OPEN_PLANS_T } from './find-all-open-plans-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(FIND_ALL_OPEN_PLANS_T), "{\"k1\":\"supporter\",\"k2\":\"enrollment\",\"k3\":\"shopAssignment\"}");
console.log('OK find-all-open-plans-strings');
