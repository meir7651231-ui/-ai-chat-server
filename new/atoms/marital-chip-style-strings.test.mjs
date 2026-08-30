// בדיקת-צילום · marital-chip-style-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { MARITAL_CHIP_STYLE_T } from './marital-chip-style-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(MARITAL_CHIP_STYLE_T), "{\"k1\":\"#eef1f5\"}");
console.log('OK marital-chip-style-strings');
