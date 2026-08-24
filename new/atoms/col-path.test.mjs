import { colPath } from './col-path.mjs';
const C = [
  [['demo', true, 'families'], 'families'],
  [['demo', false, 'families'], 'orgs/demo/families'],
  [['kehila', false, 'supporters'], 'orgs/kehila/supporters'],
  [['x', true, 'donations'], 'donations'],
  [['', false, 'meta'], 'orgs//meta'],
];
let f = 0;
for (const [args, want] of C) {
  const got = colPath(...args);
  if (got !== want) { console.error(`✗ ${JSON.stringify(args)} ⇒ ${got} ≠ ${want}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ col-path: 5 דוגמאות-חוזה — ירוק');
