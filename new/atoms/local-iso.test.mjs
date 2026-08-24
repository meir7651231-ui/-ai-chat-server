import { localIso } from './local-iso.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
// שקע נאמן-למקור (maor/src/lib/date-util.ts:14-17)
const isoLocal = (d) => {
  const p2 = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
};
// 1) תאריך רגיל
ok(localIso(new Date(2026, 7, 24), isoLocal) === '2026-08-24', 'דוגמה 1 נשברה');
// 2) ריפוד חודש ויום
ok(localIso(new Date(2026, 0, 5), isoLocal) === '2026-01-05', 'דוגמה 2 נשברה');
// 3) מקומי, בלי הזחת-UTC — 23:59 מקומי נשאר אותו יום
ok(localIso(new Date(2025, 11, 31, 23, 59), isoLocal) === '2025-12-31', 'דוגמה 3 נשברה');
// 4) האצלה שקופה — פעם אחת, אותו d, אותו פלט
let calls = 0, seenD = null;
const d4 = new Date(2026, 5, 1);
const got4 = localIso(d4, (x) => { calls++; seenD = x; return 'X'; });
ok(calls === 1 && seenD === d4 && got4 === 'X', 'דוגמה 4 נשברה — ההאצלה לא שקופה');
if (f) process.exit(1);
console.log('✓ local-iso: 4 דוגמאות-חוזה — ירוק');
