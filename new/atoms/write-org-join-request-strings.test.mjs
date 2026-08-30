// בדיקת-צילום · write-org-join-request-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { WRITE_ORG_JOIN_REQUEST_T } from './write-org-join-request-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(WRITE_ORG_JOIN_REQUEST_T), "{\"k1\":\"platformOrgs\",\"k2\":\"joinRequests\"}");
console.log('OK write-org-join-request-strings');
