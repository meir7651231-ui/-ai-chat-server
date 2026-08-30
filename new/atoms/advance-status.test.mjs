import { advanceStatus as __pure_advanceStatus } from './advance-status.mjs';
const __d_advanceStatus_ADVANCE_STATUS_T = {
  k1: "delivered",
};
// צילום-מקומי מ-advance-status-data + עטיפת-כריכה (מנוע-הטיהור v2; בדיקה לא מייבאת אטום-שכן)
const ORDER = ['pickup', 'enroute', 'delivered'];
const advanceStatus = (...a) => __pure_advanceStatus(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), ORDER, __d_advanceStatus_ADVANCE_STATUS_T);
const C = [
  ['pickup', 'enroute'],
  ['enroute', 'delivered'],
  ['delivered', 'delivered'],
  ['שטויות', 'delivered'],
  ['', 'delivered'],
];
let f = 0;
for (const [a, w] of C) {
  const g = advanceStatus(a);
  if (g !== w) { console.error(`✗ ${JSON.stringify(a)} ⇒ ${g} ≠ ${w}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ advance-status: 5 דוגמאות-חוזה — ירוק');
