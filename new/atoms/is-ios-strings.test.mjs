// בדיקת-צילום · is-ios-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { IS_IOS_T } from './is-ios-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(IS_IOS_T), "{\"k1\":\"undefined\"}");
console.log('OK is-ios-strings');
