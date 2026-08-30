// בדיקת-צילום · plan-add-name-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { PLAN_ADD_NAME_T } from './plan-add-name-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(PLAN_ADD_NAME_T), "{\"k1\":\"הקלידו שם לפני ההוספה\"}");
console.log('OK plan-add-name-strings');
