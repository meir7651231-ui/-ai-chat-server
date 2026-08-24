import { campaignCsvRows } from './campaign-csv-rows.mjs';

const LABELS = { donated: 'תרם/ה', noanswer: 'לא ענה' };
const nameOf = (id) => ({ s7: 'ראובן', s9: 'שמעון' })[id] ?? '?';

let f = 0;
const eq = (n, got, want) => {
  const g = JSON.stringify(got), w = JSON.stringify(want);
  if (g !== w) { console.error(`✗ דוגמה ${n}: ${g} ≠ ${w}`); f = 1; }
};

// 1 · יומן ריק — כותרת בלבד
eq('1', campaignCsvRows({ log: [] }, nameOf, LABELS), [['שם', 'תוצאה', 'הערה', 'מתי']]);
// 2+3 · שורה פר-ניסיון, בסדר-היומן, note חסר ⇒ ''
const c = { log: [
  { id: 's7', outcome: 'donated', note: 'הבטיח 100', at: '2026-08-20' },
  { id: 's9', outcome: 'noanswer', at: '2026-08-21' },
] };
eq('2', campaignCsvRows(c, nameOf, LABELS), [
  ['שם', 'תוצאה', 'הערה', 'מתי'],
  ['ראובן', 'תרם/ה', 'הבטיח 100', '2026-08-20'],
  ['שמעון', 'לא ענה', '', '2026-08-21'],
]);

if (f) process.exit(1);
console.log('✓ campaign-csv-rows: 3 דוגמאות-חוזה — ירוק');
