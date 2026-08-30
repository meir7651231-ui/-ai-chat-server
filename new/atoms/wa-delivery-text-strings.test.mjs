// בדיקת-צילום · wa-delivery-text-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { WA_DELIVERY_TEXT_T } from './wa-delivery-text-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(WA_DELIVERY_TEXT_T), "{\"k1\":\"wa.delivery\",\"k2\":\"משפחת \"}");
console.log('OK wa-delivery-text-strings');
