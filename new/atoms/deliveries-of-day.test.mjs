import { deliveriesOfDay } from './deliveries-of-day.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const db = { deliveries: [{ id: 'd1', dayId: 'A' }, { id: 'd2', dayId: 'B' }, { id: 'd3', dayId: 'A' }] };
// 1) יום עם שתי מסירות — סדר-מקור + אותה רפרנס
const a = deliveriesOfDay(db, 'A');
ok(a.length === 2, 'A: אורך ≠ 2');
ok(a[0].id === 'd1' && a[1].id === 'd3', 'A: לא [d1,d3] בסדר-המקור');
ok(a[0] === db.deliveries[0], 'A: לא אותה רפרנס');
// 2) יום עם מסירה אחת
const b = deliveriesOfDay(db, 'B');
ok(b.length === 1 && b[0].id === 'd2', 'B: לא [d2]');
// 3) יום לא-קיים
ok(deliveriesOfDay(db, 'C').length === 0, 'C: לא ריק');
// 4) deliveries ריק
ok(deliveriesOfDay({ deliveries: [] }, 'A').length === 0, 'ריק: לא ריק');
if (f) process.exit(1);
console.log('✓ deliveries-of-day: 4 דוגמאות-חוזה — ירוק');
