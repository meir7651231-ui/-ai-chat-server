// בדיקת-צילום · group-options-of-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { GROUP_OPTIONS_OF_T } from './group-options-of-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(GROUP_OPTIONS_OF_T), "{\"k1\":\" · יום \"}");
console.log('OK group-options-of-strings');
