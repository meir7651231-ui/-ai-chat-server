import { roomInfoLabel as __pure_roomInfoLabel } from './room-info-label.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_roomInfoLabel_ROOM_INFO_LABEL_T = {
  k1: "משבצות של ",
  k2: " דק׳",
  k3: " · עד ",
  k4: " משתתפים",
  k5: " · נגיש",
};
const roomInfoLabel = (...a) => __pure_roomInfoLabel(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_roomInfoLabel_ROOM_INFO_LABEL_T);
const C = [
  [{ slot: 45, cap: 12, access: true, eq: { מקרן: true, מזגן: false, לוח: true } },
    'משבצות של 45 דק׳ · עד 12 משתתפים · נגיש · מקרן, לוח'],
  [{}, 'משבצות של 60 דק׳'],
  [{ slot: 30, cap: 0 }, 'משבצות של 30 דק׳'],
  [{ eq: { א: true, ב: true, ג: true, ד: true } }, 'משבצות של 60 דק׳ · א, ב, ג'],
  [{ access: true }, 'משבצות של 60 דק׳ · נגיש'],
];
let f = 0;
for (const [room, want] of C) {
  const got = roomInfoLabel(room);
  if (got !== want) { console.error(`✗ ${JSON.stringify(room)} ⇒ ${got} ≠ ${want}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ room-info-label: 5 דוגמאות-חוזה — ירוק');
