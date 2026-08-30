/** קופסה · heb-cal-box — חיווט הלוח העברי מלבנים עיוורות + דאטה (הכרעת-הטוהר 30.8):
 *  cycle-hit⇒דין-עיבור · lin-cycles⇒חודשים-שחלפו · cycle-carry⇒המולד ·
 *  step-postpone⇒דחיית-ר"ה · span-correction⇒אורך-שנה · pick-name⇒שם-חודש.
 *  אף מנגנון אינו יודע שהוא "לוח"; המשמעות נולדת כאן, בהצמדה ל-HEB_CAL.
 *  שקילות מוכחת: heb-cal-box.test.mjs משווה מול Intl (he-u-ca-hebrew) על אלפי ימים.
 *  חוזה: heb-cal-box.contract.md */
import { cycleHit } from '../atoms/cycle-hit.mjs';
import { linCycles } from '../atoms/lin-cycles.mjs';
import { cycleCarry } from '../atoms/cycle-carry.mjs';
import { stepPostpone } from '../atoms/step-postpone.mjs';
import { spanCorrection } from '../atoms/span-correction.mjs';
import { pickName } from '../atoms/pick-name.mjs';
import { HEB_CAL as C } from '../atoms/heb-cal-data.mjs';

const leapYear = (y) => cycleHit(y, C.leap.a, C.leap.b, C.leap.m, C.leap.t);
const elapsedDays = (y) =>
  stepPostpone(cycleCarry(linCycles(y, C.months.a, C.months.b, C.months.c),
    C.carry.base, C.carry.p0, C.carry.q, C.carry.parts), C.postpone.m, C.postpone.k, C.postpone.t);
const newYear = (y) => C.anchor + elapsedDays(y) +
  spanCorrection(elapsedDays(y - 1), elapsedDays(y), elapsedDays(y + 1), C.span.hi, C.span.lo);
const yearDays = (y) => newYear(y + 1) - newYear(y);
const monthLen = (y, m) => {
  if (C.shortMonths.includes(m)) return C.shortLen;
  if (m === C.flexLong && !C.yearLens.longMid.includes(yearDays(y))) return C.shortLen;
  if (m === C.flexShort && C.yearLens.shortMid.includes(yearDays(y))) return C.shortLen;
  if (m === C.leapFlex && !leapYear(y)) return C.shortLen;
  return C.longLen;
};
const lastMonth = (y) => (leapYear(y) ? C.monthsInLeap : C.monthsInPlain);
const toFixed = (y, m, d) => {
  let fixed = newYear(y) + d - 1;
  if (m < C.tishrei) {
    for (let k = C.tishrei; k <= lastMonth(y); k++) fixed += monthLen(y, k);
    for (let k = C.nisan; k < m; k++) fixed += monthLen(y, k);
  } else {
    for (let k = C.tishrei; k < m; k++) fixed += monthLen(y, k);
  }
  return fixed;
};
const gregLeap = (y) => y % C.greg.c4 === 0 && (y % C.greg.c100 !== 0 || y % C.greg.c400 === 0);
const gregToFixed = (y, m, d) => {
  let fixed = C.greg.yearDays * (y - 1) + Math.floor((y - 1) / C.greg.c4) -
    Math.floor((y - 1) / C.greg.c100) + Math.floor((y - 1) / C.greg.c400) +
    Math.floor((C.greg.mA * m - C.greg.mB) / C.greg.mC);
  if (m > 2) fixed += gregLeap(y) ? C.greg.leapAdj : C.greg.plainAdj;
  return fixed + d;
};
const fromFixed = (date) => {
  let y = Math.floor((C.approx.a * (date - C.anchor)) / C.approx.b);
  while (newYear(y + 1) <= date) y++;
  let m = date < toFixed(y, C.nisan, 1) ? C.tishrei : C.nisan;
  while (date > toFixed(y, m, monthLen(y, m))) m++;
  return [y, m, date - toFixed(y, m, 1) + 1];
};
const monthName = (y, m) =>
  (m === C.leapFlex && leapYear(y)) ? C.leapName12 : pickName(C.names, m - 1);

/** שם-החודש העברי — זהה-פלט ל-heb-month-he (Intl), מורכב כולו מלבנים עיוורות. */
export const hebMonthHeWired = (d) => {
  if (isNaN(d.getTime())) return '';
  const [y, m] = fromFixed(gregToFixed(d.getFullYear(), d.getMonth() + 1, d.getDate()));
  return monthName(y, m);
};
