// בדיקת-צילום · fetch-nedarim-donors-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { FETCH_NEDARIM_DONORS_T } from './fetch-nedarim-donors-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(FETCH_NEDARIM_DONORS_T), "{\"k1\":\"nedarimDonors\"}");
console.log('OK fetch-nedarim-donors-strings');
