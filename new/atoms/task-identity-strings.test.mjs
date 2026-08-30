// בדיקת-צילום · task-identity-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { TASK_IDENTITY_T } from './task-identity-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(TASK_IDENTITY_T), "{\"k1\":\"מקומי\"}");
console.log('OK task-identity-strings');
