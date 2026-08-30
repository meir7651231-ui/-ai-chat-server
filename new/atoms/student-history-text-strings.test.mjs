// בדיקת-צילום · student-history-text-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { STUDENT_HISTORY_TEXT_T } from './student-history-text-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(STUDENT_HISTORY_TEXT_T), "{\"k1\":\" — נוכחות \",\"k2\":\", חיסורים \"}");
console.log('OK student-history-text-strings');
