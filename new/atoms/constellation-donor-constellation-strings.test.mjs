// בדיקת-צילום · constellation-donor-constellation-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { CONSTELLATION_DONOR_CONSTELLATION_T } from './constellation-donor-constellation-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(CONSTELLATION_DONOR_CONSTELLATION_T), "{\"k1\":\"dormant\"}");
console.log('OK constellation-donor-constellation-strings');
