// בדיקת-צילום · fetch-incoming-payments-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { FETCH_INCOMING_PAYMENTS_T } from './fetch-incoming-payments-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(FETCH_INCOMING_PAYMENTS_T), "{\"k1\":\"incomingPayments\",\"k2\":\"status\",\"k3\":\"pending\"}");
console.log('OK fetch-incoming-payments-strings');
