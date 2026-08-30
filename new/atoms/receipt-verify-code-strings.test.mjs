// בדיקת-צילום · receipt-verify-code-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { RECEIPT_VERIFY_CODE_T } from './receipt-verify-code-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(RECEIPT_VERIFY_CODE_T), "{\"k1\":10,\"k2\":2166136261,\"k3\":16777619,\"k4\":36}");
console.log('OK receipt-verify-code-strings');
