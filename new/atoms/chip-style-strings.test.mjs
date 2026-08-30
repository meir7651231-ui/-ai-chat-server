// בדיקת-צילום · chip-style-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { CHIP_STYLE_T } from './chip-style-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(CHIP_STYLE_T), "{\"k1\":\"inline-block\",\"k2\":\"nowrap\",\"k3\":999,\"k4\":12,\"k5\":700}");
console.log('OK chip-style-strings');
