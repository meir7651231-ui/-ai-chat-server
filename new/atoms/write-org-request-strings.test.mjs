// בדיקת-צילום · write-org-request-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { WRITE_ORG_REQUEST_T } from './write-org-request-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(WRITE_ORG_REQUEST_T), "{\"k1\":\"platformRequests\"}");
console.log('OK write-org-request-strings');
