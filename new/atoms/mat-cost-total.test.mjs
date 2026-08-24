import { matCostTotal } from './mat-cost-total.mjs';
let f = 0;
const eq = (a, w, msg) => { if (a !== w) { console.error(`✗ ${msg} ⇒ ${a} ≠ ${w}`); f = 1; } };

eq(matCostTotal({ mat: [{ qty: 2, cost: 50 }, { qty: 3, cost: 10 }] }), 130, 'סכימה בסיסית');
eq(matCostTotal({}), 0, 'בלי mat');
eq(matCostTotal({ mat: [] }), 0, 'mat ריק');
eq(matCostTotal({ mat: [{ qty: '2.5', cost: '4' }] }), 10, 'מחרוזות מספריות');
eq(matCostTotal({ mat: [{ qty: 'אבג', cost: 100 }] }), 0, 'כמות-זבל ⇒ 0');
eq(matCostTotal({ mat: [{ qty: 3 }] }), 0, 'מחיר חסר ⇒ 0');
eq(matCostTotal({ mat: [{ qty: 1, cost: 80 }, { qty: null, cost: 20 }] }), 80, 'שורה שבורה מדולגת');

if (f) process.exit(1);
console.log('✓ mat-cost-total: 7 דוגמאות-חוזה — ירוק');
