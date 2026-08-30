// בדיקת-צילום · family-context-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { FAMILY_CONTEXT_T } from './family-context-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(FAMILY_CONTEXT_T), "{\"k1\":\"delivered\",\"k2\":\"active\"}");
console.log('OK family-context-strings');
