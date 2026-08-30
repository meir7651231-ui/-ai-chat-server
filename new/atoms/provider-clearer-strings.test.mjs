// בדיקת-צילום · provider-clearer-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { PROVIDER_CLEARER_T } from './provider-clearer-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(PROVIDER_CLEARER_T), "{\"k1\":\"סולה\",\"k2\":\"נדרים\"}");
console.log('OK provider-clearer-strings');
