// בדיקת-צילום · role-of-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { ROLE_OF_T } from './role-of-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(ROLE_OF_T), "{\"k1\":\"staff\",\"k2\":\"admin\",\"k3\":\"teacher\"}");
console.log('OK role-of-strings');
