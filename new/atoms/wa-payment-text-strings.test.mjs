// בדיקת-צילום · wa-payment-text-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { WA_PAYMENT_TEXT_T } from './wa-payment-text-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(WA_PAYMENT_TEXT_T), "{\"k1\":\"wa.payment\"}");
console.log('OK wa-payment-text-strings');
