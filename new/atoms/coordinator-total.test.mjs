import { coordinatorTotal } from './coordinator-total.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
// שקעים חוזיים (מדמים את שכני-המקור)
const coordinatorBoxes = (boxes, coordId) => boxes.filter((b) => b.coordinatorId === coordId);
const boxTotal = (box) => box.collections.reduce((a, c) => a + (Number.isFinite(c.amount) ? c.amount : 0), 0);
const B = [
  { id: 'b1', coordinatorId: 'c1', collections: [{ amount: 100 }, { amount: 50 }] },
  { id: 'b2', coordinatorId: 'c2', collections: [{ amount: 30 }] },
  { id: 'b3', coordinatorId: 'c1', collections: [] },
  { id: 'b4', coordinatorId: 'c1', collections: [{ amount: 200 }] },
];
// 1) שלוש קופות ⇒ 350
const t1 = coordinatorTotal(B, 'c1', coordinatorBoxes, boxTotal);
ok(t1 === 350, '1: (B,c1) ≠ 350 (קיבלנו ' + t1 + ')');
// 2) קופה אחת ⇒ 30
ok(coordinatorTotal(B, 'c2', coordinatorBoxes, boxTotal) === 30, '2: (B,c2) ≠ 30');
// 3) רכז לא-מוכר ⇒ 0
ok(coordinatorTotal(B, 'cX', coordinatorBoxes, boxTotal) === 0, '3: רכז לא-מוכר ≠ 0');
// 4) מערך ריק ⇒ 0
ok(coordinatorTotal([], 'c1', coordinatorBoxes, boxTotal) === 0, '4: ([],c1) ≠ 0');
if (f) process.exit(1);
console.log('✓ coordinator-total: 4 דוגמאות-חוזה — ירוק');
