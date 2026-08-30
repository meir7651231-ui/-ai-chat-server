// בדיקת-צילום · ics-feed-terms — המונחים זהים ביט-אחר-ביט למקור.
import { ICS_FEED_TERMS } from './ics-feed-terms.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(ICS_FEED_TERMS), "{\"k1\":\"icsFeeds\"}");
console.log('OK ics-feed-terms');
