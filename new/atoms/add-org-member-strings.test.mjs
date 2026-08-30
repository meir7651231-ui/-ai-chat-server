// בדיקת-צילום · add-org-member-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { ADD_ORG_MEMBER_T } from './add-org-member-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(ADD_ORG_MEMBER_T), "{\"k1\":\"platformOrgs\"}");
console.log('OK add-org-member-strings');
