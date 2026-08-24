import { evLabel } from './ev-label.mjs';
// שקע-evMeta כטבלת-maor (מקומי לבדיקה — הבדיקה מייבאת רק את האטום שלה)
const EV_META = {
  reminder: { label: 'תזכורת', bg: '#efe7f3', c: '#7c3aed' },
  call: { label: 'טלפון', bg: '#dff0ec', c: '#0f766e' },
  bday: { label: 'יום הולדת', bg: '#fbeef3', c: '#be185d' },
  custom: { label: 'אירוע', bg: '#e7edf5', c: '#3a5a86' },
};
const C = [
  [{ type: 'call' }, 'טלפון'],
  [{ type: 'bday' }, 'יום הולדת'],
  [{ type: 'custom', customType: 'ברית' }, 'ברית'],
  [{ type: 'custom', customType: '' }, 'אירוע'],
  [{ type: 'custom' }, 'אירוע'],
  [{ type: 'reminder', customType: 'יתעלם' }, 'תזכורת'],
];
let f = 0;
for (const [ev, w] of C) {
  const g = evLabel(ev, EV_META);
  if (g !== w) { console.error(`✗ ${JSON.stringify(ev)} ⇒ ${g} ≠ ${w}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ ev-label: 6 דוגמאות-חוזה — ירוק');
