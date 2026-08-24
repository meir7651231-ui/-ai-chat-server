import { filterAyinBoard } from './filter-ayin-board.mjs';
let f = 0;
const eq = (name, got, want) => {
  if (JSON.stringify(got) !== JSON.stringify(want)) { console.error(`✗ ${name}: ${JSON.stringify(got)} ≠ ${JSON.stringify(want)}`); f = 1; }
};

// שקע נאמן-למקור (validate.ts:51) — הבדיקה מייבאת רק את האטום שלה
const normSearch = (t) => String(t || '')
  .toLowerCase()
  .replace(/[֑-ׇ]/g, '')
  .replace(/[ךםןףץ]/g, (ch) => ({ 'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ' })[ch])
  .replace(/['"׳״\-–._]/g, '')
  .trim();

const i1 = { supporter: 'רבקה כהן', name: 'עיניים', note: 'טלפון דחוף', done: false, stage: 'call' };
const i2 = { supporter: 'שרה לוי', name: 'ברכה', note: '', done: true, stage: 'visit' };
const i3 = { supporter: 'לאה', name: 'עיניים', note: '', done: false, stage: 'visit' };
const items = [i1, i2, i3];
const sup = (rows) => rows.map((r) => r.supporter);

eq('דוגמה 1 · wait', sup(filterAyinBoard(items, '', 'wait', null, normSearch)), ['רבקה כהן', 'לאה']);
eq('דוגמה 2 · done', sup(filterAyinBoard(items, '', 'done', null, normSearch)), ['שרה לוי']);
eq('דוגמה 3 · stage=visit', sup(filterAyinBoard(items, '', null, 'visit', normSearch)), ['שרה לוי', 'לאה']);
eq('דוגמה 4 · הכול-פתוח', filterAyinBoard(items, '', null, null, normSearch).length, 3);
eq('דוגמה 5 · סופיות מנורמלות', sup(filterAyinBoard(items, 'טלפונ', null, null, normSearch)), ['רבקה כהן']);
eq('דוגמה 6 · שילוב wait+visit', sup(filterAyinBoard(items, '', 'wait', 'visit', normSearch)), ['לאה']);
eq('הקלט לא השתנה', items.length, 3);

if (f) process.exit(1);
console.log('✓ filter-ayin-board: 6 דוגמאות-חוזה — ירוק');
