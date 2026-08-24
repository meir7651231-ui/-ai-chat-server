import { emptyDiff } from './empty-diff.mjs';
const C = [
  [{ sets: [], deletes: [], meta: null }, true, 'ריק לגמרי'],
  [{ sets: [{ col: 'families', id: 'f1', data: { id: 'f1' } }], deletes: [], meta: null }, false, 'יש set'],
  [{ sets: [], deletes: [{ col: 'events', id: 'e9' }], meta: null }, false, 'יש delete'],
  [{ sets: [], deletes: [], meta: { seq: 12 } }, false, 'יש meta'],
  [{ sets: [], deletes: [], meta: undefined }, false, 'meta=undefined אינו null'],
];
let f = 0;
for (const [d, want, name] of C) {
  const got = emptyDiff(d);
  if (got !== want) { console.error(`✗ ${name} ⇒ ${got} ≠ ${want}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ empty-diff: 5 דוגמאות-חוזה — ירוק');
