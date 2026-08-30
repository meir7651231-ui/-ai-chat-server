// בדיקת-צילום · ayin-daily-rows-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { AYIN_DAILY_ROWS_T } from './ayin-daily-rows-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(AYIN_DAILY_ROWS_T), "{\"k1\":\"שם\",\"k2\":\"טלפון\",\"k3\":\"שלב\",\"k4\":\"מתי לדבר שוב\",\"k5\":\"הערה\",\"k6\":\" היום\"}");
console.log('OK ayin-daily-rows-strings');
