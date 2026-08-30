// בדיקת-צילום · fetch-all-orgs-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { FETCH_ALL_ORGS_T } from './fetch-all-orgs-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(FETCH_ALL_ORGS_T), "{\"k1\":\"platformOrgs\"}");
console.log('OK fetch-all-orgs-strings');
