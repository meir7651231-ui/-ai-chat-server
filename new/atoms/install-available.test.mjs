import { installAvailable } from './install-available.mjs';
const C = [
  [null, false],
  [{ prompt() {}, userChoice: {} }, true],
  [{}, true],
  [undefined, true], // נאמן-למקור: `!== null` בלבד — הקופסה מחויבת להזריק null-או-אירוע
];
let f = 0;
for (const [v, w] of C) {
  const g = installAvailable(v);
  if (g !== w) { console.error(`✗ ${JSON.stringify(v)} ⇒ ${g} ≠ ${w}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ install-available: 4 דוגמאות-חוזה — ירוק');
