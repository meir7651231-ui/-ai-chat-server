// בדיקת-צילום · audit-categories-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { AUDIT_CATEGORIES_T } from './audit-categories-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(AUDIT_CATEGORIES_T), "{\"k1\":\"כפילות\",\"k2\":\"ת\\\"ז\",\"k3\":\"טלפון\",\"k4\":\"אימייל\",\"k5\":\"כתובת\",\"k6\":\"לוגיקה\",\"k7\":\"ילדים\",\"k8\":\"קשר\"}");
console.log('OK audit-categories-strings');
