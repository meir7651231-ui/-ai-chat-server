import { volunteerLoadHint } from './volunteer-load-hint.mjs';
// שקע-אמת מקומי כהתנהגות shop7/lib.ts:29-31 (הבדיקה מייבאת רק את האטום שלה)
const deliveriesOfVolunteer = (db, volId, dayId) =>
  db.deliveries.filter((d) => d.volunteerId === volId && (!dayId || d.dayId === dayId));
const db = {
  deliveries: [
    { volunteerId: 'v1', dayId: 'd1' },
    { volunteerId: 'v1', dayId: 'd1' },
    { volunteerId: 'v1', dayId: 'd1' },
    { volunteerId: 'v1', dayId: 'd2' },
    { volunteerId: 'v2', dayId: 'd1' },
  ],
};
const C = [
  [{ id: 'v1' }, 'd1', { count: 3, over: false }], // maxDeliveries=undefined ⇒ אין מגבלה
  [{ id: 'v1', maxDeliveries: 3 }, 'd1', { count: 3, over: true }],
  [{ id: 'v1', maxDeliveries: 5 }, 'd1', { count: 3, over: false }],
  [{ id: 'v1', maxDeliveries: 1 }, 'd2', { count: 1, over: true }],
  [{ id: 'v9', maxDeliveries: 0 }, 'd1', { count: 0, over: true }],
];
let f = 0;
for (const [vol, dayId, w] of C) {
  const g = volunteerLoadHint(db, vol, dayId, deliveriesOfVolunteer);
  if (g.count !== w.count || g.over !== w.over) {
    console.error(`✗ (${vol.id},max=${vol.maxDeliveries},${dayId}) ⇒ ${JSON.stringify(g)} ≠ ${JSON.stringify(w)}`);
    f = 1;
  }
}
if (f) process.exit(1);
console.log('✓ volunteer-load-hint: 5 דוגמאות-חוזה — ירוק');
