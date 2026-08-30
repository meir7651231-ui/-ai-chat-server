// בדיקת-צילום · watch-all-support-threads-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { WATCH_ALL_SUPPORT_THREADS_T } from './watch-all-support-threads-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(WATCH_ALL_SUPPORT_THREADS_T), "{\"k1\":\"supportChats\"}");
console.log('OK watch-all-support-threads-strings');
