// בדיקת-זהב · heb-cal-box — שקילות-פלט מלאה מול המקור-החי (Intl he-u-ca-hebrew):
// סריקה 1900–2100 בדילוגי 13 ימים + סריקה צפופה סביב ערבי-ר"ה (ספט'-אוק' 2018–2032, יום-יום),
// כולל קצה-הבאג ההיסטורי 2024-10-02 (29 אלול ⇒ 'אלול' ולא 'תשרי').
import { hebMonthHeWired } from './heb-cal-box.mjs';
import { hebMonthHe } from '../atoms/heb-month-he.mjs';
import assert from 'node:assert';
let n = 0;
const eq = (d) => { assert.strictEqual(hebMonthHeWired(d), hebMonthHe(d), d.toISOString().slice(0, 10)); n++; };
for (let t = Date.UTC(1900, 0, 1); t <= Date.UTC(2100, 11, 31); t += 13 * 86400000) eq(new Date(t));
for (let y = 2018; y <= 2032; y++)
  for (let t = Date.UTC(y, 8, 1); t <= Date.UTC(y, 9, 31); t += 86400000) eq(new Date(t));
eq(new Date(Date.UTC(2024, 9, 2)));
assert.strictEqual(hebMonthHeWired(new Date('zz')), '');
console.log('OK heb-cal-box · ' + n + ' ימים זהים ל-Intl');
