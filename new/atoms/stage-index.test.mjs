import { stageIndex as __pure_stageIndex } from './stage-index.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v2; בדיקה לא מייבאת אטום-שכן)
const __d_stageIndex_AYIN_STAGES = ['new', 'lead', 'eyes', 'answer', 'done'];
const stageIndex = (...a) => __pure_stageIndex(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_stageIndex_AYIN_STAGES);
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
