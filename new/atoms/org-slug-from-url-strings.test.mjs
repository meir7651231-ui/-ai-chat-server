// בדיקת-צילום · org-slug-from-url-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { ORG_SLUG_FROM_URL_T } from './org-slug-from-url-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(ORG_SLUG_FROM_URL_T), "{\"k1\":\"org\"}");
console.log('OK org-slug-from-url-strings');
