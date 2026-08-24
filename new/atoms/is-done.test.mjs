import { isDone } from './is-done.mjs';
const C = [
  [{ queue: [] }, true],
  [{ queue: ['s1'] }, false],
  [{ queue: ['s1', 's2', 's3'] }, false],
  [{ queue: [], log: [{ id: 's1', outcome: 'answered' }], total: 1 }, true],
];
let f = 0;
for (const [c, w] of C) {
  const g = isDone(c);
  if (g !== w) { console.error(`✗ ${JSON.stringify(c)} ⇒ ${g} ≠ ${w}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ is-done: 4 דוגמאות-חוזה — ירוק (רק ה-queue קובע)');
