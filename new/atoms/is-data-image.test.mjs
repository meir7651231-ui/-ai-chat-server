import { isDataImage } from './is-data-image.mjs';
const C = [
  ['data:image/png;base64,iVBORw0K', true],
  ['data:image/jpeg;base64,/9j/4AAQ', true],
  ['data:image/jpg;base64,/9j/', true],
  ['data:image/webp;base64,UklGR', true],
  ['data:image/gif;base64,R0lGO', true],
  ['data:image/svg+xml;base64,PHN2Zw==', false],
  ['https://x.example/a.png', false],
  ['data:image/png,AAAA', false],
  [null, false],
  [42, false],
  [{}, false],
];
let f = 0;
for (const [s, w] of C) {
  const g = isDataImage(s);
  if (g !== w) { console.error(`✗ ${JSON.stringify(s)} ⇒ ${g} ≠ ${w}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ is-data-image: 11 בדיקות מ-7 דוגמאות-חוזה — ירוק (svg מוחרג במכוון)');
