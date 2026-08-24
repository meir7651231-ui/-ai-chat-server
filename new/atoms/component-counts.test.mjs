import { componentCounts } from './component-counts.mjs';
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const p = (...kinds) => ({ components: kinds.map((kind) => ({ kind })) });
const C = [
  [p(), { meeting: 0, coupon: 0, gift: 0, holidayGift: 0 }],
  [p('meeting'), { meeting: 1, coupon: 0, gift: 0, holidayGift: 0 }],
  [p('coupon', 'coupon', 'gift'), { meeting: 0, coupon: 2, gift: 1, holidayGift: 0 }],
  [p('meeting', 'coupon', 'gift', 'holidayGift'), { meeting: 1, coupon: 1, gift: 1, holidayGift: 1 }],
  [p('holidayGift', 'holidayGift', 'holidayGift'), { meeting: 0, coupon: 0, gift: 0, holidayGift: 3 }],
];
let f = 0;
C.forEach(([a, w], i) => { const g = componentCounts(a); if (!eq(g, w)) { console.error(`✗ דוגמה ${i + 1}: ${JSON.stringify(g)} ≠ ${JSON.stringify(w)}`); f = 1; } });
if (f) process.exit(1);
console.log('✓ component-counts: 5 דוגמאות-חוזה — ירוק');
