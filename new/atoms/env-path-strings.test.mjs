// בדיקת-צילום · env-path-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { ENV_PATH_T } from './env-path-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(ENV_PATH_T), "{\"k1\":\"_enc/envelope\",\"k2\":\"orgs/\",\"k3\":\"/_enc/envelope\"}");
console.log('OK env-path-strings');
