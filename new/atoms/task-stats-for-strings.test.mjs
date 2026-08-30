// בדיקת-צילום · task-stats-for-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { TASK_STATS_FOR_T } from './task-stats-for-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(TASK_STATS_FOR_T), "{\"k1\":10,\"k2\":86400000}");
console.log('OK task-stats-for-strings');
