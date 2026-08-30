// בדיקת-צילום · distribution-list-lines-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { DISTRIBUTION_LIST_LINES_T } from './distribution-list-lines-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(DISTRIBUTION_LIST_LINES_T), "{\"k1\":\"רשימת חלוקה — \",\"k2\":\"active\",\"k3\":\"☐ נמסר\",\"k4\":\"אין שיוכים פעילים לחבילה\",\"k5\":30}");
console.log('OK distribution-list-lines-strings');
