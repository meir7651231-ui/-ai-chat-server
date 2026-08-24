import { filterRedemptions } from './filter-redemptions.mjs';
let f = 0;
const eq = (a, b, msg) => { if (JSON.stringify(a) !== JSON.stringify(b)) { console.error(`✗ ${msg} ⇒ ${JSON.stringify(a)}`); f = 1; } };

// dateInRange-מזויף בהתאם לחוזה החוט המשותף: טווח כוללני, קצה ריק=פתוח
const dateInRange = (iso, fromIso, toIso) => (!fromIso || iso >= fromIso) && (!toIso || iso <= toIso);

const r1 = { id: 'r1', date: '2026-01-01' };
const r2 = { id: 'r2', date: '2026-02-15', voidedAt: '2026-02-16' };
const r3 = { id: 'r3', date: '2026-03-01' };
const a = { redemptions: [r1, r2, r3] };
const ids = (out) => out.map((r) => r.id);

// 1) טווח פתוח + includeVoided=true ⇒ הכול
eq(ids(filterRedemptions(a, '', '', true, dateInRange)), ['r1', 'r2', 'r3'], 'טווח פתוח כולל-מבוטל שגוי');

// 2) includeVoided=false ⇒ המבוטל בחוץ
eq(ids(filterRedemptions(a, '', '', false, dateInRange)), ['r1', 'r3'], 'המבוטל לא הוחרג');

// 3) קצה עליון כוללני
eq(ids(filterRedemptions(a, '2026-02-01', '2026-03-01', true, dateInRange)), ['r2', 'r3'], 'קצה עליון לא כוללני');

// 4) טווח יום-אחד כוללני משני הקצוות
eq(ids(filterRedemptions(a, '2026-01-01', '2026-01-01', false, dateInRange)), ['r1'], 'טווח יום-אחד שגוי');

// 5) ריק ⇒ ריק
eq(filterRedemptions({ redemptions: [] }, '', '', true, dateInRange), [], 'ריק לא החזיר []');

if (f) process.exit(1);
console.log('✓ filter-redemptions: 5 דוגמאות-חוזה — ירוק');
