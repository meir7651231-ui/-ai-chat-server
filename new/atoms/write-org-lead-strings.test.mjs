// בדיקת-צילום · write-org-lead-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { WRITE_ORG_LEAD_T } from './write-org-lead-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(WRITE_ORG_LEAD_T), "{\"k1\":\"platformLeads\"}");
console.log('OK write-org-lead-strings');
