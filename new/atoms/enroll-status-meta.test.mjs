import { enrollStatusMeta } from './enroll-status-meta.mjs';
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
