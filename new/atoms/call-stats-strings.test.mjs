// בדיקת-צילום · call-stats-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { CALL_STATS_T } from './call-stats-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(CALL_STATS_T), "{\"k1\":\"noanswer\"}");
console.log('OK call-stats-strings');
