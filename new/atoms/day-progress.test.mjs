import { dayProgress as __pure_dayProgress } from './day-progress.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_dayProgress_DAY_PROGRESS_T = {
  k1: "pickup",
  k2: "enroute",
  k3: "delivered",
};
const dayProgress = (...a) => __pure_dayProgress(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_dayProgress_DAY_PROGRESS_T);
// שקע-אמת כבחוזה: סינון db.deliveries לפי dayId (התנהגות deliveriesOfDay של maor)
const deliveriesOfDay = (db, dayId) => db.deliveries.filter((d) => d.dayId === dayId);
const db = { deliveries: [
  { dayId: 'd1', status: 'pickup' }, { dayId: 'd1', status: 'enroute' },
  { dayId: 'd1', status: 'delivered' }, { dayId: 'd1', status: 'delivered' },
  { dayId: 'd2', status: 'pickup' }, { dayId: 'd3', status: 'x' },
] };
const C = [
  ['d1', { total: 4, pickup: 1, enroute: 1, delivered: 2 }],
  ['d2', { total: 1, pickup: 1, enroute: 0, delivered: 0 }],
  ['d9', { total: 0, pickup: 0, enroute: 0, delivered: 0 }],
  ['d3', { total: 1, pickup: 0, enroute: 0, delivered: 0 }],
];
let f = 0;
for (const [day, want] of C) {
  const got = dayProgress(db, day, deliveriesOfDay);
  if (JSON.stringify(got) !== JSON.stringify(want)) { console.error(`✗ ${day} ⇒ ${JSON.stringify(got)} ≠ ${JSON.stringify(want)}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ day-progress: 4 דוגמאות-חוזה — ירוק');
