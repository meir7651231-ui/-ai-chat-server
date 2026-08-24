import { donAllowedKeys } from './don-allowed-keys.mjs';
const SHARED = '_shared_';
let f = 0;
const eq = (name, got, want) => {
  if (JSON.stringify(got) !== JSON.stringify(want)) { console.error(`✗ ${name}: ${JSON.stringify(got)} ≠ ${JSON.stringify(want)}`); f = 1; }
};
eq('בסיס', donAllowedKeys(['ישיבה', 'כולל'], SHARED), ['ישיבה', 'כולל', SHARED]);
eq('חיטוי', donAllowedKeys([' ישיבה ', 'ישיבה', ''], SHARED), ['ישיבה', SHARED]);
eq('ריק', donAllowedKeys([], SHARED), [SHARED]);
eq('רווחים', donAllowedKeys(['  ', '\t'], SHARED), [SHARED]);
const many = Array.from({ length: 35 }, (_, i) => 'k' + (i + 1));
const got35 = donAllowedKeys(many, SHARED);
eq('קיטום-29', got35, [...many.slice(0, 29), SHARED]);
if (got35.length !== 30) { console.error(`✗ אורך ${got35.length} ≠ 30`); f = 1; }
if (f) process.exit(1);
console.log('✓ don-allowed-keys: 5 דוגמאות-חוזה — ירוק');
