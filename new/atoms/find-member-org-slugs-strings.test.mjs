// בדיקת-צילום · find-member-org-slugs-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { FIND_MEMBER_ORG_SLUGS_T } from './find-member-org-slugs-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(FIND_MEMBER_ORG_SLUGS_T), "{\"k1\":\"platformOrgs\",\"k2\":\"members\",\"k3\":\"array-contains\"}");
console.log('OK find-member-org-slugs-strings');
