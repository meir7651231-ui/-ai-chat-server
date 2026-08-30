// בדיקת-צילום · fetch-org-join-requests-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { FETCH_ORG_JOIN_REQUESTS_T } from './fetch-org-join-requests-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(FETCH_ORG_JOIN_REQUESTS_T), "{\"k1\":\"platformOrgs\",\"k2\":\"joinRequests\"}");
console.log('OK fetch-org-join-requests-strings');
