// בדיקת-צילום · delete-org-member-config-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { DELETE_ORG_MEMBER_CONFIG_T } from './delete-org-member-config-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(DELETE_ORG_MEMBER_CONFIG_T), "{\"k1\":\"platformOrgs\",\"k2\":\"memberConfigs\"}");
console.log('OK delete-org-member-config-strings');
