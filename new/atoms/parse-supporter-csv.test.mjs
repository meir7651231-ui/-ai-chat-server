import { deepStrictEqual, strictEqual } from 'node:assert';
import { parseSupporterCsv } from './parse-supporter-csv.mjs';

// שקעי-מיני לבדיקה (החוטים האמיתיים parse-csv/parse-supporter-grid מחווטים בקופסה).
const miniCsv = (text) => text.split('\n').map((l) => l.split(','));
const miniGrid = (rows) => rows.slice(1).filter((r) => r[0]).map((r) => ({ name: r[0] }));

// 1. הרכבה מלאה על טקסט אמיתי
deepStrictEqual(parseSupporterCsv('שם,טלפון\nדוד,050\nשרה,052', miniCsv, miniGrid),
  [{ name: 'דוד' }, { name: 'שרה' }]);

// 2. טקסט ריק ⇒ []
deepStrictEqual(parseSupporterCsv('', miniCsv, miniGrid), []);

// 3. הרכבה מדויקת — שקעי-ריגול: הטקסט עובר כמות-שהוא, הרשת עוברת ===, הפלט ===
const rowsOut = [['שם'], ['דוד']];
const gridOut = [{ name: 'דוד' }];
let gotText, gotRows;
const spyCsv = (t) => { gotText = t; return rowsOut; };
const spyGrid = (r) => { gotRows = r; return gridOut; };
const ret = parseSupporterCsv('הטקסט', spyCsv, spyGrid);
strictEqual(gotText, 'הטקסט');
strictEqual(gotRows, rowsOut);
strictEqual(ret, gridOut);

console.log('✓ parse-supporter-csv: 3 דוגמאות-חוזה (שקעים parseCsv/parseSupporterGrid) — ירוק');
