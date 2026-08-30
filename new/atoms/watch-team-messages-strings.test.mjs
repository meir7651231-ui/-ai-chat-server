// בדיקת-צילום · watch-team-messages-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { WATCH_TEAM_MESSAGES_T } from './watch-team-messages-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(WATCH_TEAM_MESSAGES_T), "{\"k1\":\"teamChats\",\"k2\":\"messages\"}");
console.log('OK watch-team-messages-strings');
