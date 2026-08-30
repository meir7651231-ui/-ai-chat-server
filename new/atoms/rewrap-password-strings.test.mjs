// בדיקת-צילום · rewrap-password-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { REWRAP_PASSWORD_T } from './rewrap-password-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(REWRAP_PASSWORD_T), "{\"k1\":\"raw\"}");
console.log('OK rewrap-password-strings');
