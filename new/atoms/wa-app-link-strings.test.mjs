// בדיקת-צילום · wa-app-link-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { WA_APP_LINK_T } from './wa-app-link-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(WA_APP_LINK_T), "{\"k1\":\"whatsapp://send?phone=\",\"k2\":\"&text=\"}");
console.log('OK wa-app-link-strings');
