// בדיקת-צילום · receipt-fmt-of-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { RECEIPT_FMT_OF_T } from './receipt-fmt-of-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(RECEIPT_FMT_OF_T), "{\"k1\":\"core.receipt.pdf\"}");
console.log('OK receipt-fmt-of-strings');
