import { enrollStatusMeta as __pure_enrollStatusMeta } from './enroll-status-meta.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_enrollStatusMeta_ENROLL_STATUS_META_T = {
  k1: "paused",
  k2: "מוקפא",
  k3: "#fdf1d4",
  k4: "ended",
  k5: "הסתיים",
  k6: "#eceae2",
  k7: "wait",
  k8: "רשימת-המתנה ⏳",
  k9: "#e7edf5",
  k10: "פעיל",
};
const enrollStatusMeta = (...a) => __pure_enrollStatusMeta(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_enrollStatusMeta_ENROLL_STATUS_META_T);
const C = [
  [{ status: 'paused' }, { label: 'מוקפא', bg: '#fdf1d4', c: '#9a6414' }, 'מוקפא'],
  [{ status: 'ended' }, { label: 'הסתיים', bg: '#eceae2', c: '#8b8474' }, 'הסתיים'],
  [{ status: 'wait' }, { label: 'רשימת-המתנה ⏳', bg: '#e7edf5', c: '#3a5a86' }, 'רשימת-המתנה'],
  [{ status: 'active' }, { label: 'פעיל', bg: '#e4f5ea', c: '#12803c' }, 'פעיל'],
  [{}, { label: 'פעיל', bg: '#e4f5ea', c: '#12803c' }, 'חסר-סטטוס ⇒ פעיל'],
];
let f = 0;
for (const [e, want, name] of C) {
  const got = enrollStatusMeta(e);
  if (got.label !== want.label || got.bg !== want.bg || got.c !== want.c) {
    console.error(`✗ ${name} ⇒ ${JSON.stringify(got)} ≠ ${JSON.stringify(want)}`); f = 1;
  }
}
if (f) process.exit(1);
console.log('✓ enroll-status-meta: 5 דוגמאות-חוזה — ירוק');
