// בדיקת-צילום · resolve-enroll-family-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { RESOLVE_ENROLL_FAMILY_T } from './resolve-enroll-family-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(RESOLVE_ENROLL_FAMILY_T), "{\"k1\":\"__new\"}");
console.log('OK resolve-enroll-family-strings');
