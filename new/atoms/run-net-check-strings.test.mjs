// בדיקת-צילום · run-net-check-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { RUN_NET_CHECK_T } from './run-net-check-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(RUN_NET_CHECK_T), "{\"k1\":8000}");
console.log('OK run-net-check-strings');
