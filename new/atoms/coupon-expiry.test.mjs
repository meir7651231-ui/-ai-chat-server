import { couponExpiry } from './coupon-expiry.mjs';
const p2 = (n) => String(n).padStart(2, '0');
const isoOf = (d) => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
const C = [
  [{ since: '2026-08-01' }, { validDays: 30 }, '2026-08-31'],
  [{ since: '2026-08-20' }, { validDays: 15 }, '2026-09-04'],
  [{ since: '2026-12-20' }, { validDays: 15 }, '2027-01-04'],
  [{ since: '2026-08-01' }, { validDays: 0 }, ''],
  [{ since: '2026-08-01' }, {}, ''],
  [{ since: '' }, { validDays: 7 }, ''],
];
let f = 0;
for (const [a, comp, want] of C) {
  const got = couponExpiry(a, comp, isoOf);
  if (got !== want) { console.error(`✗ couponExpiry(${JSON.stringify(a)},${JSON.stringify(comp)}) = '${got}' ≠ '${want}'`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ coupon-expiry: 6 דוגמאות-חוזה (שקע isoOf) — ירוק');
