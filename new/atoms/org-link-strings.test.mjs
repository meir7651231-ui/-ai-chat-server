// בדיקת-צילום · org-link-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { ORG_LINK_T } from './org-link-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(ORG_LINK_T), "{\"k1\":\"?org=\"}");
console.log('OK org-link-strings');
