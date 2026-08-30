// בדיקת-צילום · pay-link-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { PAY_LINK_T } from './pay-link-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(PAY_LINK_T), "{\"k1\":\"%7Bamount%7D\",\"k2\":\"{amount}\",\"k3\":\"Amount\",\"k4\":\"ClientName\",\"k5\":\"amount\",\"k6\":\"name\"}");
console.log('OK pay-link-strings');
