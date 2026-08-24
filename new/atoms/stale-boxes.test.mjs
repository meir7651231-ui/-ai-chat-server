import { staleBoxes } from './stale-boxes.mjs';
let f = 0;
const eq = (a, b, msg) => {
  const ja = JSON.stringify(a), jb = JSON.stringify(b);
  if (ja !== jb) { console.error(`✗ ${msg} ⇒ ${ja} ≠ ${jb}`); f = 1; }
};

// מימושי-השקעים לבדיקה (כחוזי iso-local / last-collection-iso)
const isoOf = (d) => {
  const p2 = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
};
const lastCollectionIso = (box) => {
  let last = '';
  for (const c of box.collections) if (c.date > last) last = c.date;
  return last;
};

const box = (id, status, since, dates) =>
  ({ id, status, since, collections: dates.map((date) => ({ date, amount: 10 })) });

const TODAY = '2026-08-24'; // קו-חיתוך ל-90 יום: 2026-05-26
const ids = (bs) => bs.map((b) => b.id);

// 1) בדיוק 90 יום ⇒ ישנה (גבול כולל) · 2) 89 יום ⇒ לא
const a = box('a', 'home', '2026-01-01', ['2026-05-26']);
const b = box('b', 'home', '2026-01-01', ['2026-05-27']);
// 3) בלי ריקונים ⇒ נפילה ל-since
const c = box('c', 'home', '2026-01-01', []);
// 4) ישנה אבל 'lost' ⇒ מוחרגת
const d = box('d', 'lost', '2026-01-01', ['2026-02-01']);
// 5) בלי ריקונים ובלי since ⇒ מוחרגת
const e = box('e', 'home', '', []);

eq(ids(staleBoxes([a, b, c, d, e], TODAY, 90, isoOf, lastCollectionIso)),
   ['a', 'c'], 'סינון-90-יום שגוי (דוגמאות 1-5)');

// 6) days=30 ⇒ קו-חיתוך 2026-07-25
const g = box('g', 'home', '2026-01-01', ['2026-07-25']);
const h = box('h', 'home', '2026-01-01', ['2026-07-26']);
eq(ids(staleBoxes([g, h], TODAY, 30, isoOf, lastCollectionIso)),
   ['g'], 'סף-days מותאם (30) שגוי');

if (f) process.exit(1);
console.log('✓ stale-boxes: 6 דוגמאות-חוזה — ירוק');
