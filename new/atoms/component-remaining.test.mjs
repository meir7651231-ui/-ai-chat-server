import { componentRemaining } from './component-remaining.mjs';
// שקע כמו-במקור: מימושים חיים = לא-מבוטלים.
const live = (a) => (a.redemptions ?? []).filter((r) => !r.voidedAt);
const A = (productId, ...reds) => ({ productId, redemptions: reds });
const R = (componentId, voidedAt) => ({ componentId, ...(voidedAt ? { voidedAt } : {}) });
let f = 0;
const chk = (n, got, want) => { if (got !== want) { console.error(`✗ דוגמה ${n}: ${got} ≠ ${want}`); f = 1; } };
chk(1, componentRemaining('c1', 'p1', [A('p1', R('c1'))], undefined, live), null);
chk(2, componentRemaining('c1', 'p1', [A('p1', R('c1')), A('p1', R('c1'))], 5, live), 3);
chk(3, componentRemaining('c1', 'p1', [A('p2', R('c1'))], 5, live), 5);
chk(4, componentRemaining('c1', 'p1', [A('p1', R('c2'), R('c2'))], 5, live), 5);
chk(5, componentRemaining('c1', 'p1', [A('p1', R('c1'), R('c1'), R('c1'))], 1, live), 0);
chk(6, componentRemaining('c1', 'p1', [A('p1', R('c1'), R('c1', '2026-08-01'))], 2, live), 1);
chk(7, componentRemaining('c1', 'p1', [], 0, live), 0);
if (f) process.exit(1);
console.log('✓ component-remaining: 7 דוגמאות-חוזה — ירוק');
