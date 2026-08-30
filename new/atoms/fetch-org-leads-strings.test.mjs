// בדיקת-צילום · fetch-org-leads-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { FETCH_ORG_LEADS_T } from './fetch-org-leads-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(FETCH_ORG_LEADS_T), "{\"k1\":\"platformLeads\"}");
console.log('OK fetch-org-leads-strings');
