import { planLabelOf } from './plan-label-of.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
// שקעים בהתנהגות-מאור (courses/lib.ts): planWord + payBal (totalDue - paid, לא שלילי):
const planWord = (m) => (m === 'punch' ? 'כרטיסייה' : m === 'half_year' ? 'מנוי חצי-שנתי' : m === 'year' ? 'מנוי שנתי' : 'מנוי חודשי');
const payBal = (e) => Math.max(0, (e.totalDue || 0) - (e.paid || 0));
const run = (e, want) => {
  const got = planLabelOf(e, planWord, payBal);
  ok(got === want, want + ' — בפועל: ' + got);
};
run({ plan: 'punch', purchased: 10, status: 'active', absences: [] }, 'כרטיסייה · 10');
run({ plan: 'month', status: 'paused', absences: [] }, 'מנוי חודשי · מוקפא ⏸');
run({ plan: 'year', status: 'ended', absences: [{ date: '2026-01-01' }, { date: '2026-02-01' }], totalDue: 200, paid: 50 }, 'מנוי שנתי · הסתיים · 2 חיס׳ · 💳 ₪150');
run({ plan: 'half_year', status: 'active', absences: [{ date: '2026-03-01' }] }, 'מנוי חצי-שנתי · 1 חיס׳');
run({ plan: 'punch', purchased: 4, status: 'wait', absences: [], totalDue: 80 }, 'כרטיסייה · 4 · 💳 ₪80');
if (f) process.exit(1);
console.log('✓ plan-label-of: 5 דוגמאות-חוזה — ירוק');
