import { deliveriesOfVolunteer } from './deliveries-of-volunteer.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const db = { deliveries: [
  { id: 'd1', volunteerId: 'v1', dayId: 'A' },
  { id: 'd2', volunteerId: 'v2', dayId: 'A' },
  { id: 'd3', volunteerId: 'v1', dayId: 'B' },
] };
// 1) בלי dayId — כל ימי-המתנדב
const a = deliveriesOfVolunteer(db, 'v1');
ok(a.length === 2 && a[0].id === 'd1' && a[1].id === 'd3', 'v1: לא [d1,d3]');
// 2) עם dayId — צמצום ליום
const b = deliveriesOfVolunteer(db, 'v1', 'A');
ok(b.length === 1 && b[0].id === 'd1', "v1+'A': לא [d1]");
// 3) dayId='' (falsy) — כמו בלי
ok(deliveriesOfVolunteer(db, 'v1', '').length === 2, "dayId='' לא כמו-בלי");
// 4) יום בלי מסירות של המתנדב
ok(deliveriesOfVolunteer(db, 'v1', 'C').length === 0, "v1+'C': לא ריק");
// 5) מתנדב לא-קיים
ok(deliveriesOfVolunteer(db, 'v9').length === 0, 'v9: לא ריק');
if (f) process.exit(1);
console.log('✓ deliveries-of-volunteer: 5 דוגמאות-חוזה — ירוק');
