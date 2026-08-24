import { waitlistFor } from './waitlist-for.mjs';
const ids = (arr) => arr.map((e) => e.id).join(',');
let f = 0;
const chk = (label, got, want) => {
  if (got !== want) { console.error(`✗ ${label}: ${got} ≠ ${want}`); f = 1; }
};
// 1) FIFO — הוותיק ראשון
chk('FIFO', ids(waitlistFor([
  { id: 'e1', courseId: 'c1', status: 'wait', enrolledAt: '2026-02-01' },
  { id: 'e2', courseId: 'c1', status: 'wait', enrolledAt: '2026-01-15' },
], 'c1')), 'e2,e1');
// 2) רק 'wait' — פעיל אינו ממתין
chk('רק-wait', ids(waitlistFor([
  { id: 'e1', courseId: 'c1', status: 'active', enrolledAt: '2026-01-01' },
], 'c1')), '');
// 3) חוג אחר לא נכלל
chk('חוג-אחר', ids(waitlistFor([
  { id: 'e1', courseId: 'c2', status: 'wait' },
], 'c1')), '');
// 4) חסר-תאריך ⇒ '' ⇒ ראשון
chk('חסר-תאריך', ids(waitlistFor([
  { id: 'e2', courseId: 'c1', status: 'wait', enrolledAt: '2026-01-01' },
  { id: 'e1', courseId: 'c1', status: 'wait' },
], 'c1')), 'e1,e2');
// 5) ריק ⇒ ריק
chk('ריק', ids(waitlistFor([], 'c1')), '');
if (f) process.exit(1);
console.log('✓ waitlist-for: 5 דוגמאות-חוזה — ירוק');
