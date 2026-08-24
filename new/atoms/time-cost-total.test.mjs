import { timeCostTotal } from './time-cost-total.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b, msg) => ok(a === b, msg + ` ⇒ ${JSON.stringify(a)}`);

// 1) סכימה רגילה: 2×100 + 1.5×80 = 320
eq(timeCostTotal({ time: [{ hours: 2, rate: 100 }, { hours: 1.5, rate: 80 }] }), 320, 'סכימה שגויה');

// 2) שעתון ריק ⇒ 0
eq(timeCostTotal({ time: [] }), 0, 'ריק לא החזיר 0');

// 3) בלי time בכלל ⇒ 0
eq(timeCostTotal({}), 0, 'חסר-time לא החזיר 0');

// 4) שעות-כמחרוזת נכפות למספר
eq(timeCostTotal({ time: [{ hours: '3', rate: 50 }] }), 150, 'כפייה-מספרית נכשלה');

// 5) שעות לא-מספריות ⇒ 0
eq(timeCostTotal({ time: [{ hours: 'abc', rate: 100 }] }), 0, 'לא-מספר לא נפל ל-0');

// 6) בלי תעריף ⇒ 0
eq(timeCostTotal({ time: [{ hours: 4 }] }), 0, 'חסר-תעריף לא החזיר 0');

if (f) process.exit(1);
console.log('✓ time-cost-total: 6 דוגמאות-חוזה — ירוק');
