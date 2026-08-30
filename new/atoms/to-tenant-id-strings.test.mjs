// בדיקת-צילום · to-tenant-id-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { TO_TENANT_ID_T } from './to-tenant-id-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(TO_TENANT_ID_T), "{\"k1\":\"default\",\"k2\":\"org\",\"k3\":\"-org\",\"k4\":38,\"k5\":40}");
console.log('OK to-tenant-id-strings');
