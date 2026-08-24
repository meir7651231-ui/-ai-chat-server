import { isEncrypted } from './is-encrypted.mjs';
const C = [
  [{ $enc: 2, iter: 600000, data: '...' }, true],
  [{ $enc: 2 }, true],
  [{ $enc: 1 }, false],
  [{ $enc: '2' }, false],
  [null, false],
  ['{"$enc":2}', false],
  [{}, false],
];
let f = 0;
for (const [a, w] of C) {
  const g = isEncrypted(a);
  if (g !== w) { console.error(`✗ ${JSON.stringify(a)} ⇒ ${g} ≠ ${w}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ is-encrypted: 7 דוגמאות-חוזה — ירוק');
