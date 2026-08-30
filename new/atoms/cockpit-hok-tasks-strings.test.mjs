// בדיקת-צילום · cockpit-hok-tasks-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { COCKPIT_HOK_TASKS_T } from './cockpit-hok-tasks-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(COCKPIT_HOK_TASKS_T), "{\"k1\":\"hok:\",\"k2\":\"hok\",\"k3\":\"הו״ק \",\"k4\":\" · יום \",\"k5\":\" — טרם נרשם החודש\",\"k6\":\"due\",\"k7\":100}");
console.log('OK cockpit-hok-tasks-strings');
