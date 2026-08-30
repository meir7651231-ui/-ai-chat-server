// בדיקת-צילום · org-join-link-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { ORG_JOIN_LINK_T } from './org-join-link-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(ORG_JOIN_LINK_T), "{\"k1\":\"?org=\",\"k2\":\"&join=\"}");
console.log('OK org-join-link-strings');
