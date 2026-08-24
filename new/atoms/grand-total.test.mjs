import { grandTotal } from './grand-total.mjs';
const boxTotal = (b) => b.collections.reduce((a, c) => a + (Number.isFinite(c.amount) ? c.amount : 0), 0);
const box = (...amounts) => ({ collections: amounts.map((amount) => ({ amount })) });
const b1 = box(100, 50), b2 = box(30), b3 = box();
const C = [
  [[b1, b2], 180, 'שתי קופות'],
  [[b1, b3], 150, 'קופה ריקה נספרת 0'],
  [[], 0, 'מערך ריק'],
  [[b2], 30, 'קופה יחידה'],
];
let f = 0;
for (const [boxes, want, msg] of C) {
  const got = grandTotal(boxes, boxTotal);
  if (got !== want) { console.error(`✗ ${msg} ⇒ ${got} ≠ ${want}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ grand-total: 4 דוגמאות-חוזה — ירוק');
