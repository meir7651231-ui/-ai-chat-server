// בדיקת-צילום · cockpit-feed-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { COCKPIT_FEED_T } from './cockpit-feed-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(COCKPIT_FEED_T), "{\"k1\":\"תרם/ה \"}");
console.log('OK cockpit-feed-strings');
