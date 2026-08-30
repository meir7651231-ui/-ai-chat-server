// בדיקת-צילום · read-ics-feed-token-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { READ_ICS_FEED_TOKEN_T } from './read-ics-feed-token-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(READ_ICS_FEED_TOKEN_T), "{\"k1\":\"icsFeeds\",\"k2\":\"string\"}");
console.log('OK read-ics-feed-token-strings');
