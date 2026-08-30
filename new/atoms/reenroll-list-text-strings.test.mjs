// בדיקת-צילום · reenroll-list-text-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { REENROLL_LIST_TEXT_T } from './reenroll-list-text-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(REENROLL_LIST_TEXT_T), "{\"k1\":\"yes\",\"k2\":\"ממשיך\",\"k3\":\"לא ממשיך\",\"k4\":\"hold\",\"k5\":\"בהמתנה\",\"k6\":\"טרם הוחלט\",\"k7\":\" — נוכחות \",\"k8\":\", חיסורים \",\"k9\":\" ✓נרשם\"}");
console.log('OK reenroll-list-text-strings');
