// בדיקת-צילום · day-progress-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { DAY_PROGRESS_T } from './day-progress-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(DAY_PROGRESS_T), "{\"k1\":\"pickup\",\"k2\":\"enroute\",\"k3\":\"delivered\"}");
console.log('OK day-progress-strings');
