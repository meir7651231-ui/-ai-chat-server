import { receiptVerifyCode } from './receipt-verify-code.mjs';
const C=[
  [['R-0001',180,'₪','2026-08-05'],'0I5-MI1'],
  [['R-0001',180,'','2026-08-05T12:00:00'],'0I5-MI1'],
  [['R-0001',181,'₪','2026-08-05'],'N3T-66S'],
  [['R-0002',180,'₪','2026-08-05'],'7RO-NJ2'],
  [['D-0042',500,'$','2026-01-01'],'PG5-8EB'],
];
let f=0; for(const [a,w] of C){const g=receiptVerifyCode(...a); if(g!==w){console.error(`✗ ${JSON.stringify(a)} ⇒ ${g} ≠ ${w}`);f=1;}}
if(f)process.exit(1); console.log('✓ receipt-verify-code: 5 דוגמאות-חוזה — ירוק');
