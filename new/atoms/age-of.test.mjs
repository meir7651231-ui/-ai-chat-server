import { ageOf } from './age-of.mjs';
const NOW = new Date('2026-08-24T12:00:00');
const C=[['2000-08-24',26],['2000-08-25',25],['2000-08-23',26],['',null],['שבור',null]];
let f=0; for(const [b,w] of C){const g=ageOf(b,NOW); if(g!==w){console.error(`✗ ageOf(${b}) = ${g} ≠ ${w}`);f=1;}}
if(f)process.exit(1); console.log('✓ age-of: 5 דוגמאות-חוזה (שעון-מוזרק) — ירוק');
