import { hebAnnualEq } from './heb-annual-eq.mjs';
// שקע-scanHebYear אמיתי על Intl (מקומי לבדיקה — הבדיקה מייבאת רק את האטום שלה)
const fmtParts = new Intl.DateTimeFormat('en-u-ca-hebrew', { day: 'numeric', month: 'long', year: 'numeric' });
function hebParts(d) {
  const parts = fmtParts.formatToParts(d);
  const get = (t) => parts.find((p) => p.type === t)?.value ?? '';
  return { day: +get('day'), month: get('month'), year: +get('year') };
}
const cache = new Map();
function scanHebYear(hebYear) {
  const hit = cache.get(hebYear);
  if (hit) return hit;
  const seq = [];
  const has30 = new Set();
  const gy = hebYear - 3761;
  for (let i = 0; i < 440; i++) {
    const p = hebParts(new Date(gy, 7, 1 + i, 12));
    if (p.year !== hebYear) continue;
    if (!seq.includes(p.month)) seq.push(p.month);
    if (p.day === 30) has30.add(p.month);
  }
  const res = { seq, has30 };
  cache.set(hebYear, res);
  return res;
}
const C = [
  [{ day: 15, month: 'Elul' }, { day: 15, month: 'Elul' }, true, 'התאמה ישירה'],
  [{ day: 15, month: 'Elul' }, { day: 14, month: 'Elul' }, false, 'יום שונה'],
  [{ day: 14, month: 'Adar' }, { day: 14, month: 'Adar II', year: 5784 }, true, 'אדר-רגיל⇒אדר-ב׳ במעוברת'],
  [{ day: 14, month: 'Adar I' }, { day: 14, month: 'Adar II', year: 5784 }, false, 'אדר-א׳ לא נופל על אדר-ב׳'],
  [{ day: 14, month: 'Adar I' }, { day: 14, month: 'Adar', year: 5786 }, true, 'שנה פשוטה בולעת כל עוגן-אדר'],
  [{ day: 14, month: 'Adar' }, { day: 14, month: 'Nisan' }, false, 'אחד אדר, השני לא'],
  [{ day: 30, month: 'Heshvan' }, { day: 1, month: 'Kislev', year: 5786 }, true, 'כלל ל׳: אין ל׳ חשוון בתשפ"ו'],
  [{ day: 30, month: 'Heshvan' }, { day: 1, month: 'Kislev', year: 5785 }, false, 'יש ל׳ חשוון בתשפ"ה — אין נפילה'],
  [{ day: 30, month: 'Adar I' }, { day: 1, month: 'Nisan', year: 5786 }, true, 'באג-האזכרה: 30 אדר-א׳ ⇒ א׳ ניסן בפשוטה'],
];
let f = 0;
for (const [a, q, want, why] of C) {
  const got = hebAnnualEq(a, q, scanHebYear);
  if (got !== want) { console.error(`✗ ${why}: ${JSON.stringify(a)} מול ${JSON.stringify(q)} ⇒ ${got} ≠ ${want}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ heb-annual-eq: 9 דוגמאות-חוזה (כלל-אדר + כלל-ל׳ מול הלוח) — ירוק');
