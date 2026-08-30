import { renewTargets as __pure_renewTargets } from './renew-targets.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_renewTargets_RENEW_TARGETS_T = {
  k1: "yes",
};
const renewTargets = (...a) => __pure_renewTargets(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_renewTargets_RENEW_TARGETS_T);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b, msg) => ok(JSON.stringify(a) === JSON.stringify(b), msg + ` ⇒ ${JSON.stringify(a)}`);

// 1) רק 'yes' שטרם-נרשם
const rows1 = [
  { id: 1, decision: 'yes', renewed: false },
  { id: 2, decision: 'no', renewed: false },
  { id: 3, decision: 'yes', renewed: true },
  { id: 4, decision: 'hold', renewed: false },
];
const out1 = renewTargets(rows1);
eq(out1, [{ id: 1, decision: 'yes', renewed: false }], 'סינון מועמדים שגוי');

// 2) שניים כשירים — הסדר נשמר
eq(renewTargets([{ id: 1, decision: 'yes', renewed: false }, { id: 2, decision: 'yes', renewed: false }]).map((r) => r.id),
  [1, 2], 'סדר לא נשמר');

// 3) טרם-הוחלט אינו מועמד
eq(renewTargets([{ id: 1, decision: '', renewed: false }]), [], 'טרם-הוחלט נכלל');

// 4) מערך ריק
eq(renewTargets([]), [], 'מערך ריק נכשל');

// 5) immutability + שימור-הפניות
ok(rows1.length === 4, 'הקלט שוכתב');
ok(out1 !== rows1, 'הפלט אינו מערך חדש');
ok(out1[0] === rows1[0], 'השורה המוחזרת אינה אותה הפניה');

if (f) process.exit(1);
console.log('✓ renew-targets: 5 דוגמאות-חוזה — ירוק');
