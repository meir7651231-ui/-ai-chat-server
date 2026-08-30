// בדיקת-צילום · don-cal-month-line-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { DON_CAL_MONTH_LINE_T } from './don-cal-month-line-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(DON_CAL_MONTH_LINE_T), "{\"k1\":\"אין \",\"k2\":\"entity.donations\",\"k3\":\"תרומות\",\"k4\":\" מתועדות בחודש זה\",\"k5\":\" החודש · \",\"k6\":\"סכומים מהקובץ ההיסטורי\"}");
console.log('OK don-cal-month-line-strings');
