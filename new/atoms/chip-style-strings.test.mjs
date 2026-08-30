// בדיקת-צילום · chip-style-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { CHIP_STYLE_T } from './chip-style-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(CHIP_STYLE_T), "{\"k1\":\"inline-block\",\"k2\":\"nowrap\"}");
console.log('OK chip-style-strings');
