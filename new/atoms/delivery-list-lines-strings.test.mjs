// בדיקת-צילום · delivery-list-lines-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { DELIVERY_LIST_LINES_T } from './delivery-list-lines-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(DELIVERY_LIST_LINES_T), "{\"k1\":\" מסירות)\"}");
console.log('OK delivery-list-lines-strings');
