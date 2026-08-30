// בדיקת-צילום · make-normalize-config-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { MAKE_NORMALIZE_CONFIG_T } from './make-normalize-config-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(MAKE_NORMALIZE_CONFIG_T), "{\"k1\":\"use strict\",\"k2\":\"object\",\"k3\":\"string\",\"k4\":\"boolean\"}");
console.log('OK make-normalize-config-strings');
