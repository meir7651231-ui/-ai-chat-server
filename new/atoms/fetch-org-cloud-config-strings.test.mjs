// בדיקת-צילום · fetch-org-cloud-config-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { FETCH_ORG_CLOUD_CONFIG_T } from './fetch-org-cloud-config-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(FETCH_ORG_CLOUD_CONFIG_T), "{\"k1\":\"platformOrgs\"}");
console.log('OK fetch-org-cloud-config-strings');
