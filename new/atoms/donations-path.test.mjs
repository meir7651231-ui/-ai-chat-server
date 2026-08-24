import { donationsPath } from './donations-path.mjs';
// שקעים מוזרקים לפי חוזי-השכנים (הבדיקה לא מייבאת אטום אחר — חוק-4)
const colPath = (slug, cloudRoot, col) => (cloudRoot ? col : 'orgs/' + slug + '/' + col);
const COL = 'donations';
const C = [
  [['demo', true], 'donations'],
  [['demo', false], 'orgs/demo/donations'],
  [['kehila', false], 'orgs/kehila/donations'],
];
let f = 0;
for (const [[slug, root], w] of C) {
  const g = donationsPath(slug, root, colPath, COL);
  if (g !== w) { console.error(`✗ donationsPath('${slug}', ${root}) = ${g} ≠ ${w}`); f = 1; }
  if (g !== colPath(slug, root, COL)) { console.error(`✗ שקילות-שקע נשברה עבור ('${slug}', ${root})`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ donations-path: 3 דוגמאות-חוזה + שקילות-שקע — ירוק');
