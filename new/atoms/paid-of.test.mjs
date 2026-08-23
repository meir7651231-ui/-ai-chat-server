import { paidOf } from './paid-of.mjs';
let f=0;
if(paidOf({payments:[{amount:100},{amount:50}]})!==150){console.error('✗ בסיסי');f=1;}
if(paidOf({payments:[]})!==0||paidOf({})!==0){console.error('✗ ריק');f=1;}
if(paidOf({payments:[{amount:100},{amount:NaN},{amount:50}]})!==150){console.error('✗ NaN');f=1;}
if(f)process.exit(1); console.log('✓ paid-of: 4 דוגמאות-חוזה — ירוק');
