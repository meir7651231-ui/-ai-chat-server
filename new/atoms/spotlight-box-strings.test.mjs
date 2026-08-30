// בדיקת-צילום · spotlight-box-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { SPOTLIGHT_BOX_T } from './spotlight-box-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(SPOTLIGHT_BOX_T), "{\"k1\":10}");
console.log('OK spotlight-box-strings');
