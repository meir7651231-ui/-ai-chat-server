import { ayinActionVisible as __pure_ayinActionVisible } from './ayin-action-visible.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_ayinActionVisible_AYIN_ACTION_VISIBLE_T = {
  k1: "done",
  k2: "new",
  k3: "eyes",
};
const ayinActionVisible = (...a) => __pure_ayinActionVisible(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_ayinActionVisible_AYIN_ACTION_VISIBLE_T);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
ok(ayinActionVisible({ stage: 'done', names: [{ name: 'א' }] }) === false, 'done ⇒ false');
ok(ayinActionVisible({ stage: 'new', names: [] }) === false, 'new בלי שמות ⇒ false');
ok(ayinActionVisible({ stage: 'new', names: [{ name: 'א' }] }) === true, 'new עם שם ⇒ true');
ok(ayinActionVisible({ stage: 'eyes', names: [{ eyes: '' }, {}] }) === false, 'eyes ריק/undefined ⇒ false');
ok(ayinActionVisible({ stage: 'eyes', names: [{ eyes: 0 }] }) === true, 'eyes=0 ⇒ true');
ok(ayinActionVisible({ stage: 'lead', names: [] }) === true, 'lead ⇒ true');
ok(ayinActionVisible({ stage: 'answer', names: [] }) === true, 'answer ⇒ true');
if (f) process.exit(1);
console.log('✓ ayin-action-visible: 7 דוגמאות-חוזה — ירוק');
