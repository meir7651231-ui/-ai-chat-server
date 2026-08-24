import { itemRemaining } from './item-remaining.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
// שקע חוזי (מדמה את שכן-המקור — מחריג מבוטלים)
const liveRedemptions = (a) => a.redemptions.filter((r) => !r.voidedAt);

const db = {
  shopItems: [
    { id: 'i1', stock: 5 },
    { id: 'i2' }, // בלי stock — ללא-מעקב
    { id: 'i3', stock: 1 },
  ],
  shopProducts: [
    { id: 'p1', components: [{ id: 'c1', itemId: 'i1' }, { id: 'c2', itemId: 'i2' }, { id: 'c3', itemId: 'i3' }] },
  ],
  shopAssignments: [
    { productId: 'p1', redemptions: [{ componentId: 'c1' }, { componentId: 'c1' }, { componentId: 'c2' }] },
    { productId: 'p1', redemptions: [{ componentId: 'c1' }, { componentId: 'c1', voidedAt: '2026-08-01' }] },
    { productId: 'pZZZ', redemptions: [{ componentId: 'c1' }] }, // חבילה לא-קיימת — מדולג
  ],
};

// 1) 5 − (2+1) מימושים-חיים של c1 = 2 (מבוטל הוחרג, pZZZ דולג, c2 לא נספר)
const r1 = itemRemaining(db, 'i1', liveRedemptions);
ok(r1 === 2, '1: (db,i1) ≠ 2 (קיבלנו ' + r1 + ')');

// 2) פריט בלי stock ⇒ null
ok(itemRemaining(db, 'i2', liveRedemptions) === null, '2: פריט ללא-מעקב ≠ null');

// 3) פריט לא-קיים ⇒ null
ok(itemRemaining(db, 'iZZZ', liveRedemptions) === null, '3: פריט לא-קיים ≠ null');

// 4) לא שלילי — i3{stock:1} עם 3 מימושים-חיים ⇒ 0
const db4 = {
  ...db,
  shopAssignments: [{ productId: 'p1', redemptions: [{ componentId: 'c3' }, { componentId: 'c3' }, { componentId: 'c3' }] }],
};
ok(itemRemaining(db4, 'i3', liveRedemptions) === 0, '4: מלאי-חסר ≠ 0 (שלילי?)');

// 5) בלי שיוכים כלל ⇒ המלאי המלא
ok(itemRemaining({ ...db, shopAssignments: [] }, 'i1', liveRedemptions) === 5, '5: בלי שיוכים ≠ 5');

if (f) process.exit(1);
console.log('✓ item-remaining: 5 דוגמאות-חוזה — ירוק');
