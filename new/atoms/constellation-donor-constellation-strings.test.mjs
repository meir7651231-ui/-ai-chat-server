// בדיקת-צילום · constellation-donor-constellation-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { CONSTELLATION_DONOR_CONSTELLATION_T } from './constellation-donor-constellation-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(CONSTELLATION_DONOR_CONSTELLATION_T), "{\"k1\":\"dormant\",\"k2\":2166136261,\"k3\":16777619,\"k4\":30,\"k5\":90,\"k6\":180,\"k7\":365,\"k8\":60,\"k9\":12}");
console.log('OK constellation-donor-constellation-strings');
