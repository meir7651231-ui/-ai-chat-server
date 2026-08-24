import { holidayAllowed } from './holiday-allowed.mjs';
const C = [
  [{}, 'פורים', true],
  [{ holidays: [] }, 'חנוכה', true],
  [{ holidays: ['פורים', 'חנוכה'] }, 'פורים', true],
  [{ holidays: ['פורים'] }, 'חנוכה', false],
  [{ holidays: ['פורים'] }, 'פורים ', false],
];
let f = 0;
for (const [ri, name, want] of C) {
  const got = holidayAllowed(ri, name);
  if (got !== want) { console.error(`✗ ${JSON.stringify(ri)} · "${name}" ⇒ ${got} ≠ ${want}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ holiday-allowed: 5 דוגמאות-חוזה — ירוק');
