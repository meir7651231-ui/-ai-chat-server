import { volunteerRouteStops } from './volunteer-route-stops.mjs';
const db = {
  deliveries: [
    { dayId: 'd1', volunteerId: 'v1', familyId: 'f1' },
    { dayId: 'd1', volunteerId: 'v1', familyId: 'f2' },
    { dayId: 'd1', volunteerId: 'v1', familyId: 'f3' },
    { dayId: 'd1', volunteerId: 'v1', familyId: 'f4' },
    { dayId: 'd1', volunteerId: 'v1', familyId: 'ghost' },
    { dayId: 'd1', volunteerId: 'v2', familyId: 'f9' },
    { dayId: 'd2', volunteerId: 'v1', familyId: 'f1' },
  ],
  families: [
    { id: 'f1', address: ' הרצל 1 ', city: 'צפת' },
    { id: 'f2', address: '', city: 'ירושלים' },
    { id: 'f3', address: 'הבנים 3', city: '  ' },
    { id: 'f4', address: '', city: '' },
    { id: 'f9', address: 'עצירה של v2 בלבד', city: '' },
  ],
};
const C = [
  ['d1', 'v1', ['הרצל 1, צפת', 'ירושלים', 'הבנים 3']],
  ['d1', 'v2', ['עצירה של v2 בלבד']],
  ['d2', 'v1', ['הרצל 1, צפת']],
  ['d3', 'v1', []],
];
let f = 0;
for (const [dayId, volId, w] of C) {
  const g = volunteerRouteStops(db, dayId, volId);
  if (JSON.stringify(g) !== JSON.stringify(w)) {
    console.error(`✗ (${dayId},${volId}) ⇒ ${JSON.stringify(g)} ≠ ${JSON.stringify(w)}`);
    f = 1;
  }
}
if (f) process.exit(1);
console.log('✓ volunteer-route-stops: 4 דוגמאות-חוזה — ירוק');
