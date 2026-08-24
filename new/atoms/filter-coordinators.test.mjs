import { filterCoordinators } from './filter-coordinators.mjs';
let f = 0;
const eq = (name, got, want) => {
  if (JSON.stringify(got) !== JSON.stringify(want)) { console.error(`✗ ${name}: ${JSON.stringify(got)} ≠ ${JSON.stringify(want)}`); f = 1; }
};

// שקעים מקומיים לבדיקה (הבדיקה מייבאת רק את האטום שלה)
const TOTAL = { c1: 300, c2: 500, c3: 0 };
const LAST = { c1: '2026-03-01', c2: '2026-01-15', c3: '' };
const coordinatorTotal = (boxes, id) => TOTAL[id];
const coordinatorLastCollection = (boxes, id) => LAST[id];
const smartFilter = (q, items, getTerms) =>
  !q ? items.slice() : items.filter((it) => getTerms(it).some((t) => String(t).includes(q)));
const S = [smartFilter, coordinatorTotal, coordinatorLastCollection];

const coords = [
  { id: 'c1', name: 'רבקה כהן', active: true, score: 5 },
  { id: 'c2', name: 'שרה לוי', active: false, score: 9 },
  { id: 'c3', name: 'לאה מזרחי', active: true, score: 7 },
];
const boxes = [];
const ids = (rows) => rows.map((r) => r.id);

eq('דוגמה 1 · onlyActive+name', ids(filterCoordinators(coords, boxes, '', true, 'name', ...S)), ['c3', 'c1']);
eq('דוגמה 2 · score יורד', ids(filterCoordinators(coords, boxes, '', false, 'score', ...S)), ['c2', 'c3', 'c1']);
eq('דוגמה 3 · total יורד', ids(filterCoordinators(coords, boxes, '', false, 'total', ...S)), ['c2', 'c1', 'c3']);
eq('דוגמה 4 · stale — מעולם-לא ראשון', ids(filterCoordinators(coords, boxes, '', false, 'stale', ...S)), ['c3', 'c2', 'c1']);
eq('דוגמה 5 · q=כהן (מילת-שם)', ids(filterCoordinators(coords, boxes, 'כהן', false, 'name', ...S)), ['c1']);
eq('דוגמה 6 · הקלט לא השתנה', ids(coords), ['c1', 'c2', 'c3']);

if (f) process.exit(1);
console.log('✓ filter-coordinators: 6 דוגמאות-חוזה — ירוק');
