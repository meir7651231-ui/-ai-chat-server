// בדיקת-צילום · cloud-cfg-cache-key-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { CLOUD_CFG_CACHE_KEY_T } from './cloud-cfg-cache-key-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(CLOUD_CFG_CACHE_KEY_T), "{\"k1\":\"maor_cloudcfg:\"}");
console.log('OK cloud-cfg-cache-key-strings');
