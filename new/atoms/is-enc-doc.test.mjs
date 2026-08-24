import { isEncDoc } from './is-enc-doc.mjs';
const C = [
  [{ enc: 'q1XZ', iv: 'AAAAAAAAAAAAAAAA' }, true],
  [{ enc: 'q1XZ' }, false],
  [{ iv: 'AAAA' }, false],
  [null, false],
  [undefined, false],
  ['enc', false],
  [42, false],
  [{ enc: 5, iv: 'AAAA' }, false],
  [{ enc: 'q1XZ', iv: 'AAAA', meta: { v: 1 } }, true],
  [{}, false],
];
let f = 0;
for (const [d, w] of C) {
  const g = isEncDoc(d);
  if (g !== w) { console.error(`✗ ${JSON.stringify(d)} ⇒ ${g} ≠ ${w}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ is-enc-doc: 10 בדיקות מ-7 דוגמאות-חוזה — ירוק (שער failure-safe מבני)');
