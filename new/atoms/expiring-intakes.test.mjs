import { expiringIntakes } from './expiring-intakes.mjs';
// מימוש-שקע לבדיקה — נאמן למקור (calLib.isoOf — תאריך מקומי):
const isoOf = (d) => {
  const p2 = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
};
const db = {
  shopItems: [{ id: 'a', name: 'קמח' }, { id: 'b', name: 'שמן' }],
  shopIntakes: [
    { id: 'i1', itemId: 'a', expiry: '2026-08-20', qty: 5 },
    { id: 'i2', itemId: 'b', expiry: '2026-08-30', qty: 2 },
    { id: 'i3', itemId: 'a', expiry: '2026-09-15' },
    { id: 'i4', itemId: 'c' },
    { id: 'i5', itemId: 'zz', expiry: '2026-08-25' },
  ],
};
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const R = expiringIntakes(db, '2026-08-24', isoOf);
ok(R.length === 3, 'אורך ' + R.length + ' ≠ 3 (i3 מעבר-לאופק, i4 בלי-expiry)');
ok(R[0].intake.id === 'i1' && R[0].itemName === 'קמח' && R[0].expired === true, '[0]: ' + JSON.stringify(R[0]));
ok(R[1].intake.id === 'i5' && R[1].itemName === '—' && R[1].expired === false, '[1] פריט-לא-נמצא: ' + JSON.stringify(R[1]));
ok(R[2].intake.id === 'i2' && R[2].itemName === 'שמן' && R[2].expired === false, '[2]: ' + JSON.stringify(R[2]));
// גבולות — expiry=האופק נכלל, expiry=היום לא-פג:
const B = expiringIntakes(
  { shopItems: [], shopIntakes: [{ id: 'h', itemId: 'x', expiry: '2026-08-31' }, { id: 't', itemId: 'x', expiry: '2026-08-24' }] },
  '2026-08-24', isoOf,
);
ok(B.length === 2, 'גבול-אופק: ' + B.length + ' ≠ 2');
ok(B.every((x) => x.expired === false), 'expiry=היום/אופק אמור להיות לא-פג');
// windowDays=0 ⇒ אופק=היום:
const Z = expiringIntakes(
  { shopItems: [], shopIntakes: [{ id: 'z1', itemId: 'x', expiry: '2026-08-30' }, { id: 'z2', itemId: 'x', expiry: '2026-08-24' }] },
  '2026-08-24', isoOf, 0,
);
ok(Z.length === 1 && Z[0].intake.id === 'z2', 'windowDays=0: ' + JSON.stringify(Z.map((x) => x.intake.id)));
if (f) process.exit(1);
console.log('✓ expiring-intakes: כל דוגמאות-החוזה — ירוק');
