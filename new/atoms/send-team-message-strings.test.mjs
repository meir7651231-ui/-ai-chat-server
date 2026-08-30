// בדיקת-צילום · send-team-message-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { SEND_TEAM_MESSAGE_T } from './send-team-message-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(SEND_TEAM_MESSAGE_T), "{\"k1\":\"messages\",\"k2\":120,\"k3\":60,\"tbl1\":\"teamChats\"}");
console.log('OK send-team-message-strings');
