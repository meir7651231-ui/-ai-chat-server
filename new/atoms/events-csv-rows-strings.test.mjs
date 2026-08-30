// בדיקת-צילום · events-csv-rows-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { EVENTS_CSV_ROWS_T } from './events-csv-rows-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(EVENTS_CSV_ROWS_T), "{\"k1\":\"רגיל (ירוק)\",\"k2\":\"בינוני (כתום)\",\"k3\":\"דחוף (אדום)\",\"k4\":\"כותרת\",\"k5\":\"סוג אירוע\",\"k6\":\"תאריך עברי\",\"k7\":\"תאריך לועזי\",\"k8\":\"שעה\",\"k9\":\"entity.family\",\"k10\":\"משפחה\",\"k11\":\"עדיפות\",\"k12\":\"הערות\",\"k13\":\"בוצע\",\"k14\":\"כן\",\"k15\":\"לא\"}");
console.log('OK events-csv-rows-strings');
