// בדיקת-צילום · wa-link-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { WA_LINK_T } from './wa-link-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(WA_LINK_T), "{\"k1\":\"https://wa.me/\",\"k2\":\"?text=\"}");
console.log('OK wa-link-strings');
