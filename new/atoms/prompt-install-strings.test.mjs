// בדיקת-צילום · prompt-install-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { PROMPT_INSTALL_T } from './prompt-install-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(PROMPT_INSTALL_T), "{\"k1\":\"accepted\"}");
console.log('OK prompt-install-strings');
