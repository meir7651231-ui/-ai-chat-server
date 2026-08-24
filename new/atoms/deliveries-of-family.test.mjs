import { deliveriesOfFamily } from './deliveries-of-family.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const db = { deliveries: [{ id: 'd1', familyId: 'f1' }, { id: 'd2', familyId: 'f2' }, { id: 'd3', familyId: 'f1' }] };
// 1) משפחה עם שתי מסירות — סדר-מקור + אותה רפרנס
const a = deliveriesOfFamily(db, 'f1');
ok(a.length === 2, 'f1: אורך ≠ 2');
ok(a[0].id === 'd1' && a[1].id === 'd3', 'f1: לא [d1,d3] בסדר-המקור');
ok(a[1] === db.deliveries[2], 'f1: לא אותה רפרנס');
// 2) משפחה עם מסירה אחת
const b = deliveriesOfFamily(db, 'f2');
ok(b.length === 1 && b[0].id === 'd2', 'f2: לא [d2]');
// 3) משפחה לא-קיימת
ok(deliveriesOfFamily(db, 'f9').length === 0, 'f9: לא ריק');
// 4) deliveries ריק
ok(deliveriesOfFamily({ deliveries: [] }, 'f1').length === 0, 'ריק: לא ריק');
if (f) process.exit(1);
console.log('✓ deliveries-of-family: 4 דוגמאות-חוזה — ירוק');
