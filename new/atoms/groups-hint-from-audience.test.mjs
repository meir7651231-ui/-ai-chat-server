import { groupsHintFromAudience } from './groups-hint-from-audience.mjs';
const C = [
  ['3 קבוצות', 3],
  ['נפגשים 5 פעמים בשבוע', 5],
  ['4  קבוצות', 4],
  ['1 קבוצות', null],
  ['13 קבוצות', null],
  ['בנות בית ספר', null],
  [undefined, null],
];
let f = 0;
for (const [a, w] of C) {
  const g = groupsHintFromAudience(a);
  if (g !== w) {
    console.error(`✗ ${JSON.stringify(a)} ⇒ ${g} ≠ ${w}`);
    f = 1;
  }
}
if (f) process.exit(1);
console.log('✓ groups-hint-from-audience: 7 דוגמאות-חוזה — ירוק');
