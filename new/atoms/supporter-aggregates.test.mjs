import { supporterAggregates } from './supporter-aggregates.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
// 1) שקל+דולר, תאריכים
ok(eq(supporterAggregates({ donations: [{ amount: 100, cur: '₪', date: '2026-01-05' }, { amount: 50, cur: '$', date: '2026-03-01' }] }),
  { count: 2, ils: 100, usd: 50, first: '2026-01-05', last: '2026-03-01' }), 'דוגמה 1');
// 2) אין donations
ok(eq(supporterAggregates({}), { count: 0, ils: 0, usd: 0, first: '', last: '' }), 'דוגמה 2');
// 3) cur חסר ⇒ שקל
{
  const r = supporterAggregates({ donations: [{ amount: 70, date: '2025-05-05' }] });
  ok(r.ils === 70 && r.usd === 0, 'דוגמה 3');
}
// 4) NaN נספר כ-0 אך count עולה
{
  const r = supporterAggregates({ donations: [{ amount: NaN, date: '2025-01-01' }, { amount: 30, date: '2025-02-02' }] });
  ok(r.count === 2 && r.ils === 30, 'דוגמה 4');
}
// 5) מיון תאריכים
{
  const r = supporterAggregates({ donations: [{ amount: 1, date: '2026-06-01' }, { amount: 2, date: '2026-02-01' }] });
  ok(r.first === '2026-02-01' && r.last === '2026-06-01', 'דוגמה 5');
}
// 6) קבלה בלי date לא נכנסת לטווח
{
  const r = supporterAggregates({ donations: [{ amount: 10 }, { amount: 20, date: '2026-04-04' }] });
  ok(r.count === 2 && r.ils === 30 && r.first === '2026-04-04' && r.last === '2026-04-04', 'דוגמה 6');
}
// 7) donations שאינו מערך
ok(eq(supporterAggregates({ donations: 'x' }), { count: 0, ils: 0, usd: 0, first: '', last: '' }), 'דוגמה 7');
if (f) process.exit(1);
console.log('✓ supporter-aggregates: 7 דוגמאות-חוזה — ירוק');
