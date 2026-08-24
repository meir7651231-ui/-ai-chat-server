import { supKeyOf } from './sup-key-of.mjs';
const SHARED = '_shared_';
const C = [
  [{ forWho: 'אביגדור' }, 'אביגדור'],
  [{ forWho: '  רחל  ' }, 'רחל'],
  [{ forWho: '' }, SHARED],
  [{ forWho: '   ' }, SHARED],
  [{}, SHARED],
  [{ forWho: null }, SHARED],
];
let f = 0;
for (const [sp, w] of C) {
  const g = supKeyOf(sp, SHARED);
  if (g !== w) { console.error(`✗ ${JSON.stringify(sp)} ⇒ ${g} ≠ ${w}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ sup-key-of: 6 דוגמאות-חוזה — ירוק');
