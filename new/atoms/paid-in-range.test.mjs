import { paidInRange } from './paid-in-range.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
// שקע-הטווח כהתנהגות-המקור (inRange של reports/lib)
const ir = (iso, r) => {
  if (!iso) return false;
  if (r.from && iso < r.from) return false;
  if (r.to && iso > r.to) return false;
  return true;
};
const jan = { from: '2026-01-01', to: '2026-01-31' };
// 1) רק תשלום-ינואר
const e1 = { payments: [{ date: '2026-01-10', amount: 100 }, { date: '2026-02-10', amount: 50 }] };
ok(paidInRange(e1, jan, ir) === 100, 'דוגמה 1');
// 2) טווח פתוח ⇒ הכול
ok(paidInRange(e1, {}, ir) === 150, 'דוגמה 2');
// 3) גבולות סגורים משני הקצוות
const e3 = { payments: [{ date: '2026-01-01', amount: 10 }, { date: '2026-01-31', amount: 20 }] };
ok(paidInRange(e3, jan, ir) === 30, 'דוגמה 3');
// 4) בלי payments / ריק ⇒ 0
ok(paidInRange({}, jan, ir) === 0, 'דוגמה 4א: e ריק');
ok(paidInRange({ payments: [] }, jan, ir) === 0, 'דוגמה 4ב: מערך ריק');
// 5) מגן-מספר: NaN ומחרוזת ⇒ 0
const e5 = {
  payments: [
    { date: '2026-01-10', amount: NaN },
    { date: '2026-01-11', amount: '80' },
    { date: '2026-01-12', amount: 25 },
  ],
};
ok(paidInRange(e5, jan, ir) === 25, 'דוגמה 5');
// 6) תשלום בלי תאריך מסונן ע"י השקע
ok(paidInRange({ payments: [{ date: '', amount: 40 }] }, jan, ir) === 0, 'דוגמה 6');
if (f) process.exit(1);
console.log('✓ paid-in-range: 6 דוגמאות-חוזה — ירוק');
