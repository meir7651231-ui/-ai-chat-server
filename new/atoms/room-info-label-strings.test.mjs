// בדיקת-צילום · room-info-label-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { ROOM_INFO_LABEL_T } from './room-info-label-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(ROOM_INFO_LABEL_T), "{\"k1\":\"משבצות של \",\"k2\":\" דק׳\",\"k3\":\" · עד \",\"k4\":\" משתתפים\",\"k5\":\" · נגיש\"}");
console.log('OK room-info-label-strings');
