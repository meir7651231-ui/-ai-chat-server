// בדיקת-צילום · upcoming-meetings-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { UPCOMING_MEETINGS_T } from './upcoming-meetings-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(UPCOMING_MEETINGS_T), "{\"k1\":\"meeting\"}");
console.log('OK upcoming-meetings-strings');
