// בדיקת-צילום · watch-incoming-payments-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { WATCH_INCOMING_PAYMENTS_T } from './watch-incoming-payments-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(WATCH_INCOMING_PAYMENTS_T), "{\"k1\":\"incomingPayments\",\"k2\":\"status\",\"k3\":\"pending\"}");
console.log('OK watch-incoming-payments-strings');
