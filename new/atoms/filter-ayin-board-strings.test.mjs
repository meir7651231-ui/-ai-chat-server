// בדיקת-צילום · filter-ayin-board-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { FILTER_AYIN_BOARD_T } from './filter-ayin-board-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(FILTER_AYIN_BOARD_T), "{\"k1\":\"wait\",\"k2\":\"done\"}");
console.log('OK filter-ayin-board-strings');
