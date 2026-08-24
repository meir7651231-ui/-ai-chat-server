import { supHasRegion } from './sup-has-region.mjs';
const ap = sp => sp.rows;
const C=[
  [[{rows:[{region:'il'}]},'il',ap],true],
  [[{rows:[{region:'il'}]},'intl',ap],false],
  [[{rows:[]},'il',ap],false],
  [[{rows:[{region:'intl'},{region:'il'}]},'intl',ap],true],
  [[{rows:[{region:'intl'},{region:'il'}]},'il',ap],true],
  [[{rows:[{region:'intl'}]},'il',ap],false],
];
let f=0; for(const [a,w] of C){const g=supHasRegion(...a); if(g!==w){console.error(`✗ ${JSON.stringify(a[0])}/${a[1]} ⇒ ${g} ≠ ${w}`);f=1;}}
if(f)process.exit(1); console.log('✓ sup-has-region: 6 דוגמאות-חוזה — ירוק');
