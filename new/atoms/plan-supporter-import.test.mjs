import { planSupporterImport } from './plan-supporter-import.mjs';

// שקעים כבחוזה: נרמול = lowercase + הסרת כל הרווחים; fillEmpty = המקור.
const normName = (s) => String(s).toLowerCase().replace(/\s/g, '');
function fillEmpty(a, b) {
  const out = { ...a };
  Object.keys(b).forEach((k) => {
    if (k === 'hist') return;
    if (!out[k] && b[k]) out[k] = b[k];
  });
  if (a.hist?.length || b.hist?.length) out.hist = [...(a.hist ?? []), ...(b.hist ?? [])];
  if (a.ayinNames?.length || b.ayinNames?.length) out.ayinNames = [...(a.ayinNames ?? []), ...(b.ayinNames ?? [])];
  return out;
}
const run = (rows, existing) => planSupporterImport(rows, existing, normName, fillEmpty);
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
let f = 0;
const chk = (cond, label) => { if (!cond) { console.error('✗ ' + label); f = 1; } };

// 1. שם קיים ⇒ עדכון
const p1 = run([{ name: 'דוד לוי', phone: '050' }], [{ id: 's1', name: 'דוד לוי' }]);
chk(eq(p1, { updates: [{ id: 's1', row: { name: 'דוד לוי', phone: '050' } }], inserts: [] }), '1: שם קיים ⇒ עדכון');

// 2. התאמת-נרמול (רווח כפול)
const p2 = run([{ name: 'דוד  לוי', phone: '051' }], [{ id: 's1', name: 'דוד לוי' }]);
chk(p2.updates.length === 1 && p2.updates[0].id === 's1' && p2.inserts.length === 0, '2: נרמול-רווחים ⇒ עדכון לא הוספה');

// 3. קיבוץ פר-id — hist באורך 2
const p3 = run(
  [
    { name: 'דוד לוי', phone: '', hist: [{ d: '2026-01-01', ils: 100 }] },
    { name: 'דוד לוי', phone: '', hist: [{ d: '2026-02-01', ils: 200 }] },
  ],
  [{ id: 's1', name: 'דוד לוי' }],
);
chk(p3.updates.length === 1 && p3.updates[0].row.hist.length === 2, '3: קיבוץ פר-id — היסטוריה נאספת (hist=2)');

// 4. מיזוג הוספות — הראשונה גוברת, השנייה ממלאת
const p4 = run(
  [
    { name: 'רות', phone: '', email: 'a@b' },
    { name: 'רות', phone: '052', email: '' },
  ],
  [],
);
chk(eq(p4, { updates: [], inserts: [{ name: 'רות', phone: '052', email: 'a@b' }] }), '4: מיזוג-הוספות דרך fillEmpty');

// 5. שורה בלי שם מדולגת
const p5 = run([{ name: '  ', phone: '050' }], [{ id: 's1', name: 'דוד לוי' }]);
chk(p5.updates.length === 0 && p5.inserts.length === 0, '5: שורה ריקת-שם מדולגת');

if (f) process.exit(1);
console.log('✓ plan-supporter-import: 5 דוגמאות-חוזה — ירוק');
