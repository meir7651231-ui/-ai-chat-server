// בדיקת-צילום · watch-org-cloud-config-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { WATCH_ORG_CLOUD_CONFIG_T } from './watch-org-cloud-config-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(WATCH_ORG_CLOUD_CONFIG_T), "{\"k1\":\"platformOrgs\"}");
console.log('OK watch-org-cloud-config-strings');
