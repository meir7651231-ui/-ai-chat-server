// בדיקת-צילום · telephony-to-tenant-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { TELEPHONY_TO_TENANT_T } from './telephony-to-tenant-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(TELEPHONY_TO_TENANT_T), "{\"k1\":\"sim-in-gateway\",\"k2\":\"customer-forward\",\"k3\":\"device-link\",\"k4\":\"voice\",\"k5\":\"whatsapp\",\"k6\":\"sim\",\"k7\":\"ארגון\",\"k8\":\"Asia/Jerusalem\",\"k9\":\"directory\"}");
console.log('OK telephony-to-tenant-strings');
