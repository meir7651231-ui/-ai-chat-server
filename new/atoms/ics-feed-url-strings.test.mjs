// בדיקת-צילום · ics-feed-url-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { ICS_FEED_URL_T } from './ics-feed-url-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(ICS_FEED_URL_T), "{\"k1\":\"https://us-central1-\",\"k2\":\".cloudfunctions.net/icsFeed?org=\",\"k3\":\"&key=\"}");
console.log('OK ics-feed-url-strings');
