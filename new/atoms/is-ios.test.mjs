import { isIos as __pure_isIos } from './is-ios.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_isIos_IS_IOS_T = {
  k1: "undefined",
};
const isIos = (...a) => __pure_isIos(...a, ...Array(Math.max(0, 0 - a.length)).fill(undefined), __d_isIos_IS_IOS_T);
if (JSON.stringify(isIos()) !== "false") { console.error('✗ סטה'); process.exit(1); }
console.log('✓ is-ios: צילום-גטר — ירוק');
