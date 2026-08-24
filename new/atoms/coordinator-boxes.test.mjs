import { coordinatorBoxes } from './coordinator-boxes.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const B = [
  { id: 'b1', coordinatorId: 'c1' },
  { id: 'b2', coordinatorId: 'c2' },
  { id: 'b3', coordinatorId: 'c1' },
];
// 1) שתי קופות בסדר-המקור
const r1 = coordinatorBoxes(B, 'c1');
ok(r1.length === 2 && r1[0].id === 'b1' && r1[1].id === 'b3', '1: (B,c1) ≠ [b1,b3]');
// 2) קופה אחת
const r2 = coordinatorBoxes(B, 'c2');
ok(r2.length === 1 && r2[0].id === 'b2', '2: (B,c2) ≠ [b2]');
// 3) רכז לא-מוכר
ok(coordinatorBoxes(B, 'cX').length === 0, '3: רכז לא-מוכר ≠ []');
// 4) מערך ריק
ok(coordinatorBoxes([], 'c1').length === 0, '4: ([],c1) ≠ []');
ok(B.length === 3, 'הקלט שונה — האטום נגע במערך-המקור');
if (f) process.exit(1);
console.log('✓ coordinator-boxes: 4 דוגמאות-חוזה — ירוק');
