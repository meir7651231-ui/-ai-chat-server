// בדיקת-צילום · fetch-org-requests-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { FETCH_ORG_REQUESTS_T } from './fetch-org-requests-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(FETCH_ORG_REQUESTS_T), "{\"k1\":\"platformRequests\"}");
console.log('OK fetch-org-requests-strings');
