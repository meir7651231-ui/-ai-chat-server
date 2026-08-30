// בדיקת-צילום · delete-org-join-request-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { DELETE_ORG_JOIN_REQUEST_T } from './delete-org-join-request-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(DELETE_ORG_JOIN_REQUEST_T), "{\"k1\":\"platformOrgs\",\"k2\":\"joinRequests\"}");
console.log('OK delete-org-join-request-strings');
