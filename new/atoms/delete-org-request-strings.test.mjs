// בדיקת-צילום · delete-org-request-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { DELETE_ORG_REQUEST_T } from './delete-org-request-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(DELETE_ORG_REQUEST_T), "{\"k1\":\"platformRequests\"}");
console.log('OK delete-org-request-strings');
