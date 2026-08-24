import { DAY_NAMES } from './week-day-names.mjs';
let f=0; const ck=(n,g,w)=>{ if(JSON.stringify(g)!==JSON.stringify(w)){console.error(`✗ ${n}: ${JSON.stringify(g)} ≠ ${JSON.stringify(w)}`);f=1;} };
ck('length', DAY_NAMES.length, 7);
ck('[0]', DAY_NAMES[0], 'ראשון');
ck('[3]', DAY_NAMES[3], 'רביעי');
ck('[5]', DAY_NAMES[5], 'שישי');
ck('[6]', DAY_NAMES[6], 'שבת');
ck('full', DAY_NAMES, ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת']);
if(f)process.exit(1); console.log('✓ week-day-names: 6 דוגמאות-חוזה — ירוק (שבוע מלא כולל שבת)');
