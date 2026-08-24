import { filterCollections } from './filter-collections.mjs';
let f = 0;
const eq = (name, got, want) => {
  if (JSON.stringify(got) !== JSON.stringify(want)) { console.error(`✗ ${name}: ${JSON.stringify(got)} ≠ ${JSON.stringify(want)}`); f = 1; }
};

// שקע נאמן-למקור (date-util.ts:30-32) — הבדיקה מייבאת רק את האטום שלה
const dateInRange = (iso, fromIso, toIso) => (!fromIso || iso >= fromIso) && (!toIso || iso <= toIso);

const k1 = { date: '2026-01-05', campaignId: 'c1', amount: 100 };
const k2 = { date: '2026-02-10', campaignId: '', amount: 50 };
const k3 = { date: '2026-03-15', campaignId: 'c1', amount: 70 };
const box = { collections: [k1, k2, k3] };
const dates = (rows) => rows.map((r) => r.date);

eq('דוגמה 1 · טווח כוללני', dates(filterCollections(box, '2026-01-05', '2026-02-28', '', dateInRange)),
  ['2026-01-05', '2026-02-10']);
eq('דוגמה 2 · בלי גבולות', filterCollections(box, '', '', '', dateInRange).length, 3);
eq('דוגמה 3 · מבצע c1', dates(filterCollections(box, '', '', 'c1', dateInRange)),
  ['2026-01-05', '2026-03-15']);
eq('דוגמה 4 · שילוב טווח+מבצע', dates(filterCollections(box, '2026-02-01', '', 'c1', dateInRange)),
  ['2026-03-15']);
eq('דוגמה 5 · טווח-ריק', filterCollections(box, '', '2026-01-04', '', dateInRange), []);
eq('הקלט לא השתנה', box.collections.length, 3);

if (f) process.exit(1);
console.log('✓ filter-collections: 5 דוגמאות-חוזה — ירוק');
