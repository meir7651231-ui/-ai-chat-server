// בדיקת-צילום · boxes-overview-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { BOXES_OVERVIEW_T } from './boxes-overview-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(BOXES_OVERVIEW_T), "{\"k1\":10}");
console.log('OK boxes-overview-strings');
