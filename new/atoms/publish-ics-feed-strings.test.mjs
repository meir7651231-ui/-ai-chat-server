// בדיקת-צילום · publish-ics-feed-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { PUBLISH_ICS_FEED_T } from './publish-ics-feed-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(PUBLISH_ICS_FEED_T), "{\"k1\":\"לוח-השנה גדול מדי לפרסום כפיד — פנו לתמיכה\"}");
console.log('OK publish-ics-feed-strings');
