// בדיקת-צילום · sup-don-events-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { SUP_DON_EVENTS_T } from './sup-don-events-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(SUP_DON_EVENTS_T), "{\"k1\":\"קבלה \",\"k2\":\"עסקה \",\"k3\":\"אסמכתא \",\"k4\":\" תשלומים\",\"k5\":\"entity.donation\",\"k6\":\"תרומה\",\"k7\":\"מהקובץ ההיסטורי\",\"k8\":\" ראשונה (מהקובץ)\",\"k9\":\" אחרונה (מהקובץ)\"}");
console.log('OK sup-don-events-strings');
