// בדיקת-צילום · remove-org-member-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { REMOVE_ORG_MEMBER_T } from './remove-org-member-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(REMOVE_ORG_MEMBER_T), "{\"k1\":\"platformOrgs\"}");
console.log('OK remove-org-member-strings');
