import { isoToday } from './iso-today.mjs';

// שקע isoLocal מקומי אמיתי (העתק התנהגות השכן מ-date-util — מוגדר כאן, לא מיובא):
const p2 = (n) => String(n).padStart(2, '0');
const isoLocal = (d) => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;

const C = [
  [new Date(2026, 7, 24, 12, 0), '2026-08-24'],
  [new Date(2026, 0, 5, 9, 30), '2026-01-05'],
  [new Date(2026, 7, 24, 0, 30), '2026-08-24'], // אחרי-חצות מקומי — נשאר היום המקומי
  [new Date(2026, 11, 31, 23, 59), '2026-12-31'],
];
let f = 0;
for (const [now, w] of C) {
  const g = isoToday(isoLocal, now);
  if (g !== w) { console.error(`✗ ${now} ⇒ ${g} ≠ ${w}`); f = 1; }
}
// דוגמה 5 — ברירת-מחדל now=עכשיו: שווה ל-isoLocal(עכשיו) ותואם תבנית
const def = isoToday(isoLocal);
if (!/^\d{4}-\d{2}-\d{2}$/.test(def) || def !== isoLocal(new Date())) {
  console.error(`✗ ברירת-מחדל: ${def}`); f = 1;
}
if (f) process.exit(1);
console.log('✓ iso-today: 5 דוגמאות-חוזה — ירוק (כפילות-6-המודולים סגורה)');
