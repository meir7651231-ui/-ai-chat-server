import { filterItems } from './filter-items.mjs';
let f = 0;
const eq = (a, b, msg) => { if (JSON.stringify(a) !== JSON.stringify(b)) { console.error(`✗ ${msg} ⇒ ${JSON.stringify(a)}`); f = 1; } };

const db = { shopItems: [
  { id: 'A', name: 'נר שבת' }, { id: 'B', name: 'יין' }, { id: 'C', name: 'חלה' },
  { id: 'D', name: 'דבש' }, { id: 'E', name: 'שמן' },
] };
const rems = { A: null, B: 0, C: 1, D: 2, E: 3 };
let remCalls = 0;
const fakeRem = (d, id) => { remCalls++; return rems[id]; };
const lastCall = { getTerms: null };
const fakeSmart = (q, items, getTerms) => { lastCall.getTerms = getTerms; return items; };
const ids = (out) => out.map((i) => i.id);

// 1) stockState='' ⇒ הכול, בלי קריאות itemRemaining
remCalls = 0;
eq(ids(filterItems(db, '', '', fakeRem, fakeSmart)), ['A', 'B', 'C', 'D', 'E'], "'' לא העביר הכול");
if (remCalls !== 0) { console.error('✗ itemRemaining נקרא למרות stockState ריק'); f = 1; }

// 2) untracked ⇒ רק null
eq(ids(filterItems(db, '', 'untracked', fakeRem, fakeSmart)), ['A'], 'untracked שגוי');

// 3) out ⇒ רק 0
eq(ids(filterItems(db, '', 'out', fakeRem, fakeSmart)), ['B'], 'out שגוי');

// 4) low ⇒ 0<rem≤2
eq(ids(filterItems(db, '', 'low', fakeRem, fakeSmart)), ['C', 'D'], 'low שגוי');

// 5) getTerms = השם + פיצול-מילים
eq(lastCall.getTerms({ name: 'נר שבת' }), ['נר שבת', 'נר', 'שבת'], 'getTerms שגוי');

if (f) process.exit(1);
console.log('✓ filter-items: 5 דוגמאות-חוזה — ירוק');
