import { receiptVerifyCode as __pure_receiptVerifyCode } from './receipt-verify-code.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_receipt_verify_code_T = {
  k1: 10,
  k2: 2166136261,
  k3: 16777619,
  k4: 36,
};
const receiptVerifyCode = (...a) => __pure_receiptVerifyCode(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_receipt_verify_code_T);
const C=[
  [['R-0001',180,'₪','2026-08-05'],'0I5-MI1'],
  [['R-0001',180,'','2026-08-05T12:00:00'],'0I5-MI1'],
  [['R-0001',181,'₪','2026-08-05'],'N3T-66S'],
  [['R-0002',180,'₪','2026-08-05'],'7RO-NJ2'],
  [['D-0042',500,'$','2026-01-01'],'PG5-8EB'],
];
let f=0; for(const [a,w] of C){const g=receiptVerifyCode(...a); if(g!==w){console.error(`✗ ${JSON.stringify(a)} ⇒ ${g} ≠ ${w}`);f=1;}}
if(f)process.exit(1); console.log('✓ receipt-verify-code: 5 דוגמאות-חוזה — ירוק');
