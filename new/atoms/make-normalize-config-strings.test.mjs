// בדיקת-צילום · make-normalize-config-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { MAKE_NORMALIZE_CONFIG_T } from './make-normalize-config-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(MAKE_NORMALIZE_CONFIG_T), "{\"k1\":\"use strict\",\"k2\":\"object\",\"k3\":\"string\",\"k4\":\"boolean\",\"k5\":500,\"k6\":12,\"k7\":120}");
console.log('OK make-normalize-config-strings');
