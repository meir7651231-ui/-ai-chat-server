// בדיקת-צילום · enrollment-paid-status-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { ENROLLMENT_PAID_STATUS_T } from './enrollment-paid-status-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(ENROLLMENT_PAID_STATUS_T), "{\"k1\":\"paid\",\"k2\":\"partial\",\"k3\":\"unpaid\"}");
console.log('OK enrollment-paid-status-strings');
