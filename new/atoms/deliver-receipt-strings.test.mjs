// בדיקת-צילום · deliver-receipt-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { DELIVER_RECEIPT_T } from './deliver-receipt-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(DELIVER_RECEIPT_T), "{\"k1\":\"pdf\"}");
console.log('OK deliver-receipt-strings');
