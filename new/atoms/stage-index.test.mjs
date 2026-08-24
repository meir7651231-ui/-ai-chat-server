import { stageIndex } from './stage-index.mjs';
let f = 0;
const eq = (a, b, msg) => { if (a !== b) { console.error(`✗ ${msg} ⇒ ${JSON.stringify(a)}`); f = 1; } };

// 1-3) חמשת השלבים בסדרם
eq(stageIndex('new'), 0, 'new שגוי');
eq(stageIndex('lead'), 1, 'lead שגוי');
eq(stageIndex('eyes'), 2, 'eyes שגוי');
eq(stageIndex('answer'), 3, 'answer שגוי');
eq(stageIndex('done'), 4, 'done שגוי');

// 4) לא-מוכר ⇒ 0 (לא ‎-1)
eq(stageIndex('foo'), 0, 'לא-מוכר לא נפל ל-0');

if (f) process.exit(1);
console.log('✓ stage-index: 4 דוגמאות-חוזה — ירוק');
