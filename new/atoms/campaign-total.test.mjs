import { campaignTotal } from './campaign-total.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const boxes = [
  { collections: [{ campaignId: 'c1', amount: 100 }, { campaignId: 'c2', amount: 50 }] },
  { collections: [{ campaignId: 'c1', amount: 30 }] },
];
// 1) סכום חוצה-קופות
ok(campaignTotal(boxes, 'c1') === 130, "c1 ≠ 130");
// 2) קמפיין שני
ok(campaignTotal(boxes, 'c2') === 50, "c2 ≠ 50");
// 3) לא-סופי מדולג
ok(campaignTotal([{ collections: [{ campaignId: 'c1', amount: NaN }, { campaignId: 'c1', amount: 20 }] }], 'c1') === 20, 'NaN לא דולג');
// 4) בלי קופות
ok(campaignTotal([], 'c1') === 0, 'ריק ≠ 0');
// 5) קמפיין לא-קיים
ok(campaignTotal(boxes, 'zzz') === 0, 'לא-קיים ≠ 0');
if (f) process.exit(1);
console.log('✓ campaign-total: 5 דוגמאות-חוזה — ירוק');
