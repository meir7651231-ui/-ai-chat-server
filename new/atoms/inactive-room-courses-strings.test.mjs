// בדיקת-צילום · inactive-room-courses-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { INACTIVE_ROOM_COURSES_T } from './inactive-room-courses-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(INACTIVE_ROOM_COURSES_T), "{\"k1\":\"entity.room\",\"k2\":\"חדר\",\"k3\":\" לא קיים\"}");
console.log('OK inactive-room-courses-strings');
