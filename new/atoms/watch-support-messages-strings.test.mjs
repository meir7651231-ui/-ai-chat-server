// בדיקת-צילום · watch-support-messages-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { WATCH_SUPPORT_MESSAGES_T } from './watch-support-messages-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(WATCH_SUPPORT_MESSAGES_T), "{\"k1\":\"supportChats\",\"k2\":\"messages\"}");
console.log('OK watch-support-messages-strings');
